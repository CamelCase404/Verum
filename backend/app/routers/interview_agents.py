from __future__ import annotations

import json
from app.gigachat_client import ask_chat
from app.prompts import STAGE_DESCRIPTIONS, SYSTEM_GENERATOR, SYSTEM_EVALUATOR

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
    if content.startswith("```json"): content = content[7:]
    elif content.startswith("```"): content = content[3:]
    if content.endswith("```"): content = content[:-3]
    s, e = content.find("{"), content.rfind("}")
    if s != -1 and e != -1 and e > s: content = content[s:e+1]
    try: return json.loads(content)
    except: pass
    return {}

async def _generate_pure_question(stage: int, it) -> dict:
    stage_desc = STAGE_DESCRIPTIONS[stage].format(
        langs=it.language_id, level=it.level, stack=it.stack_id, 
        libs=it.library_id or "стандартная библиотека"
    )
    sys_prompt = SYSTEM_GENERATOR.format(
        level=it.level, langs=it.language_id, stack=it.stack_id, 
        libs=it.library_id or "стандартная библиотека", stage_desc=stage_desc
    )

    history = _get_history(it)
    prompt = (
        f"Сгенерируй новое уникальное задание для стадии {stage}. "
        f"ВНИМАТЕЛЬНО проанализируй оценки за прошлые ответы кандидата в истории диалога. "
        f"Если оценки высокие (>70) — повышай сложность текущего вопроса. Если низкие (<40) — плавно снижай. "
        f"Ответ верни строго в формате JSON."
    )
    
    raw = (await ask_chat(sys_prompt, history, prompt, temperature=0.6)).strip()
    parsed = _parse_json(raw)
    
    if not parsed or "question" not in parsed:
        return {
            "question": f"Опишите, как спроектировать отказоустойчивую архитектуру компонента на {it.language_id} с использованием паттернов {it.stack_id}.", 
            "code": "", 
            "reference_answer": "Ожидается глубокое понимание паттернов декомпозиции и обработки ошибок."
        }
    return parsed

async def _evaluate_answer(stage: int, it, question: str, answer: str, is_skip: bool) -> int:
    if is_skip: return 0
    
    assistant_turns = [t for t in it.turns if t.role == "assistant"]
    ref_text = ""
    if assistant_turns:
        ref_data = getattr(assistant_turns[-1], "reference_data", None)
        if ref_data and isinstance(ref_data, dict):
            ref_text = ref_data.get("reference_answer", "")

    sys_prompt = SYSTEM_EVALUATOR
    
    prompt = (
        f"Текущая стадия интервью: {stage}.\n"
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
