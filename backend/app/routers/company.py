from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..auth import (
    get_current_user, get_db, UserDB,
    VerificationRequest, utcnow_naive,
)
from ..config import settings
from ..gigachat_client import ask_text
import json, re

router = APIRouter(prefix="/api/company", tags=["company"])

GRADE_TOKEN_COST = {
    "Junior": 50,
    "Middle": 150,
    "Senior": 300,
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

@router.post("/request-unlock/{developer_id}")
async def request_unlock(
    developer_id: int,
    user: UserDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Компания просит открыть контакты кандидата. Триггерит On-Demand модерацию."""
    if user.role != "company":
        raise HTTPException(403, "Только для компаний")
    if developer_id == user.id:
        raise HTTPException(400, "Нельзя открыть свой профиль")

    # Проверка лимита токенов (только если ENFORCE_LIMITS=true)
    if settings.ENFORCE_LIMITS:
        is_enterprise = user.plan == "enterprise"
        if not is_enterprise:
            dev_grade = (dev.skills_data or {}).get("final_grade", "Junior")
            cost = GRADE_TOKEN_COST.get(dev_grade, 50)
            if user.tokens < cost:
                raise HTTPException(
                    402,
                    f"Недостаточно токенов для открытия контактов ({dev_grade} стоит {cost} токенов). Пополните баланс.",
                )
            user.tokens -= cost

    # Кандидат существует и не забанен
    dev_res = await db.execute(
        select(UserDB).where(UserDB.id == developer_id, UserDB.role == "developer")
    )
    dev = dev_res.scalars().first()
    if not dev:
        raise HTTPException(404, "Кандидат не найден")
    if dev.banned:
        raise HTTPException(403, "Кандидат заблокирован модерацией")

    # Уже есть активный/одобренный запрос?
    ex_res = await db.execute(
        select(VerificationRequest).where(
            VerificationRequest.company_id == user.id,
            VerificationRequest.developer_id == developer_id,
            VerificationRequest.status.in_(["pending", "approved"]),
        )
    )
    existing = ex_res.scalars().first()
    if existing:
        if existing.status == "approved":
            return {"status": "already_unlocked", "request_id": existing.id}
        return {"status": "already_pending", "request_id": existing.id}

    req = VerificationRequest(
        company_id=user.id,
        developer_id=developer_id,
        status="pending",
        reserved_credit=True,
    )
    db.add(req)
    await db.commit()
    await db.refresh(req)
    return {"status": "pending", "request_id": req.id}


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
        .where(VacancyApplication.job_id == job_id, VacancyApplication.company_id == user.id)
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
