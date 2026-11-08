import os
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth import (
    get_db, get_current_user, UserDB,
    VerificationRequest, UsageLog, utcnow_naive,
)
from ..interview_store import get as get_interview


def _delete_video_file(video_url: str | None):
    if not video_url:
        return
    try:
        filename = video_url.lstrip("/").replace("uploads/", "")
        filepath = f"uploads/{filename}"
        if os.path.exists(filepath):
            os.remove(filepath)
            print(f"  🗑️ Видео удалено: {filepath}")
        else:
            print(f"  ℹ️ Видео не найдено: {filepath}")
    except Exception as e:
        print(f"  ⚠️ Не удалось удалить {video_url}: {e}")


router = APIRouter(prefix="/api/admin", tags=["admin"])


def require_admin(user: UserDB = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(403, "Только для администратора")
    return user


@router.get("/pending")
async def get_pending(
    admin: UserDB = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """On-Demand: показывает только активные verification_requests."""
    res = await db.execute(
        select(VerificationRequest)
        .where(VerificationRequest.status == "pending")
        .order_by(VerificationRequest.created_at.asc())
    )
    reqs = res.scalars().all()

    items = []
    for r in reqs:
        d_res = await db.execute(select(UserDB).where(UserDB.id == r.developer_id))
        dev = d_res.scalars().first()
        if not dev:
            continue
        c_res = await db.execute(select(UserDB).where(UserDB.id == r.company_id))
        comp = c_res.scalars().first()

        chat_history = []
        it_id = (dev.pending_skills_data or {}).get("interview_id") if dev.pending_skills_data else None
        if it_id:
            it = await get_interview(it_id)
            if it:
                chat_history = [{"role": t.role, "content": t.content} for t in it.turns]
        elif dev.pending_skills_data and dev.pending_skills_data.get("chat_history"):
            chat_history = dev.pending_skills_data["chat_history"]

        items.append({
            "id": r.id,  # ID запроса
            "developer_id": dev.id,
            "company_id": comp.id if comp else None,
            "company_name": comp.full_name if comp else "—",
            "full_name": dev.full_name,
            "email": dev.email,
            "video_url": dev.interview_video_url,
            "skills": dev.pending_skills_data or dev.skills_data,
            "chat_history": chat_history,
            "timecode_markers": None,  # TODO в Блоке 2.4
            "created_at": r.created_at.isoformat() if r.created_at else None,
        })
    return items


@router.post("/approve/{request_id}")
async def approve(
    request_id: int,
    admin: UserDB = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Approve VerificationRequest: списать 1 верификацию, открыть контакты."""
    r_res = await db.execute(select(VerificationRequest).where(VerificationRequest.id == request_id))
    req = r_res.scalars().first()
    if not req:
        raise HTTPException(404, "Запрос не найден")
    if req.status != "pending":
        raise HTTPException(400, f"Запрос уже в статусе {req.status}")

    d_res = await db.execute(select(UserDB).where(UserDB.id == req.developer_id))
    dev = d_res.scalars().first()
    c_res = await db.execute(select(UserDB).where(UserDB.id == req.company_id))
    comp = c_res.scalars().first()
    if not dev or not comp:
        raise HTTPException(404, "Пользователь не найден")

    now = utcnow_naive()
    req.status = "approved"
    req.moderated_by = admin.id
    req.moderated_at = now

    # Списать 1 верификацию (enterprise = безлимит)
    if comp.plan != "enterprise" and comp.verifications_left is not None and comp.verifications_left > 0:
        comp.verifications_left -= 1

    # Перенести skills_data → skills_data (одобрено)
    if dev.pending_skills_data:
        dev.skills_data = dev.pending_skills_data
        dev.pending_skills_data = None
        dev.test_status = "approved"
        dev.blocked_until = now + timedelta(days=180)
        dev.attempts_used = 0

    db.add(UsageLog(
        company_id=comp.id, action="unlock_contacts",
        cost=0, candidate_id=dev.id, interview_id=None,
    ))

    _delete_video_file(dev.interview_video_url)
    dev.interview_video_url = None

    await db.commit()
    return {"status": "ok", "verifications_left": comp.verifications_left}


@router.post("/reject/{request_id}")
async def reject(
    request_id: int,
    admin: UserDB = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Reject: кредит не списывается, кандидат банится."""
    r_res = await db.execute(select(VerificationRequest).where(VerificationRequest.id == request_id))
    req = r_res.scalars().first()
    if not req:
        raise HTTPException(404, "Запрос не найден")
    if req.status != "pending":
        raise HTTPException(400, f"Запрос уже в статусе {req.status}")

    d_res = await db.execute(select(UserDB).where(UserDB.id == req.developer_id))
    dev = d_res.scalars().first()

    now = utcnow_naive()
    req.status = "rejected"
    req.moderated_by = admin.id
    req.moderated_at = now
    req.rejection_reason = "Читерство / нарушение правил"

    if dev:
        dev.banned = True
        dev.test_status = "rejected"
        dev.pending_skills_data = None
        _delete_video_file(dev.interview_video_url)
        dev.interview_video_url = None

    await db.commit()
    return {"status": "ok"}
