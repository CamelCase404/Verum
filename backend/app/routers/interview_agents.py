from __future__ import annotations

import json

from app.prompts import (
    STAGE_DESCRIPTIONS,
    SYSTEM_EVALUATOR_BASE,
    SYSTEM_EVALUATOR_RUBRICS,
    SYSTEM_GENERATOR,
)

from app.gigachat_client import ask_chat
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
    if not code:
        return ""
    import re

    code = re.sub(r"^```[a-zA-Z]*\n", "", code.strip())
    code = re.sub(r"\n```$", "", code)
    return code.strip()


async def _generate_pure_question(stage: int, it) -> dict:
    stage_desc = STAGE_DESCRIPTIONS[stage].format(
        langs=it.language_id,
        level=it.level,
        stack=it.stack_id,
        libs=it.library_id or "стандартная библиотека",
    )
    stage_hint = {
        0: "Enterprise бизнес-задача. Поле code — пустая строка.",
        1: f"Production-код на {it.language_id} с одной логической ошибкой (15-40 строк) в поле code.",
        2: "Блок системных логов/stacktrace до 20 строк в поле code.",
    }
    stage_hints = stage_hint.get(stage, "")

    sys_prompt = SYSTEM_GENERATOR.format(
        level=it.level,
        langs=it.language_id,
        stack=it.stack_id,
        libs=it.library_id or "стандартная библиотека",
        stage_desc=stage_desc,
    )

    # История БЕЗ used_domains — просто вопросы и оценки
    history = []
    for t in it.turns:
        if t.role == "user":
            score_info = f" [Оценка ответа системой: {t.score or 0}/100 баллов]"
            history.append({"role": "user", "content": t.content + score_info})
        else:
            clean_content = t.content.split("\n\nКод:")[0]
            # ВАЖНО: не передаём chosen_domain, пусть ИИ сам видит тему по тексту
            history.append({"role": "assistant", "content": clean_content})

    # Только превью прошлых вопросов, чтобы ИИ не повторялся по смыслу
    past_questions = [
        t.content.split("\n\nКод:")[0][:200] for t in it.turns if t.role == "assistant"
    ]
    past_q_text = "\n- ".join(past_questions) if past_questions else "Пока нет"

    prompt = (
        f"Сгенерируй новое уникальное техническое задание для стадии {stage} "
        f"({STAGE_NAMES.get(stage, '—')}).\n\n"
        f"КРИТИЧЕСКОЕ ТРЕБОВАНИЕ: {stage_hints}\n\n"
        f"ПРЕДЫДУЩИЕ ВОПРОСЫ (не повторяй темы!):\n- {past_q_text}\n\n"
        f"ВАЖНО: Придумай принципиально новую ситуацию. Верни ТОЛЬКО валидный JSON."
    )

    for attempt in range(3):
        try:
            raw = (await ask_chat(sys_prompt, history, prompt, temperature=0.9)).strip()
            parsed = _parse_json(raw)
            if parsed and "question" in parsed:
                if "code" in parsed:
                    parsed["code"] = _clean_code(parsed["code"])
                # Обратная совместимость: маппим topic -> reference_data
                parsed["reference_answer"] = parsed.get("reference_answer", "")
                parsed["chosen_domain"] = parsed.get("topic", "")
                return parsed
        except Exception as e:
            print(f"⚠️ Generator attempt {attempt+1} error: {e}")

    # Фоллбэк по стадиям — на 1/2 всегда есть код/логи
    fallback_by_stage = {
        0: {
            "question": f"Составьте техническое задание для ИИ-копилота на разработку модуля на {it.language_id} ({it.level}, {it.library_id or 'стандартная библиотека'}). Опишите требования, ограничения и критерии приёмки.",
            "code": "",
            "reference_answer": "Ожидается структурированное ТЗ с архитектурными требованиями и обработкой ошибок.",
            "chosen_domain": "Свободная тема",
        },
        1: {
            "question": f"Найдите скрытую логическую ошибку в следующем коде на {it.language_id}:",
            "code": f"# Production-код на {it.language_id}\n# Найдите логическую ошибку\ndef process_data(items):\n    result = []\n    for i in range(len(items) + 1):\n        result.append(items[i].upper())\n    return result",
            "reference_answer": "Ошибка: range(len(items) + 1) приводит к IndexError. Должно быть range(len(items)).",
            "chosen_domain": "Свободная тема",
        },
        2: {
            "question": f"Диагностируйте инцидент по логам. ИИ-ассистент советует 'просто перезапустить сервис'. Оцените совет:",
            "code": "ERROR 2024-01-15 14:32:01 [pool] Connection pool exhausted\nERROR 2024-01-15 14:32:02 [db] Timeout waiting for connection (30s)\nWARN 2024-01-15 14:32:05 [api] Request queue depth: 1542\nERROR 2024-01-15 14:32:10 [db] Too many connections (max: 100)",
            "reference_answer": "Исчерпан пул соединений БД. Совет ИИ неверен. Нужны: проверка утечек, таймауты, оптимизация запросов.",
            "chosen_domain": "Свободная тема",
        },
    }
    return fallback_by_stage.get(stage, fallback_by_stage[0])


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
