from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..auth import get_db, get_current_user, UserDB

router = APIRouter(prefix="/api/admin", tags=["admin"])

def require_admin(user: UserDB = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(403, "Только для администратора")
    return user

@router.get("/pending")
def get_pending(admin: UserDB = Depends(require_admin), db: Session = Depends(get_db)):
    users = db.query(UserDB).filter(UserDB.test_status == "pending").all()
    return [{
        "id": u.id,
        "full_name": u.full_name,
        "email": u.email,
        "video_url": u.interview_video_url,
        "skills": u.pending_skills_data
    } for u in users]

@router.post("/approve/{user_id}")
def approve(user_id: int, admin: UserDB = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user or not user.pending_skills_data:
        raise HTTPException(404, "Not found")
    user.skills_data = user.pending_skills_data
    user.test_status = "approved"
    user.pending_skills_data = None
    db.commit()
    return {"status": "ok"}

@router.post("/reject/{user_id}")
def reject(user_id: int, admin: UserDB = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(404, "Not found")
    user.test_status = "rejected"
    user.pending_skills_data = None
    db.commit()
    return {"status": "ok"}
