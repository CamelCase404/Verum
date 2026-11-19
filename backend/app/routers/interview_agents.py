from __future__ import annotations

import json
from ...gigachat_client import ask_chat
from ...prompts import STAGE_DESCRIPTIONS, SYSTEM_GENERATOR, SYSTEM_EVALUATOR

def _get_history(it) -> list[dict]:
    return [{"role": t.role, "content": t.content} for t in it.turns]

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
    prompt = f"Сгенерируй новое уникальное задание для стадии {stage}. Ответ верни строго в формате JSON."
    
    raw = (await ask_chat(sys_prompt, history, prompt, temperature=0.4)).strip()
    parsed = _parse_json(raw)
    
    if not parsed or "question" not in parsed:
        return {
            "question": f"Опишите особенности управления памятью, а также жизненный цикл объектов/компонентов в контексте {it.language_id}.", 
            "code": "", 
            "reference_answer": "Ожидается описание работы с кучей/стеком, сборщиком мусора или ARC."
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
    
    history = _get_history(it)
    raw = (await ask_chat(sys_prompt, history, prompt, temperature=0.0)).strip()
    
    parsed = _parse_json(raw)
    if parsed and "total_score" in parsed:
        return max(0, min(100, int(parsed["total_score"])))
    
    return 0
