import os
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..auth import get_db, get_current_user, UserDB
from ..interview_store import get as get_interview


def _delete_video_file(video_url: str | None):
    """Удаляет видеофайл с диска по URL-пути из профиля пользователя."""
    if not video_url:
        return
    try:
        # video_url вида "/uploads/interview_id_hash.webm"
        filename = video_url.lstrip("/").replace("uploads/", "")
        filepath = f"uploads/{filename}"
        if os.path.exists(filepath):
            os.remove(filepath)
            print(f"  🗑️ Видео удалено: {filepath}")
        else:
            print(f"  ℹ️ Видео не найдено (уже удалено?): {filepath}")
    except Exception as e:
        print(f"  ⚠️ Не удалось удалить видео {video_url}: {e}")


router = APIRouter(prefix="/api/admin", tags=["admin"])

def require_admin(user: UserDB = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(403, "Только для администратора")
    return user

@router.get("/pending")
async def get_pending(admin: UserDB = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    result = await db.execute(select(UserDB).where(UserDB.test_status == "pending"))
    users = result.scalars().all()
    result = []
    for u in users:
        chat_history = []
        if u.pending_skills_data:
            it_id = u.pending_skills_data.get("interview_id")
            if it_id:
                it = await get_interview(it_id)
                if it:
                    chat_history = [{"role": t.role, "content": t.content} for t in it.turns]
        
        result.append({
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "video_url": u.interview_video_url,
            "skills": u.pending_skills_data,
            "chat_history": chat_history,
        })
    return result

@router.post("/approve/{user_id}")
async def approve(user_id: int, admin: UserDB = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    result = await db.execute(select(UserDB).where(UserDB.id == user_id))
    user = result.scalars().first()
    if not user or not user.pending_skills_data:
        raise HTTPException(404, "Not found")
    user.skills_data = user.pending_skills_data
    user.test_status = "approved"
    user.pending_skills_data = None
    user.blocked_until = datetime.utcnow() + timedelta(days=180)
    user.attempts_used = 0
    
    # Удаляем видео после модерации (больше не нужно)
    _delete_video_file(user.interview_video_url)
    user.interview_video_url = None
    
    await db.commit()
    return {"status": "ok"}

@router.post("/reject/{user_id}")
async def reject(user_id: int, admin: UserDB = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    result = await db.execute(select(UserDB).where(UserDB.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(404, "Not found")
    user.pending_skills_data = None
    
    # Удаляем видео после модерации (больше не нужно)
    _delete_video_file(user.interview_video_url)
    user.interview_video_url = None
    
    # Если это была 3-я попытка - блокируем на 6 месяцев
    if (user.attempts_used or 0) >= 3:
        user.blocked_until = datetime.utcnow() + timedelta(days=180)
        user.attempts_used = 0
    # Если у юзера был предыдущий одобренный грейд - оставляем approved
    user.test_status = "approved" if user.skills_data else "rejected"
    await db.commit()
    return {"status": "ok"}
