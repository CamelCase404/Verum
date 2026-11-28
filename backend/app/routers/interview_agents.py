from __future__ import annotations

import json
import re

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


_LIB_ALIASES = {
    "pytorch": ("torch", "pytorch"),
    "tensorflow": ("tensorflow", "keras"),
    "aspnet": ("aspnetcore", "aspnet"),
    "compose": ("compose", "androidx"),
    "rn": ("reactnative", "react"),
    "spring": ("springframework", "spring"),
    "unreal": ("unreal", "coreuobject"),
    "unity": ("unityengine", "unity"),
    "tidyverse": ("tidyverse", "dplyr", "ggplot2"),
    "nestjs": ("nestjs",),
    "gin": ("gingonic", "gin"),
    "fiber": ("gofiber", "fiber"),
    "next": ("next",),
}

_JSON_KEYS = ("question", "code", "reference_answer", "topic",
              "chosen_domain", "total_score", "feedback", "rubric")


def _escape_ctrl_in_strings(text: str) -> str:
    # Экранирует реальные переносы строк внутри JSON-строк
    out, in_str, esc = [], False, False
    for ch in text:
        if in_str:
            if esc:
                out.append(ch); esc = False; continue
            if ch == "\\":
                out.append(ch); esc = True; continue
            if ch == '"':
                out.append(ch); in_str = False; continue
            if ch == "\n": out.append("\\n"); continue
            if ch == "\r": out.append("\\r"); continue
            if ch == "\t": out.append("\\t"); continue
            out.append(ch)
        else:
            if ch == '"':
                in_str = True
            out.append(ch)
    return "".join(out)


def _extract_json_fields(text: str) -> dict:
    # Достаёт поля вручную, если JSON сломан полностью
    pos = []
    for k in _JSON_KEYS:
        for m in re.finditer(r'"' + k + r'"\s*:\s*"', text):
            pos.append((m.start(), m.end(), k))
    pos.sort()
    out = {}
    for i, (s, e, k) in enumerate(pos):
        end = pos[i + 1][0] if i + 1 < len(pos) else len(text)
        chunk = text[e:end].rstrip()
        chunk = re.sub(r'"\s*[,}]?\s*$', '', chunk)
        chunk = chunk.replace("\\n", "\n").replace("\\t", "\t")
        chunk = chunk.replace('\\"', '"').replace("\\\\", "\\")
        out[k] = chunk.strip()
    if "total_score" in out:
        m = re.search(r"\d+", str(out["total_score"]))
        out["total_score"] = int(m.group()) if m else 0
    return out


def _parse_json(content: str) -> dict:
    if not content:
        return {}
    text = content.strip()
    text = re.sub(r"^```[a-zA-Z]*\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    s, e = text.find("{"), text.rfind("}")
    if s != -1 and e > s:
        text = text[s:e + 1]
    try:
        obj = json.loads(text)
        if isinstance(obj, dict):
            return obj
    except Exception:
        pass
    try:
        obj = json.loads(_escape_ctrl_in_strings(text))
        if isinstance(obj, dict):
            print("ℹ️ JSON восстановлен: экранированы переносы строк")
            return obj
    except Exception:
        pass
    obj = _extract_json_fields(text)
    if obj.get("question") or obj.get("total_score") is not None:
        print("ℹ️ JSON восстановлен: поля извлечены вручную")
        return obj
    print(f"❌ JSON не распарсен. preview={content[:300]!r}")
    return {}


def _code_uses_lib(code: str, lib: str) -> bool:
    flat = re.sub(r"[^a-z0-9]", "", (code or "").lower())
    key = re.sub(r"[^a-z0-9]", "", (lib or "").lower())
    if not key:
        return True
    for alias in _LIB_ALIASES.get(key, ()):
        if re.sub(r"[^a-z0-9]", "", alias) in flat:
            return True
    parts = [p for p in re.split(r"[^a-z0-9]+", (lib or "").lower()) if p]
    if "".join(parts) in flat:
        return True
    return any(len(p) >= 4 and p in flat for p in parts)


def _clean_code(code: str) -> str:
    if not code:
        return ""
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
    _libs = it.library_id or "стандартная библиотека"
    stage_hint = {
        0: (
            f"ОДИН механизм {_libs} ({it.language_id}, стек {it.stack_id}, уровень {it.level}). "
            f"Механизм выбери сам из API {_libs}. Кандидат пишет промпт для ИИ. "
            f"НЕ приложение и НЕ сервис целиком. Поле code — пустая строка."
        ),
        1: (
            f"Код 20-40 строк на {it.language_id} с реальными импортами и вызовами API {_libs} "
            f"(стек {it.stack_id}, уровень {it.level}). Какие API взять — реши сам. "
            f"Ровно один скрытый баг в способе использования {_libs}, а не в синтаксисе языка. "
            f"Код в поле code, без комментариев-подсказок."
        ),
        2: (
            f"Авария внутри механики {_libs} ({it.language_id}, стек {it.stack_id}). "
            f"Механику выбери сам. Логи 12-20 строк с именами модулей {_libs} в поле code. "
            f"В question — вредный совет ИИ, который надо опровергнуть."
        ),
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

    covered = [
        (getattr(t, "reference_data", None) or {}).get("chosen_domain", "")
        for t in it.turns if t.role == "assistant"
    ]
    covered = [c for c in covered if c]
    covered_text = "; ".join(dict.fromkeys(covered)) if covered else "пока ничего"
    prompt = (
        f"Сгенерируй новое уникальное техническое задание для стадии {stage} "
        f"({STAGE_NAMES.get(stage, '—')}).\n\n"
        f"КРИТИЧЕСКОЕ ТРЕБОВАНИЕ: {stage_hints}\n\n"
        f"УЖЕ ПРОВЕРЕНО, повторять запрещено: {covered_text}\n\n"
        f"ПРЕДЫДУЩИЕ ВОПРОСЫ (не повторяй темы!):\n- {past_q_text}\n\n"
        f"ВАЖНО: Придумай принципиально новую ситуацию. Верни ТОЛЬКО валидный JSON."
    )

    for attempt in range(3):
        try:
            raw = (await ask_chat(sys_prompt, history, prompt, temperature=0.9)).strip()
            parsed = _parse_json(raw)
            if parsed and "question" in parsed:
                if "code" in parsed:
                    parsed["code"] = _strip_hint_comments(_clean_code(parsed["code"]))
                # Обратная совместимость: маппим topic -> reference_data
                parsed["reference_answer"] = parsed.get("reference_answer", "")
                parsed["chosen_domain"] = parsed.get("topic", "")
                if attempt < 2:
                    if stage == 1 and it.library_id and not _code_uses_lib(parsed.get("code") or "", it.library_id):
                        print(f"⚠️ attempt {attempt+1}: код без API {it.library_id}")
                        continue
                    if stage == 1 and not _is_review_task(parsed.get("question") or ""):
                        print(f"⚠️ attempt {attempt+1}: stage 1 не задание на поиск дефекта")
                        continue
                    if stage == 2 and not _has_ai_advice(parsed.get("question") or ""):
                        print(f"⚠️ attempt {attempt+1}: stage 2 без совета ИИ")
                        continue
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
    print(f"❌ FALLBACK stage={stage} lib={it.library_id} level={it.level} — генерация не удалась")
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
