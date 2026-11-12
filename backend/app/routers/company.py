from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..auth import (
    get_current_user, get_db, UserDB,
    VerificationRequest, UsageLog, utcnow_naive,
)
from ..config import settings
from ..gigachat_client import ask_text
import json, re

router = APIRouter(prefix="/api/company", tags=["company"])

GRADE_TOKEN_COST = {
    "Junior": 100,
    "Middle": 200,
    "Senior": 350,
    "Reject": 0
}

class ParseJobReq(BaseModel):
    description: str

@router.post("/parse-job")
async def parse_job(req: ParseJobReq, user: UserDB = Depends(get_current_user)):
    if user.role != "company":
        raise HTTPException(status_code=403, detail="Только для компаний")
    
    sys_prompt = """Ты — опытный HR-аналитик. Твоя задача — извлечь параметры вакансии из текста.
Верни ответ СТРОГО в формате JSON (без markdown):
{
  "title": "Краткое название (например, 'Senior React Developer')",
  "stack": "Одно из: Frontend, Backend, Fullstack, Mobile, DevOps, Data / ML",
  "level": "Одно из: Junior, Middle, Senior",
  "suggested_salary": "Примерная рыночная зарплата в рублях (только число, например 200000)",
  "format": "Одно из: Удалённо, Гибрид, Офис. Если в тексте нет информации о формате, верни 'Удалённо'"
}"""

    prompt = f"Текст вакансии:\n{req.description}"
    
    try:
        raw = await ask_text(sys_prompt, prompt)
        # Очистка от возможных markdown-тегов
        raw = raw.replace("```json", "").replace("```", "").strip()
        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1:
            raw = raw[start:end+1]
            
        data = json.loads(raw)
        return {
            "title": data.get("title", "Разработчик"),
            "stack": data.get("stack", "Frontend"),
            "level": data.get("level", "Middle"),
            "suggested_salary": data.get("suggested_salary", ""),
            "format": data.get("format", "Удалённо")
        }
    except Exception as e:
        # Если ИИ ошибся, отдаем дефолтные значения
        return {"title": "Разработчик", "stack": "Frontend", "level": "Middle", "suggested_salary": ""}


# ─── On-Demand модерация (Q1=B) ───

@router.post("/hire/{developer_id}")
async def hire_developer(
    developer_id: int,
    user: UserDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Прямое открытие чата с кандидатом за токены (без модерации)."""
    if user.role != "company":
        raise HTTPException(403, "Только для компаний")
    if developer_id == user.id:
        raise HTTPException(400, "Нельзя нанять себя")

    # Блокируем строку разработчика и компанию, чтобы избежать двойного списания
    dev_res = await db.execute(
        select(UserDB).where(UserDB.id == developer_id, UserDB.role == "developer").with_for_update()
    )
    dev = dev_res.scalars().first()
    
    comp_res = await db.execute(
        select(UserDB).where(UserDB.id == user.id).with_for_update()
    )
    comp = comp_res.scalars().first()
    if not dev:
        raise HTTPException(404, "Кандидат не найден")
    if dev.banned:
        raise HTTPException(403, "Кандидат заблокирован")
    if dev.test_status != "approved" or not dev.skills_data:
        raise HTTPException(403, "Кандидат не прошёл верификацию.")

    # Считаем стоимость
    dev_grade = (dev.skills_data or {}).get("final_grade", "Junior")
    cost = GRADE_TOKEN_COST.get(dev_grade, 100)
    
    is_enterprise = comp.plan == "enterprise"
    if not is_enterprise:
        current_tokens = comp.tokens or 0
        if current_tokens < cost:
            raise HTTPException(402, f"Недостаточно токенов. Нужно {cost}, у вас {current_tokens}.")

    # Проверяем, есть ли уже чат
    from ..auth import Conversation
    conv_res = await db.execute(
        select(Conversation).where(
            Conversation.company_id == user.id,
            Conversation.developer_id == developer_id
        )
    )
    conv = conv_res.scalars().first()
    
    if not conv:
        conv = Conversation(company_id=user.id, developer_id=developer_id)
        db.add(conv)
        await db.flush()
        
    # Списываем токены, если чат новый ИЛИ если он был создан до внедрения оплаты (tokens_spent == 0)
    needs_payment = not conv.tokens_spent
    
    if needs_payment and not is_enterprise:
        comp.tokens -= cost
        conv.tokens_spent = cost
        from datetime import datetime, timedelta
        conv.refund_deadline = utcnow_naive() + timedelta(days=3)
        
        db.add(UsageLog(
            company_id=user.id, action="hire_chat",
            cost=cost, candidate_id=dev.id
        ))
    
    await db.commit()
    await db.refresh(conv)
    
    return {
        "status": "ok",
        "conversation_id": conv.id,
        "tokens_left": comp.tokens,
        "cost": cost if not is_enterprise else 0
    }


@router.get("/verification-requests")
async def list_verification_requests(
    user: UserDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if user.role != "company":
        raise HTTPException(403, "Только для компаний")

    res = await db.execute(
        select(VerificationRequest)
        .where(VerificationRequest.company_id == user.id)
        .order_by(VerificationRequest.created_at.desc())
    )
    reqs = res.scalars().all()

    items = []
    for r in reqs:
        d_res = await db.execute(select(UserDB).where(UserDB.id == r.developer_id))
        d = d_res.scalars().first()
        items.append({
            "id": r.id,
            "company_id": r.company_id,
            "developer_id": r.developer_id,
            "developer_name": d.full_name if d else None,
            "developer_grade": (d.skills_data or {}).get("final_grade") if d and d.skills_data else None,
            "developer_avatar": d.avatar_url if d else None,
            "status": r.status,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "moderated_at": r.moderated_at.isoformat() if r.moderated_at else None,
            "rejection_reason": r.rejection_reason,
        })
    return {"items": items}

@router.get("/vacancy/{job_id}/top")
async def get_vacancy_top(
    job_id: str,
    user: UserDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if user.role != "company":
        raise HTTPException(403, "Только для компаний")
    
    from ..auth import VacancyApplication
    from sqlalchemy import select
    
    # Ищем одобренные отклики именно на эту вакансию
    res = await db.execute(
        select(VacancyApplication)
        .where(
            VacancyApplication.job_id == job_id,
            VacancyApplication.company_id == user.id,
            VacancyApplication.status == "approved",
        )
    )
    apps = res.scalars().all()
    
    if not apps:
        return {"items": []}
        
    dev_ids = [a.developer_id for a in apps]
    dev_res = await db.execute(select(UserDB).where(UserDB.id.in_(dev_ids)))
    devs = dev_res.scalars().all()
    
    items = []
    for d in devs:
        if d.skills_data:
            items.append({
                "id": d.id,
                "full_name": d.full_name,
                "final_grade": d.skills_data.get("final_grade", "—"),
                "total_score": d.skills_data.get("total_score_100", 0),
                "summary": d.skills_data.get("summary", ""),
                "avatar_url": d.avatar_url,
            })
    
    items.sort(key=lambda x: x["total_score"], reverse=True)
    return {"items": items}
