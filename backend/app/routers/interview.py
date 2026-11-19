from __future__ import annotations

import json
import re

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..auth import UserDB, get_current_user, get_db, utcnow_naive
from ..gigachat_client import ask_chat, ask_text
from ..interview_store import create, get, save
from ..prompts import STAGE_DESCRIPTIONS, SYSTEM_GENERATOR, SYSTEM_EVALUATOR, SYSTEM_REPORT
from ..schemas import (
    AnswerRequest,
    AnswerResponse,
    ReportResponse,
    StageScore,
    StartInterviewRequest,
    StartInterviewResponse,
    Turn,
)

router = APIRouter(prefix="/api/interview", tags=["interview"])

STAGE_NAMES = {0: "Общие знания", 1: "Code Review", 2: "Нагрузка", 3: "Code Review (Повторный)", 4: "Нагрузка (Повторный)"}
STAGE0_QUESTIONS = 8

def _normalize_lang(lang: str) -> str:
    lang = lang.strip().lower()
    mapping = {
        "javascript": "js", "js": "js", "typescript": "ts", "ts": "ts",
        "html5": "html", "html": "html", "css3": "css", "css": "css",
        "reactjs": "react", "react": "react", "vuejs": "vue", "vue": "vue",
        "c#": "csharp", "cs": "csharp", "csharp": "csharp",
        "node.js": "node", "nodejs": "node", "node": "node",
        "next.js": "next", "nextjs": "next", "next": "next",
        "fastapi": "fastapi", "django": "django", "go": "go", "golang": "go",
        "python": "python", "java": "java",
        "objective-c": "objc", "objc": "objc", "objectivec": "objc",
        "swift": "swift", "swiftui": "swiftui", "uikit": "uikit", "combine": "combine",
        "kotlin": "kotlin", "java": "java", "jetpack compose": "compose", 
        "compose": "compose", "kotlin coroutines": "coroutines", "coroutines": "coroutines",
        "unity (c#)": "unity", "unity": "unity",
        "unreal (c++)": "unreal", "unreal": "unreal", "c++": "unreal",
        "godot (gdscript)": "godot", "godot": "godot", "gdscript": "godot",
        "kubernetes": "k8s", "k8s": "k8s", "terraform": "terraform", 
        "ansible": "ansible", "bash": "bash", "docker": "docker",
        "pandas": "pandas", "pytorch": "pytorch", "tensorflow": "tensorflow", "sql": "sql"
    }
    return mapping.get(lang, lang)

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
    prompt = f"Сгенерируй задание для стадии {stage}."
    
    raw = (await ask_chat(sys_prompt, history, prompt, temperature=0.3)).strip()
    parsed = _parse_json(raw)
    
    if not parsed or "question" not in parsed:
        return {"question": "Опишите ваш подход к решению задач.", "code": "", "reference_answer": ""}
    return parsed

async def _evaluate_answer(stage: int, it, question: str, answer: str, is_skip: bool) -> int:
    if is_skip: return 0
    sys_prompt = SYSTEM_EVALUATOR
    # Оборачиваем ответ кандидата в теги для защиты от prompt injection
    prompt = f"Стадия: {stage}.\nВопрос: {question}\n\n<candidate_answer>\n{answer}\n</candidate_answer>"
    
    history = _get_history(it)
    raw = (await ask_chat(sys_prompt, history, prompt, temperature=0.0)).strip()
    
    parsed = _parse_json(raw)
    if parsed and "total_score" in parsed:
        return max(0, min(100, int(parsed["total_score"])))
    
    return 0


@router.post("/start", response_model=StartInterviewResponse)
async def start(req: StartInterviewRequest, user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> StartInterviewResponse:
    if user.role != "developer":
        raise HTTPException(403, "Собеседование доступно только для разработчиков")
    
    is_job_test = bool(req.job_id)

    if is_job_test:
        comp_res = await db.execute(select(UserDB).where(UserDB.role == "company", UserDB.job_postings.isnot(None)))
        target_job = None
        for comp in comp_res.scalars().all():
            for job in comp.job_postings:
                if str(job.get("id")) == str(req.job_id):
                    target_job = job
                    break
            if target_job:
                break
                
        if target_job:
            job_stack_str = target_job.get("stack", "").lower()
            stack_map = {
                "mobile (ios)": "mobile-ios", "mobile (android)": "mobile-android",
                "frontend": "frontend", "backend": "backend", "gamedev": "gamedev",
                "devops / sre": "devops", "data / ml": "data", "fullstack": "backend"
            }
            expected_stack = stack_map.get(job_stack_str, "backend")
            if req.stack_id != expected_stack:
                raise HTTPException(400, f"Выбранный стек не соответствует вакансии. Ожидается: {target_job.get('stack')}")
            
            job_langs_str = str(target_job.get("languages", ""))
            job_langs_raw = [l.strip().lower() for l in job_langs_str.split(",") if l.strip()]
            job_langs_norm = [_normalize_lang(l) for l in job_langs_raw]
            for l in req.language_ids:
                if _normalize_lang(l) not in job_langs_norm:
                    raise HTTPException(400, f"Язык {l} не подходит. Разрешены: {', '.join(job_langs_raw)}")
            
            job_libs_str = str(target_job.get("libraries", "")).lower()
            if req.library_id and req.library_id.lower() not in job_libs_str:
                raise HTTPException(400, f"Библиотека {req.library_id} не подходит. Разрешены: {job_libs_str}")
    
    if not is_job_test and user.test_status == "pending":
        raise HTTPException(409, "У вас уже есть собеседование на модерации. Дождитесь решения модератора.")
    
    now = utcnow_naive()
    if not is_job_test and user.blocked_until:
        blocked = user.blocked_until
        if blocked.tzinfo is not None:
            blocked = blocked.replace(tzinfo=None)
        if blocked > now:
            raise HTTPException(403, f"Доступ заблокирован до {blocked.strftime('%d.%m.%Y')}. Используйте ссылку от компании для теста.")
            
    user.interview_video_url = None
    user.pending_skills_data = None
    await db.commit()

    langs_str = ", ".join(req.language_ids)
    it = await create(req.level, req.stack_id, langs_str, user_id=user.id, job_id=req.job_id, library_id=req.library_id)
    
    try:
        q_data = await _generate_pure_question(0, it)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(500, f"Ошибка генерации вопроса: {str(e)}")

    content_str = q_data["question"]
    if q_data.get("code"): content_str += "\n\nКод:\n" + q_data["code"]
    if q_data.get("reference_answer"): content_str += "\n\n___REFERENCE___\n" + q_data["reference_answer"]

    it.turns.append(Turn(role="assistant", content=content_str, seconds_spent=0))
    await save(it)
    return StartInterviewResponse(interview_id=it.id, stage=0, stage_name=STAGE_NAMES[0], question=q_data["question"], code_snippet=q_data.get("code"))

@router.post("/answer", response_model=AnswerResponse)
async def answer(req: AnswerRequest, user: UserDB = Depends(get_current_user)) -> AnswerResponse:
    it = await get(req.interview_id)
    if not it:
        raise HTTPException(404, "interview not found")
    if it.user_id is not None and it.user_id != user.id:
        raise HTTPException(403, "Это интервью принадлежит другому пользователю")

    if req.answer == "___TAB_SWITCH_FAIL___":
        it.finished, it.rejected, it.reject_reason = True, True, "Выход из окна."
        await save(it)
        return AnswerResponse(stage=it.stage, stage_name=STAGE_NAMES.get(it.stage, ""), finished=True, rejected=True, reject_reason=it.reject_reason)

    is_skip = req.answer == "___SKIP___"
    if is_skip: req.answer = "Кандидат пропустил вопрос."

    past_questions = [t.content for t in it.turns if t.role == "assistant"]
    last_question = past_questions[-1] if past_questions else ""

    score = await _evaluate_answer(it.stage, it, last_question, req.answer, is_skip)

    it.turns.append(Turn(role="user", content=req.answer, seconds_spent=req.seconds_spent, score=score))

    if not is_skip and score <= 5:
        it.finished, it.rejected, it.reject_reason = True, True, "Ответ не по теме."
        await save(it)
        return AnswerResponse(stage=it.stage, stage_name=STAGE_NAMES.get(it.stage, ""), finished=True, rejected=True, reject_reason=it.reject_reason)

    answers_on_stage = sum(1 for t in it.turns if t.role == "user")

    if it.stage == 0 and answers_on_stage >= STAGE0_QUESTIONS:
        it.stage = 1
        q_data = await _generate_pure_question(1, it)
        content_str = q_data["question"] + "\n\nКод:\n" + q_data.get("code", "") + "\n\n___REFERENCE___\n" + q_data.get("reference_answer", "")
        it.turns.append(Turn(role="assistant", content=content_str, seconds_spent=0))
        await save(it)
        return AnswerResponse(stage=1, stage_name=STAGE_NAMES[1], question=q_data["question"], code_snippet=q_data.get("code"))

    elif it.stage == 1 and answers_on_stage >= STAGE0_QUESTIONS + 1:
        it.stage = 2
        q_data = await _generate_pure_question(2, it)
        content_str = q_data["question"] + "\n\n___REFERENCE___\n" + q_data.get("reference_answer", "")
        it.turns.append(Turn(role="assistant", content=content_str, seconds_spent=0))
        await save(it)
        return AnswerResponse(stage=2, stage_name=STAGE_NAMES[2], question=q_data["question"])

    elif it.stage == 2 and answers_on_stage >= STAGE0_QUESTIONS + 2:
        it.stage = 3
        q_data = await _generate_pure_question(3, it)
        content_str = q_data["question"] + "\n\nКод:\n" + q_data.get("code", "") + "\n\n___REFERENCE___\n" + q_data.get("reference_answer", "")
        it.turns.append(Turn(role="assistant", content=content_str, seconds_spent=0))
        await save(it)
        return AnswerResponse(stage=3, stage_name=STAGE_NAMES[3], question=q_data["question"], code_snippet=q_data.get("code"))

    elif it.stage == 3 and answers_on_stage >= STAGE0_QUESTIONS + 3:
        it.stage = 4
        q_data = await _generate_pure_question(4, it)
        content_str = q_data["question"] + "\n\n___REFERENCE___\n" + q_data.get("reference_answer", "")
        it.turns.append(Turn(role="assistant", content=content_str, seconds_spent=0))
        await save(it)
        return AnswerResponse(stage=4, stage_name=STAGE_NAMES[4], question=q_data["question"])

    elif it.stage == 4 and answers_on_stage >= STAGE0_QUESTIONS + 4:
        it.finished = True
        await save(it)
        return AnswerResponse(stage=4, stage_name=STAGE_NAMES[4], finished=True)

    q_data = await _generate_pure_question(it.stage, it)
    content_str = q_data["question"] + "\n\n___REFERENCE___\n" + q_data.get("reference_answer", "")
    it.turns.append(Turn(role="assistant", content=content_str, seconds_spent=0))
    await save(it)
    return AnswerResponse(stage=it.stage, stage_name=STAGE_NAMES[it.stage], question=q_data["question"])

class _Report(BaseModel):
    summary: str = "Резюме отсутствует."
    stages: list[StageScore] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)
    recommendation: str = "insufficient_evidence"
    competency_architecture: int | None = None
    competency_code_understanding: int | None = None
    competency_prompting: int | None = None
    competency_adaptability: int | None = None
    competency_soft_skills: int | None = None
    total_score_100: int | None = None
    final_grade: str | None = None

@router.get("/{interview_id}/report", response_model=ReportResponse)
async def report(interview_id: str, user: UserDB = Depends(get_current_user)) -> ReportResponse:
    it = await get(interview_id)
    if not it:
        raise HTTPException(404, "interview not found")
    if it.user_id is not None and it.user_id != user.id:
        raise HTTPException(403, "Это интервью принадлежит другому пользователю")
    if not it.finished:
        raise HTTPException(409, "interview is not finished")

    if it.rejected:
        return ReportResponse(
            interview_id=it.id, level=it.level, stack_id=it.stack_id, language_id=it.language_id,
            summary="Интервью было прервано.", stages=[], strengths=[], gaps=[it.reject_reason or "Нарушение"],
            recommendation="no_hire", competency_architecture=0, competency_code_understanding=0, competency_prompting=0,
            competency_adaptability=0, competency_soft_skills=0, total_score_100=0, final_grade="Reject",
            rejected=True, reject_reason=it.reject_reason
        )

    user_turns = [t for t in it.turns if t.role == "user"]
    total_answers = len(user_turns)
    skips = sum(1 for t in user_turns if t.content == "Кандидат пропустил вопрос.")
    
    all_scores = [getattr(t, "score", None) for t in user_turns]
    valid_scores = [sc for sc in all_scores if sc is not None]

    if valid_scores:
        scores_normalized = [sc if sc is not None else 0 for sc in all_scores]
        avg_score = sum(scores_normalized) / len(scores_normalized)
    else:
        avg_score = 0

    def stage_avg(stages: list[int]) -> int:
        stage_scores = [
            (getattr(t, "score", None) or 0)
            for i, t in enumerate(it.turns)
            if t.role == "user" and _turn_stage(it.turns, i) in stages
        ]
        if not stage_scores:
            return 0
        return int(sum(stage_scores) / len(stage_scores))

    forced_reject = False
    reject_reason = None
    if total_answers > 0:
        skip_ratio = skips / total_answers
        if skips == total_answers:
            forced_reject = True
            reject_reason = "Все вопросы пропущены."
        elif skip_ratio >= 0.5:
            forced_reject = True
            reject_reason = f"Пропущено {skips} из {total_answers} вопросов ({int(skip_ratio*100)}%)."

    if forced_reject:
        return ReportResponse(
            interview_id=it.id, level=it.level, stack_id=it.stack_id, language_id=it.language_id,
            summary=reject_reason or "Кандидат пропустил большинство вопросов.",
            stages=[],
            strengths=[],
            gaps=["Кандидат не отвечал на большинство вопросов."],
            recommendation="no_hire",
            competency_architecture=0, competency_code_understanding=0, competency_prompting=0,
            competency_adaptability=0, competency_soft_skills=0,
            total_score_100=0, final_grade="Reject",
            rejected=True, reject_reason=reject_reason
        )

    history = _get_history(it)
    ai_user = f"Уровень: {it.level}. Стек: {it.stack_id}. Языки: {it.language_id}.\nСформируй отчёт строго по схеме JSON."

    try:
        raw = await ask_chat(SYSTEM_REPORT, history, ai_user)
        parsed = _Report.model_validate(_parse_json(raw))
    except Exception as e:
        parsed = _Report(
            summary="Отчёт сформирован на основе ваших ответов. ИИ не смог сгенерировать подробный вердикт, но баллы рассчитаны верно.",
            stages=[],
            strengths=["Ответы на вопросы зафиксированы и оценены."],
            gaps=["Детальный анализ недоступен из-за технического сбоя ИИ."],
            recommendation="insufficient_evidence",
        )

    total = int(round(avg_score))

    initial_level = it.level.lower()
    if total < 15:
        grade = "Reject"
    elif total <= 50:
        grade = "Junior"
    elif total <= 75:
        grade = "Middle"
    else:
        grade = "Senior"

    if initial_level == "junior" and grade in ("Middle", "Senior"):
        grade = "Junior"
    elif initial_level == "middle" and grade == "Senior":
        grade = "Middle"

    comp_arch = stage_avg([0])
    comp_code = stage_avg([1, 3])
    comp_adapt = stage_avg([2, 4])
    
    def _valid_or(x, fallback):
        if x is None: return fallback
        try:
            xi = int(x)
            return xi if 0 <= xi <= 100 else fallback
        except (TypeError, ValueError):
            return fallback

    comp_prompt = _valid_or(parsed.competency_prompting, total)
    comp_soft = _valid_or(parsed.competency_soft_skills, total)

    return ReportResponse(
        interview_id=it.id, level=it.level, stack_id=it.stack_id, language_id=it.language_id,
        library_id=it.library_id, summary=parsed.summary, stages=parsed.stages, strengths=parsed.strengths, gaps=parsed.gaps,
        recommendation=parsed.recommendation if parsed.recommendation in ("hire", "no_hire", "insufficient_evidence") else "insufficient_evidence",
        competency_architecture=comp_arch,
        competency_code_understanding=comp_code,
        competency_prompting=comp_prompt,
        competency_adaptability=comp_adapt,
        competency_soft_skills=comp_soft,
        total_score_100=total,
        final_grade=grade,
        rejected=False, reject_reason=None
    )

def _turn_stage(turns: list, user_turn_index: int) -> int:
    stage = 0
    assistant_count = 0
    for i, t in enumerate(turns):
        if i == user_turn_index:
            return stage
        if t.role == "assistant":
            assistant_count += 1
            if assistant_count > STAGE0_QUESTIONS: stage = 1
            if assistant_count > STAGE0_QUESTIONS + 1: stage = 2
            if assistant_count > STAGE0_QUESTIONS + 2: stage = 3
            if assistant_count > STAGE0_QUESTIONS + 3: stage = 4
    return stage
