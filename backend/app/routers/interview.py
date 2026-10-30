from __future__ import annotations

import json
import re
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..gigachat_client import ask_chat, ask_text
from ..interview_store import create, get, save
from ..prompts import STAGE_DESCRIPTIONS, SYSTEM_INTERVIEWER, SYSTEM_REPORT
from ..auth import get_current_user, UserDB
from ..schemas import (
    AnswerRequest, AnswerResponse, ReportResponse, StageScore,
    StartInterviewRequest, StartInterviewResponse, Turn,
)

router = APIRouter(prefix="/api/interview", tags=["interview"])

STAGE_NAMES = {0: "Общие знания", 1: "Code Review", 2: "Нагрузка", 3: "Code Review (Повторный)", 4: "Нагрузка (Повторный)"}
STAGE0_QUESTIONS = 8

def _clean_text(raw: str) -> str:
    raw = raw.strip().replace("{{", "{").replace("}}", "}")
    if raw.startswith("```json"): raw = raw[7:]
    elif raw.startswith("```"): raw = raw[3:]
    if raw.endswith("```"): raw = raw[:-3]
    if raw.startswith("{"):
        try:
            data = json.loads(raw)
            raw = str(data.get("next_question", data.get("question", raw)))
        except: pass
    clean = re.sub(r'[{}"]', "", raw).strip()
    return re.sub(r"^(score|feedback|next_question)\s*:\s*", "", clean, flags=re.IGNORECASE).strip()

def _get_history(it) -> list[dict]:
    return [{"role": t.role, "content": t.content} for t in it.turns]

async def _generate_pure_question(stage: int, it, past_questions: list[str], prev_code_context: str = "", prev_answer: str = "") -> str:
    prev_q_str = "\n".join(f"- {q[:50]}..." for q in past_questions[-5:]) if past_questions else "Нет"
    
    # Передаем stack везде
    stage_desc = STAGE_DESCRIPTIONS[stage].format(langs=it.language_id, level=it.level, stack=it.stack_id)
    sys_prompt = SYSTEM_INTERVIEWER.format(level=it.level, langs=it.language_id, stack=it.stack_id)

    prompt = f"Стадия: {stage}. {stage_desc}\nУже заданные вопросы:\n{prev_q_str}\n\n"
    if stage == 2 and prev_code_context:
        prompt += f"Код с предыдущего этапа:\n{prev_code_context[:1500]}...\n\nКандидат написал промпт:\n'{prev_answer}'\n\nПридумай проблему (нагрузка/падение) и спроси, как исправить именно этот код. Верни ТОЛЬКО текст вопроса."
    else:
        prompt += "Задай СЛЕДУЮЩИЙ новый вопрос. Верни ТОЛЬКО текст вопроса."

    history = _get_history(it)
    raw = await ask_chat(sys_prompt, history, prompt).strip()
    return _clean_text(raw)

async def _evaluate_answer(stage: int, it, question: str, answer: str, is_skip: bool) -> int:
    if is_skip: return 0
    sys_prompt = SYSTEM_INTERVIEWER.format(level=it.level, langs=it.language_id, stack=it.stack_id)
    
    prompt = f"Стадия: {stage}. Уровень: {it.level}.\nВопрос: {question}\nОтвет кандидата: {answer}\n\nОцени от 0-100. Если ответ не по теме (бред, спам), ставь 0-10. Если поверхностный - 10-30. Верни ТОЛЬКО число. Не додумывай за кандидата!"
    history = _get_history(it)
    raw = await ask_chat(sys_prompt, history, prompt).strip()
    match = re.search(r"\d+", raw)
    if match:
        score = int(match.group())
        return max(0, min(100, score))
    return 40

async def _generate_code_review_task(it) -> tuple[str, str]:
    sys_prompt = SYSTEM_INTERVIEWER.format(level=it.level, langs=it.language_id, stack=it.stack_id)
    
    if it.level.lower() == "junior": difficulty = "Добавь простые ошибки (отсутствие проверки на null, неэффективный цикл)."
    elif it.level.lower() == "middle": difficulty = "Добавь ошибки среднего уровня (N+1, неправильная обработка исключений, проблемы с многопоточностью)."
    else: difficulty = "Добавь СЛОЖНЫЕ ошибки (race conditions, утечки памяти, проблемы с ACID)."

    prompt = (
        f"Сгенерируй код СТРОГО на одном из этих языков: {it.language_id}.\\n"
        f"ОБЯЗАТЕЛЬНО используй самые современные и актуальные библиотеки/фреймворки для этого стека.\\n"
        f"{difficulty}\\n"
        f"КРИТИЧЕСКОЕ ПРАВИЛО 1: В коде НЕ ДОЛЖНО БЫТЬ КОММЕНТАРИЕВ И ПОДСКАЗОК.\\n"
        f"КРИТИЧЕСКОЕ ПРАВИЛО 2: Ты должен выдать только код и сухое задание.\\n"
        f"ВЕРНИ СТРОГО: 'Найдите ошибки в коде и напишите промпт для их исправления', затем символ '|', затем код."
    )
    
    history = _get_history(it)
    raw = await ask_chat(sys_prompt, history, prompt).strip()

    if "|" in raw:
        parts = raw.split("|", 1)
        code = parts[1].strip()
        
        # Жесткая очистка от любых комментариев
        code = re.sub(r"#.*", "", code)          # Python, Bash
        code = re.sub(r"//.*", "", code)         # JS, C#, Java, Go
        code = re.sub(r"/\*.*?\*/", "", code, flags=re.DOTALL) # C-style block
        code = re.sub(r"<!--.*?-->", "", code, flags=re.DOTALL)  # HTML
        code = re.sub(r"--.*", "", code)         # SQL, Lua
        code = re.sub(r"\n\s*\n", "\n", code)  # Убираем пустые строки
        
        # Убираем фразы-подсказки, если ИИ их все-таки вставил
        code = code.replace("Потенциальная ошибка:", "")
        code = code.replace("Ошибка:", "")
        code = code.replace("Баг:", "")
        if "\n" not in code: code = code.replace("{", "{\n").replace("}", "\n}").replace(";", ";\n")
        return parts[0].strip(), code.strip()
    return "Найдите ошибки в коде и напишите промпт.", raw

@router.post("/start", response_model=StartInterviewResponse)
async def start(req: StartInterviewRequest, user: UserDB = Depends(get_current_user)) -> StartInterviewResponse:
    from datetime import datetime
    now = datetime.utcnow()
    if user.blocked_until:
        blocked = user.blocked_until
        # Если дата с часовым поясом, убираем его для сравнения
        if blocked.tzinfo is not None:
            blocked = blocked.replace(tzinfo=None)
        if blocked > now:
            raise HTTPException(
                403,
                f"Доступ к собеседованию заблокирован до {blocked.strftime('%d.%m.%Y')}. "
                f"Вы исчерпали все попытки."
            )
    langs_str = ", ".join(req.language_ids)
    it = await create(req.level, req.stack_id, langs_str)
    try:
        q = await _generate_pure_question(0, it, [])
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(500, f"Ошибка генерации вопроса: {str(e)}")
        
    it.turns.append(Turn(role="assistant", content=q, seconds_spent=0))
    await save(it)
    return StartInterviewResponse(interview_id=it.id, stage=0, stage_name=STAGE_NAMES[0], question=q)

@router.post("/answer", response_model=AnswerResponse)
async def answer(req: AnswerRequest) -> AnswerResponse:
    it = await get(req.interview_id)
    if not it: raise HTTPException(404, "interview not found")

    if req.answer == "___TAB_SWITCH_FAIL___":
        it.finished, it.rejected, it.reject_reason = True, True, "Выход из окна."
        await save(it)
        return AnswerResponse(stage=it.stage, stage_name=STAGE_NAMES.get(it.stage, ""), finished=True, rejected=True, reject_reason=it.reject_reason)

    is_skip = req.answer == "___SKIP___"
    if is_skip: 
        req.answer = "Кандидат пропустил вопрос."

    past_questions = [t.content for t in it.turns if t.role == "assistant"]
    last_question = past_questions[-1] if past_questions else ""
    
    it.turns.append(Turn(role="user", content=req.answer, seconds_spent=req.seconds_spent))
    
    score = await _evaluate_answer(it.stage, it, last_question, req.answer, is_skip)

    if not is_skip and score <= 5:
        it.finished, it.rejected, it.reject_reason = True, True, "Ответ не по теме (бред или спам)."
        await save(it)
        return AnswerResponse(stage=it.stage, stage_name=STAGE_NAMES.get(it.stage, ""), finished=True, rejected=True, reject_reason=it.reject_reason)

    answers_on_stage = sum(1 for t in it.turns if t.role == "user")

    if it.stage == 0 and answers_on_stage >= STAGE0_QUESTIONS:
        it.stage = 1
        question, code = await _generate_code_review_task(it)
        it.turns.append(Turn(role="assistant", content=question + "\n\nКод:\n" + code, seconds_spent=0))
        await save(it)
        return AnswerResponse(stage=1, stage_name=STAGE_NAMES[1], question=question, code_snippet=code)

    elif it.stage == 1 and answers_on_stage >= STAGE0_QUESTIONS + 1:
        it.stage = 2
        prev_prompt = next((t.content for t in reversed(it.turns) if t.role == "user" and len(t.content) > 10), "")
        prev_code = next((t.content for t in reversed(it.turns) if t.role == "assistant" and "Код:" in t.content), "")
        q = await _generate_pure_question(2, it, past_questions, prev_code, prev_prompt)
        it.turns.append(Turn(role="assistant", content=q, seconds_spent=0))
        await save(it)
        return AnswerResponse(stage=2, stage_name=STAGE_NAMES[2], question=q)

    elif it.stage == 2 and answers_on_stage >= STAGE0_QUESTIONS + 2:
        it.stage = 3
        question, code = await _generate_code_review_task(it)
        it.turns.append(Turn(role="assistant", content=question + "\n\nКод:\n" + code, seconds_spent=0))
        await save(it)
        return AnswerResponse(stage=3, stage_name=STAGE_NAMES[3], question=question, code_snippet=code)

    elif it.stage == 3 and answers_on_stage >= STAGE0_QUESTIONS + 3:
        it.stage = 4
        prev_prompt = next((t.content for t in reversed(it.turns) if t.role == "user" and len(t.content) > 10), "")
        prev_code = next((t.content for t in reversed(it.turns) if t.role == "assistant" and "Код:" in t.content), "")
        q = await _generate_pure_question(4, it, past_questions, prev_code, prev_prompt)
        it.turns.append(Turn(role="assistant", content=q, seconds_spent=0))
        await save(it)
        return AnswerResponse(stage=4, stage_name=STAGE_NAMES[4], question=q)

    elif it.stage == 4 and answers_on_stage >= STAGE0_QUESTIONS + 4:
        it.finished = True
        await save(it)
        return AnswerResponse(stage=4, stage_name=STAGE_NAMES[4], finished=True)

    q = await _generate_pure_question(it.stage, it, past_questions)
    if not q or len(q.strip()) < 10: q = "Опишите ваш подход к решению подобных задач."

    it.turns.append(Turn(role="assistant", content=q, seconds_spent=0))
    await save(it)
    return AnswerResponse(stage=it.stage, stage_name=STAGE_NAMES[it.stage], question=q)

class _Report(BaseModel):
    summary: str
    stages: list[StageScore]
    strengths: list[str]
    gaps: list[str]
    recommendation: str
    competency_architecture: int | None = None
    competency_code_understanding: int | None = None
    competency_prompting: int | None = None
    competency_adaptability: int | None = None
    competency_soft_skills: int | None = None
    total_score_100: int | None = None
    final_grade: str | None = None

def _parse_report_json(content: str) -> dict:
    content = content.strip()
    if content.startswith("```json"): content = content[7:]
    elif content.startswith("```"): content = content[3:]
    if content.endswith("```"): content = content[:-3]
    s, e = content.find("{"), content.rfind("}")
    if s != -1 and e != -1 and e > s: content = content[s:e+1]
    try: return json.loads(content)
    except: pass
    return {}

@router.get("/{interview_id}/report", response_model=ReportResponse)
async def report(interview_id: str) -> ReportResponse:
    it = await get(interview_id)
    if not it: raise HTTPException(404, "interview not found")
    if not it.finished: raise HTTPException(409, "interview is not finished")

    if it.rejected:
        return ReportResponse(
            interview_id=it.id, level=it.level, stack_id=it.stack_id, language_id=it.language_id,
            summary="Интервью было прервано.", stages=[], strengths=[], gaps=[it.reject_reason or "Нарушение"],
            recommendation="no_hire", competency_architecture=0, competency_code_understanding=0, competency_prompting=0,
            competency_adaptability=0, competency_soft_skills=0, total_score_100=0, final_grade="Reject",
            rejected=True, reject_reason=it.reject_reason
        )

    history = _get_history(it)
    user = f"Уровень: {it.level}. Стек: {it.stack_id}. Языки: {it.language_id}.\nСформируй отчёт строго по схеме JSON."

    try:
        raw = await ask_chat(SYSTEM_REPORT, history, user)
        parsed = _Report.model_validate(_parse_report_json(raw))
        
        # Считаем средний балл СТРОГО по оценкам навыков, а не берем из ИИ
        comps = [
            parsed.competency_architecture, 
            parsed.competency_code_understanding, 
            parsed.competency_prompting, 
            parsed.competency_adaptability, 
            parsed.competency_soft_skills
        ]
        valid_comps = [c for c in comps if c is not None]
        total = int(sum(valid_comps) / len(valid_comps)) if valid_comps else 0

        initial_level = it.level.lower()

        # Если ИИ поставил мало баллов, это Reject, независимо от выбранного уровня
        if total < 40: 
            grade = "Reject"
        elif total <= 60: 
            grade = "Junior"
        elif total <= 80: 
            grade = "Middle"
        else: 
            grade = "Senior"

        # Ограничение сверху (нельзя прыгнуть выше выбранного уровня)
        if initial_level == "junior" and grade in ("Middle", "Senior"): 
            grade = "Junior"
        elif initial_level == "middle" and grade == "Senior": 
            grade = "Middle"

        return ReportResponse(
            interview_id=it.id, level=it.level, stack_id=it.stack_id, language_id=it.language_id,
            summary=parsed.summary, stages=parsed.stages, strengths=parsed.strengths, gaps=parsed.gaps,
            recommendation=parsed.recommendation if parsed.recommendation in ("hire", "no_hire", "insufficient_evidence") else "insufficient_evidence",
            competency_architecture=parsed.competency_architecture, competency_code_understanding=parsed.competency_code_understanding,
            competency_prompting=parsed.competency_prompting, competency_adaptability=parsed.competency_adaptability,
            competency_soft_skills=parsed.competency_soft_skills, total_score_100=total, final_grade=grade,
            rejected=False, reject_reason=None
        )
    except Exception as e:
        return ReportResponse(
            interview_id=it.id, level=it.level, stack_id=it.stack_id, language_id=it.language_id,
            summary=f"Ошибка генерации отчёта: {str(e)}", stages=[], strengths=[], gaps=[],
            recommendation="insufficient_evidence", competency_architecture=30, competency_code_understanding=30,
            competency_prompting=30, competency_adaptability=30, competency_soft_skills=30, total_score_100=30,
            final_grade="Reject", rejected=False, reject_reason=None
        )
