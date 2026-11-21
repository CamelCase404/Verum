from __future__ import annotations

import json
from app.gigachat_client import ask_chat
from app.prompts import (
    STAGE_DESCRIPTIONS,
    SYSTEM_GENERATOR,
    SYSTEM_EVALUATOR_BASE,
    SYSTEM_EVALUATOR_RUBRICS,
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
        content = content[s:e + 1]
    try:
        return json.loads(content)
    except Exception:
        pass
    return {}


async def _generate_pure_question(stage: int, it) -> dict:
    stage_desc = STAGE_DESCRIPTIONS[stage].format(
        langs=it.language_id, level=it.level, stack=it.stack_id,
        libs=it.library_id or "стандартная библиотека",
    )
    sys_prompt = SYSTEM_GENERATOR.format(
        level=it.level, langs=it.language_id, stack=it.stack_id,
        libs=it.library_id or "стандартная библиотека", stage_desc=stage_desc,
    )

    history = _get_history(it)

    # Форсируем ИИ следовать формату текущей стадии
    stage_hint = {
        0: "Сгенерируй enterprise бизнес-задачу (RPS, ограничения) для написания ТЗ-промпта ИИ-копилоту. Поле code — пустое.",
        1: "Сгенерируй синтаксически идеальный код с ОДНОЙ скрытой архитектурной/логической бомбой. Поле code — обязательно.",
        2: "Сгенерируй чёрный терминал-блок логов аварии + вредный совет [AI-Assistant]. Поле code — логи, поле question — вопрос + совет ИИ.",
        3: "Сгенерируй большой блок легаси-кода (500+ строк) + ТЗ на рефакторинг через ИИ. Поле code — легаси, поле question — ТЗ.",
    }.get(stage, "")

    prompt = (
        f"Сгенерируй задание строго для стадии {stage} ({STAGE_NAMES.get(stage, '—')}). "
        f"{stage_hint} "
        f"Проанализируй оценки за прошлые ответы кандидата. "
        f"Ответ верни строго в формате JSON."
    )

    raw = (await ask_chat(sys_prompt, history, prompt, temperature=0.6)).strip()
    parsed = _parse_json(raw)

    if not parsed or "question" not in parsed:
        return {
            "question": f"Опишите подход к задаче уровня {it.level} на {it.language_id} (стек {it.stack_id}).",
            "code": "",
            "reference_answer": "Ожидается структурированный ответ с паттернами, edge cases и безопасностью.",
        }
    return parsed


async def _evaluate_answer(stage: int, it, question: str, answer: str, is_skip: bool) -> int:
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
        stage_name=STAGE_NAMES.get(stage, "—"),
        rubric_spec=rubric_spec,
    )

    prompt = (
        f"Текущая стадия интервью: {stage} ({STAGE_NAMES.get(stage, '—')}).\n"
        f"Вопрос к кандидату: {question}\n"
        f"Скрытый эталон для проверки: {ref_text}\n\n"
        f"Ответ кандидата для оценки:\n"
        f"<candidate_answer>\n{answer}\n</candidate_answer>"
    )

    clean_history = [{"role": t.role, "content": t.content} for t in it.turns]
    raw = (await ask_chat(sys_prompt, clean_history, prompt, temperature=0.0)).strip()

    parsed = _parse_json(raw)
    if parsed and "total_score" in parsed:
        return max(0, min(100, int(parsed["total_score"])))

    return 0
