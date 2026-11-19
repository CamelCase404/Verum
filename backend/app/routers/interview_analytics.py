from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from ..auth import UserDB, get_current_user
from ..interview_store import get
from ..prompts import SYSTEM_REPORT
from ..gigachat_client import ask_chat
from ..schemas import ReportResponse, StageScore
from .interview_agents import _get_history, _parse_json

router_analytics = APIRouter()

STAGE0_QUESTIONS = 8

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

def _turn_stage(turns: list, user_turn_index: int) -> int:
    stage = 0
    assistant_count = 0
    for i, t in enumerate(turns):
        if i == user_turn_index: return stage
        if t.role == "assistant":
            assistant_count += 1
            if assistant_count > STAGE0_QUESTIONS: stage = 1
            if assistant_count > STAGE0_QUESTIONS + 1: stage = 2
            if assistant_count > STAGE0_QUESTIONS + 2: stage = 3
            if assistant_count > STAGE0_QUESTIONS + 3: stage = 4
    return stage

@router_analytics.get("/{interview_id}/report", response_model=ReportResponse)
async def report(interview_id: str, user: UserDB = Depends(get_current_user)) -> ReportResponse:
    it = await get(interview_id)
    if not it: raise HTTPException(404, "interview not found")
    if it.user_id is not None and it.user_id != user.id: raise HTTPException(403, "Это интервью принадлежит другому пользователю")
    if not it.finished: raise HTTPException(409, "interview is not finished")

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
    avg_score = sum([sc if sc is not None else 0 for sc in all_scores]) / len(all_scores) if valid_scores else 0

    def stage_avg(stages: list[int]) -> int:
        stage_scores = [
            (getattr(t, "score", None) or 0)
            for i, t in enumerate(it.turns)
            if t.role == "user" and _turn_stage(it.turns, i) in stages
        ]
        return int(sum(stage_scores) / len(stage_scores)) if stage_scores else 0

    if total_answers > 0 and (skips == total_answers or (skips / total_answers) >= 0.5):
        reason = "Все вопросы пропущены." if skips == total_answers else f"Пропущено {skips} из {total_answers} вопросов."
        return ReportResponse(
            interview_id=it.id, level=it.level, stack_id=it.stack_id, language_id=it.language_id,
            summary=reason, stages=[], strengths=[], gaps=["Кандидат не отвечал на вопросы."],
            recommendation="no_hire", competency_architecture=0, competency_code_understanding=0, competency_prompting=0,
            competency_adaptability=0, competency_soft_skills=0, total_score_100=0, final_grade="Reject",
            rejected=True, reject_reason=reason
        )

    history = _get_history(it)
    ai_user = f"Уровень: {it.level}. Стек: {it.stack_id}. Языки: {it.language_id}.\nСформируй отчёт строго по схеме JSON."

    try:
        raw = await ask_chat(SYSTEM_REPORT, history, ai_user)
        parsed = _Report.model_validate(_parse_json(raw))
    except Exception:
        parsed = _Report(
            summary="Отчёт сформирован на основе ваших ответов. ИИ не смог сгенерировать вердикт из-за сбоя.",
            stages=[], strengths=["Ответы зафиксированы."], gaps=["Детальный ИИ-анализ временно недоступен."],
            recommendation="insufficient_evidence",
        )

    total = int(round(avg_score))
    initial_level = it.level.lower()
    grade = "Reject" if total < 15 else "Junior" if total <= 50 else "Middle" if total <= 75 else "Senior"

    if initial_level == "junior" and grade in ("Middle", "Senior"): grade = "Junior"
    elif initial_level == "middle" and grade == "Senior": grade = "Middle"

    return ReportResponse(
        interview_id=it.id, level=it.level, stack_id=it.stack_id, language_id=it.language_id, library_id=it.library_id,
        summary=parsed.summary, stages=parsed.stages, strengths=parsed.strengths, gaps=parsed.gaps,
        recommendation=parsed.recommendation if parsed.recommendation in ("hire", "no_hire", "insufficient_evidence") else "insufficient_evidence",
        competency_architecture=stage_avg([0]), competency_code_understanding=stage_avg([1, 3]), competency_adaptability=stage_avg([2, 4]),
        competency_prompting=total if parsed.competency_prompting is None else max(0, min(100, int(parsed.competency_prompting))),
        competency_soft_skills=total if parsed.competency_soft_skills is None else max(0, min(100, int(parsed.competency_soft_skills))),
        total_score_100=total, final_grade=grade, rejected=False, reject_reason=None
    )
