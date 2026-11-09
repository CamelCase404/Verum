from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..auth import get_db, UserDB

router = APIRouter(prefix="/api/jobs", tags=["vacancy"])

@router.get("/{slug}")
async def get_public_vacancy(slug: str, db: AsyncSession = Depends(get_db)):
    """Публичный эндпоинт для страницы /v/:slug (без авторизации)."""
    res = await db.execute(select(UserDB).where(UserDB.role == "company", UserDB.job_postings.isnot(None)))
    companies = res.scalars().all()
    
    for comp in companies:
        for job in comp.job_postings:
            if job.get("slug") == slug:
                return {
                    "job_id": job["id"],
                    "title": job["title"],
                    "description": job.get("description", ""),
                    "stack": job.get("stack", ""),
                    "level": job.get("level", ""),
                    "format": job.get("format", ""),
                    "salary": job.get("salary", ""),
                    "company_name": comp.full_name,
                    "company_id": comp.id,
                    "company_avatar": comp.avatar_url,
                }
    raise HTTPException(404, "Вакансия не найдена или закрыта")
