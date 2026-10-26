from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
import shutil
import uuid
import os
import glob
from pydantic import BaseModel

from ..auth import (
    UserDB, create_access_token, get_current_user, get_db, get_password_hash, verify_password,
)
from ..schemas import Token, UserProfile, UserRegister, UpdateProfileReq

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginReq(BaseModel):
    email: str
    password: str

@router.post("/register", response_model=Token)
def register(data: UserRegister, db=Depends(get_db)):
    existing = db.query(UserDB).filter(UserDB.email == data.email).first()
    if existing: raise HTTPException(400, "Email already registered")
    
    user = UserDB(email=data.email, hashed_password=get_password_hash(data.password), role=data.role.value, full_name=data.full_name)
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(data: LoginReq, db=Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Incorrect email or password")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserProfile)
def me(user: UserDB = Depends(get_current_user)):
    return UserProfile(
        id=user.id, email=user.email, role=user.role, full_name=user.full_name,
        skills=user.skills_data, company_name=user.company_name, website=user.website,
        github_username=user.github_username, github_stats=user.github_stats, bio=user.bio,
        avatar_url=user.avatar_url, projects=user.projects, job_postings=user.job_postings,
        last_test_at=user.last_test_at,
        test_status=user.test_status,
        interview_video_url=user.interview_video_url
    )

class SkillsReport(BaseModel):
    final_grade: str
    total_score_100: int
    stack_id: str
    language_id: str
    summary: str
    stages: Optional[list[dict]] = None
    strengths: Optional[list[str]] = None
    gaps: Optional[list[str]] = None
    recommendation: Optional[str] = None
    competency_architecture: Optional[int] = None
    competency_code_understanding: Optional[int] = None
    competency_prompting: Optional[int] = None
    competency_adaptability: Optional[int] = None
    competency_soft_skills: Optional[int] = None
    interview_id: Optional[str] = None # Добавили для поиска видео

@router.post("/skills")
def save_skills(report: SkillsReport, user: UserDB = Depends(get_current_user), db=Depends(get_db)):
    if user.role != "developer": raise HTTPException(403, "Only developers")
    
    # Сохраняем в карантин, а не сразу в skills_data
    user.pending_skills_data = report.model_dump()
    user.test_status = "pending"
    user.last_test_at = datetime.utcnow()
    
    # Ищем видео по ID собеседования
    if report.interview_id:
        files = glob.glob(f"uploads/{report.interview_id}_*.webm")
        if files:
            user.interview_video_url = f"/{files[0].replace(os.sep, '/')}"
            
    db.commit()
    return {"status": "ok"}

# ОСТАЛЬНЫЕ РОУТЫ (profile, avatar, search и т.д.)
@router.put("/profile")
def update_profile(data: UpdateProfileReq, user: UserDB = Depends(get_current_user), db=Depends(get_db)):
    if data.bio is not None: user.bio = data.bio
    if data.avatar_url is not None: user.avatar_url = data.avatar_url
    if data.projects is not None: user.projects = data.projects
    db.commit()
    return {"status": "ok"}

@router.post("/upload-avatar")
async def upload_avatar(file: UploadFile = File(...), user: UserDB = Depends(get_current_user), db=Depends(get_db)):
    if not file.content_type.startswith("image/"): raise HTTPException(400, "Только изображения")
    os.makedirs("uploads/avatars", exist_ok=True)
    filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    filepath = f"uploads/avatars/{filename}"
    with open(filepath, "wb") as buffer: shutil.copyfileobj(file.file, buffer)
    user.avatar_url = f"http://localhost:8000/uploads/avatars/{filename}"
    db.commit()
    return {"url": user.avatar_url}

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), user: UserDB = Depends(get_current_user)):
    if not file.content_type.startswith("image/"): raise HTTPException(400, "Только изображения")
    os.makedirs("uploads/images", exist_ok=True)
    filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    filepath = f"uploads/images/{filename}"
    with open(filepath, "wb") as buffer: shutil.copyfileobj(file.file, buffer)
    return {"url": f"http://localhost:8000/uploads/images/{filename}"}

class UpdateJobsReq(BaseModel):
    job_postings: list[dict]

@router.put("/jobs")
def update_jobs(data: UpdateJobsReq, user: UserDB = Depends(get_current_user), db=Depends(get_db)):
    if user.role != "company": raise HTTPException(403, "Только для компаний")
    user.job_postings = data.job_postings
    db.commit()
    return {"status": "ok"}

@router.get("/user/{user_id}", response_model=UserProfile)
def get_public_profile(user_id: int, db=Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user: raise HTTPException(404, "User not found")
    return UserProfile(
        id=user.id, email=user.email, role=user.role, full_name=user.full_name,
        skills=user.skills_data, company_name=user.company_name, website=user.website,
        github_username=user.github_username, github_stats=user.github_stats, bio=user.bio,
        avatar_url=user.avatar_url, projects=user.projects, job_postings=user.job_postings,
        last_test_at=user.last_test_at, test_status=user.test_status, interview_video_url=user.interview_video_url
    )

# ... (search_candidates оставляем как было, я его опустил для краткости, ты его не удаляй)
