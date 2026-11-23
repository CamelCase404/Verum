from __future__ import annotations

import json

from app.gigachat_client import ask_chat
from app.prompts import (
    STAGE_DESCRIPTIONS,
    SYSTEM_EVALUATOR_BASE,
    SYSTEM_EVALUATOR_RUBRICS,
    SYSTEM_GENERATOR,
)
from app.routers.interview_constants import STAGE_NAMES


def _get_history(it) -> list[dict]:
    history = []
    for t in it.turns:
        if t.role == "user":
            score_info = f" [Оценка ответа системой: {t.score if t.score is not None else 0}/100 баллов]"
            history.append({"role": "user", "content": t.content + score_info})
        else:
            history.append({"role": "assistant", "content": t.content})
    return history


def _parse_json(content: str) -> dict:
    content = content.strip()
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    s, e = content.find("{"), content.rfind("}")
    if s != -1 and e != -1 and e > s:
        content = content[s : e + 1]
    try:
        return json.loads(content)
    except Exception:
        pass
    return {}


def _clean_code(code: str) -> str:
    if not code: return ""
    import re
    code = re.sub(r'^```[a-zA-Z]*\n', '', code.strip())
    code = re.sub(r'\n```$', '', code)
    return code.strip()

async def _generate_pure_question(stage: int, it) -> dict:
    stage_desc = STAGE_DESCRIPTIONS[stage].format(
        langs=it.language_id,
        level=it.level,
        stack=it.stack_id,
        libs=it.library_id or "стандартная библиотека",
    )

    # ФИКС: Очищаем внутренний JSON шаблона от конфликтующих метасимволов
    stage_hints = {
        0: "Требуется enterprise бизнес-задача. Поле code обязано быть пустой строкой.",
        1: f"Требуется production-код на языке {it.language_id} с одной логической ошибкой от 15 до 40 строк в поле code.",
        2: "Требуется лаконичный блок системных логов или stacktrace до 20 строк в поле code.",
        3: f"Требуется запутанный легаси-код на языке {it.language_id} до 50 строк в поле code.",
    }
    stage_hint = stage_hints.get(stage, "")

    sys_prompt = SYSTEM_GENERATOR.format(
        level=it.level,
        langs=it.language_id,
        stack=it.stack_id,
        libs=it.library_id or "стандартная библиотека",
        stage_desc=stage_desc,
    )

    history = []
    used_domains = []
    for t in it.turns:
        if t.role == "user":
            score_info = f" [Оценка ответа системой: {t.score if t.score is not None else 0}/100 баллов]"
            history.append({"role": "user", "content": t.content + score_info})
        else:
            clean_content = t.content.split("\n\nКод:")[0]
            ref_data = getattr(t, "reference_data", None) or {}
            domain_tag = (
                ref_data.get("chosen_domain", "Не указан")
                if isinstance(ref_data, dict)
                else "Не указан"
            )
            if domain_tag != "Не указан" and domain_tag != "":
                used_domains.append(domain_tag)

            history.append(
                {
                    "role": "assistant",
                    "content": f"[Использованный домен: {domain_tag}] Вопрос: {clean_content}",
                }
            )

    past_questions = [t.content.split("\n\nКод:")[0][:100] for t in it.turns if t.role == "assistant"]
    past_q_text = "\n- ".join(past_questions)

    prompt = (
        f"Сгенерируй новое уникальное техническое задание для стадии {stage} ({STAGE_NAMES.get(stage, '—')}).\n"
        f"Критическое требование к наполнению полей: {stage_hint}\n"
        f"СПИСОК УЖЕ ИСПОЛЬЗОВАННЫХ ТЕМ: {', '.join(used_domains) if used_domains else 'Пока нет'}.\n"
        f"ПРЕДЫДУЩИЕ ВОПРОСЫ (НЕ ПОВТОРЯЙ ИХ!):\n- {past_q_text}\n\n"
        f"ВАЖНО: Придумай абсолютно новую ситуацию. Верни ТОЛЬКО валидный JSON."
    )

    for attempt in range(3):
        try:
            raw = (await ask_chat(sys_prompt, history, prompt, temperature=0.85)).strip()
            parsed = _parse_json(raw)
            if parsed and "question" in parsed:
                if "code" in parsed:
                    parsed["code"] = _clean_code(parsed["code"])
                return parsed
        except Exception as e:
            print(f"⚠️ Generator attempt {attempt+1} error: {e}")
            
    return {
        "question": f"Опишите подход к решению сложной архитектурной задачи на {it.language_id} (уровень {it.level}).",
        "code": "",
        "reference_answer": "Ожидается структурированный ответ.",
        "chosen_domain": "Разное",
    }


async def _evaluate_answer(
    stage: int, it, question: str, answer: str, is_skip: bool
) -> int:
    if is_skip:
        return 0

    assistant_turns = [t for t in it.turns if t.role == "assistant"]
    ref_text = ""
    if assistant_turns:
        ref_data = getattr(assistant_turns[-1], "reference_data", None)
        if ref_data and isinstance(ref_data, dict):
            ref_text = ref_data.get("reference_answer", "")

    rubric_spec = SYSTEM_EVALUATOR_RUBRICS.get(stage, SYSTEM_EVALUATOR_RUBRICS[0])
    sys_prompt = SYSTEM_EVALUATOR_BASE.format(
        stage_name=STAGE_NAMES.get(stage, "—"), rubric_spec=rubric_spec
    )

    prompt = (
        f"Текущая стадия интервью: {stage} ({STAGE_NAMES.get(stage, '—')}).\n"
        f"Вопрос к кандидату: {question}\n"
        f"Скрытый эталон для проверки: {ref_text}\n\n"
        f"Ответ кандидата для оценки:\n<candidate_answer>\n{answer}\n</candidate_answer>"
    )

    clean_history = [{"role": t.role, "content": t.content} for t in it.turns]
    raw = (await ask_chat(sys_prompt, clean_history, prompt, temperature=0.0)).strip()

    parsed = _parse_json(raw)
    if parsed and "total_score" in parsed:
        return max(0, min(100, int(parsed["total_score"])))
    return 0
