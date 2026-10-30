import re
from typing import Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import shutil
import uuid
import os
import glob
from pydantic import BaseModel

from ..auth import (
    UserDB, create_access_token, get_current_user, get_current_user_optional, get_db, get_password_hash, verify_password,
)
from ..config import settings
from ..schemas import Token, UserProfile, UserRegister, UpdateProfileReq

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginReq(BaseModel):
    email: str
    password: str

@router.post("/register", response_model=Token)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserDB).where(UserDB.email == data.email))
    existing = result.scalars().first()
    if existing: raise HTTPException(400, "Email already registered")
    
    user = UserDB(email=data.email, hashed_password=get_password_hash(data.password), role=data.role.value, full_name=data.full_name)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(data: LoginReq, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserDB).where(UserDB.email == data.email))
    user = result.scalars().first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Incorrect email or password")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserProfile)
async def me(user: UserDB = Depends(get_current_user)):
    return UserProfile(
        id=user.id, email=user.email, role=user.role, full_name=user.full_name,
        skills=user.skills_data, company_name=user.company_name, website=user.website,
        github_username=user.github_username, github_stats=user.github_stats, bio=user.bio,
        avatar_url=user.avatar_url, projects=user.projects, job_postings=user.job_postings,
        last_test_at=user.last_test_at,
        test_status=user.test_status,
        interview_video_url=user.interview_video_url,
        attempts_used=user.attempts_used or 0,
        blocked_until=user.blocked_until
    )


class SearchRequest(BaseModel):
    grade: Optional[str] = None
    stack: Optional[str] = None
    language: Optional[str] = None
    job_id: Optional[str] = None
    min_salary: Optional[int] = None

class CandidateProfile(BaseModel):
    id: int
    full_name: str
    email: str
    final_grade: str
    total_score: int
    stack: str
    language: str
    summary: str
    match_score: int = 0
    estimated_salary: int = 0
    github_stars: int = 0
    avatar_url: str | None = None

@router.post("/search", response_model=list[CandidateProfile])
async def search_candidates(req: SearchRequest, user: UserDB | None = Depends(get_current_user_optional), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserDB).where(UserDB.role == "developer", UserDB.skills_data.isnot(None)))
    users = result.scalars().all()

    results = []
    for u in users:
        data = u.skills_data
        if not data: continue

        match = True
        if req.grade and data.get("final_grade", "").lower() != req.grade.lower(): match = False
        if req.stack and data.get("stack_id", "").lower() != req.stack.lower(): match = False
        if req.language:
            cand_langs = [l.strip().lower() for l in data.get("language_id", "").split(",")]
            if req.language.lower() not in cand_langs:
                match = False

        if match:
            score = data.get("total_score_100", 0)
            grade = data.get("final_grade", "Reject")
            cand_stack = data.get("stack_id", "").lower()
            
            base_salaries = {"Junior": 60000, "Middle": 150000, "Senior": 250000, "Reject": 0}
            base_salary = base_salaries.get(grade, 0)
            score_modifier = 0.8 + (score / 100) * 0.5
            test_salary = base_salary * score_modifier
            gh_stats = u.github_stats or {}
            stars = gh_stats.get("total_stars", 0)
            github_bonus = min(stars * 1000, 30000)
            estimated_salary = int(test_salary + github_bonus)

            match_score = 0
            if user and user.role == "company" and user.job_postings:
                target_job = None
                if req.job_id:
                    target_job = next((j for j in user.job_postings if str(j.get("id")) == str(req.job_id)), None)
                if not target_job:
                    target_job = user.job_postings[-1]
                    
                job_stack = target_job.get("stack", "").lower()
                job_level = target_job.get("level", "").lower()
                cand_grade = grade.lower()

                if job_stack and cand_stack:
                    if job_stack == cand_stack: match_score += 50
                    elif job_stack in cand_stack or cand_stack in job_stack: match_score += 30

                if job_level and cand_grade:
                    levels = ["junior", "middle", "senior"]
                    if job_level in levels and cand_grade in levels:
                        diff = abs(levels.index(job_level) - levels.index(cand_grade))
                        if diff == 0: match_score += 30
                        elif diff == 1: match_score += 15

                match_score += int((score / 100) * 20)
            else:
                match_score = int(score)

            results.append(
                CandidateProfile(
                    id=u.id, full_name=u.full_name, email=u.email, final_grade=grade,
                    total_score=score, stack=data.get("stack_id", ""), language=data.get("language_id", ""),
                    summary=data.get("summary", ""), match_score=min(100, match_score),
                    estimated_salary=estimated_salary, github_stars=stars, avatar_url=u.avatar_url
                )
            )
    results.sort(key=lambda x: (x.match_score, x.total_score), reverse=True)
    return results

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
    rejected: Optional[bool] = False

@router.post("/skills")
async def save_skills(report: SkillsReport, user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if user.role != "developer": raise HTTPException(403, "Only developers")
    
    # Защита от двойного инкремента при повторном вызове save_skills
    current_id = (user.pending_skills_data or {}).get("interview_id")
    new_id = report.model_dump().get("interview_id")
    if current_id != new_id:
        user.attempts_used = (user.attempts_used or 0) + 1
    
    user.last_test_at = datetime.utcnow()
    
    # Если ИИ отклонил (Reject) или прервал собеседование — НЕ отправляем на модерацию
    if report.rejected or report.final_grade == "Reject":
        user.test_status = "rejected"
        user.pending_skills_data = None
        # Если это была 3-я попытка — блокируем на полгода
        if (user.attempts_used or 0) >= 3:
            user.blocked_until = datetime.utcnow() + timedelta(days=180)
    else:
        # Если прошел успешно — отправляем на модерацию
        user.pending_skills_data = report.model_dump()
        user.test_status = "pending"
    
    # Ищем видео по ID собеседования
    if report.interview_id:
        files = glob.glob(f"uploads/{report.interview_id}_*.webm")
        if files:
            user.interview_video_url = f"/{files[0].replace(os.sep, '/')}"
            
    await db.commit()
    return {"status": "ok"}

# ОСТАЛЬНЫЕ РОУТЫ (profile, avatar, search и т.д.)
@router.put("/profile")
async def update_profile(data: UpdateProfileReq, user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if data.bio is not None: user.bio = data.bio
    if data.avatar_url is not None: user.avatar_url = data.avatar_url
    if data.projects is not None: user.projects = data.projects
    await db.commit()
    return {"status": "ok"}

@router.post("/upload-avatar")
async def upload_avatar(file: UploadFile = File(...), user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not file.content_type.startswith("image/"): raise HTTPException(400, "Только изображения")
    os.makedirs("uploads/avatars", exist_ok=True)
    filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    filepath = f"uploads/avatars/{filename}"
    with open(filepath, "wb") as buffer: shutil.copyfileobj(file.file, buffer)
    user.avatar_url = f"{settings.BACKEND_URL}/uploads/avatars/{filename}"
    await db.commit()
    return {"url": user.avatar_url}

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), user: UserDB = Depends(get_current_user)):
    if not file.content_type.startswith("image/"): raise HTTPException(400, "Только изображения")
    os.makedirs("uploads/images", exist_ok=True)
    filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    filepath = f"uploads/images/{filename}"
    with open(filepath, "wb") as buffer: shutil.copyfileobj(file.file, buffer)
    return {"url": f"{settings.BACKEND_URL}/uploads/images/{filename}"}

class UpdateJobsReq(BaseModel):
    job_postings: list[dict]

@router.put("/jobs")
async def update_jobs(data: UpdateJobsReq, user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if user.role != "company": raise HTTPException(403, "Только для компаний")
    user.job_postings = data.job_postings
    await db.commit()
    return {"status": "ok"}


class SearchJobReq(BaseModel):
    stack: Optional[str] = None
    level: Optional[str] = None
    format: Optional[str] = None
    min_salary: Optional[int] = None

@router.post("/search-jobs")
async def search_jobs(req: SearchJobReq, user: UserDB | None = Depends(get_current_user_optional), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserDB).where(UserDB.role == "company", UserDB.job_postings.isnot(None)))
    companies = result.scalars().all()
    
    matched_jobs = []
    for comp in companies:
        for job in comp.job_postings:
            match = True
            if req.stack and req.stack.lower() not in job.get("stack", "").lower(): match = False
            if req.level and req.level.lower() != job.get("level", "").lower(): match = False
            if req.format and req.format.lower() != job.get("format", "").lower(): match = False
            
            if req.min_salary:
                job_salary_str = str(job.get("salary", "0")).replace(" ", "").replace("\xa0", "")
                job_salary = int(re.sub(r'\D', '', job_salary_str) or 0)
                if job_salary < req.min_salary:
                    match = False

            if match:
                matched_jobs.append({
                    **job,
                    "company_name": comp.full_name,
                    "company_id": comp.id,
                    "company_avatar": comp.avatar_url
                })
    return matched_jobs

@router.get("/user/{user_id}", response_model=UserProfile)
async def get_public_profile(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserDB).where(UserDB.id == user_id))
    user = result.scalars().first()
    if not user: raise HTTPException(404, "User not found")
    return UserProfile(
        id=user.id, email=user.email, role=user.role, full_name=user.full_name,
        skills=user.skills_data, company_name=user.company_name, website=user.website,
        github_username=user.github_username, github_stats=user.github_stats, bio=user.bio,
        avatar_url=user.avatar_url, projects=user.projects, job_postings=user.job_postings,
        last_test_at=user.last_test_at, test_status=user.test_status, interview_video_url=user.interview_video_url,
        attempts_used=user.attempts_used or 0,
        blocked_until=user.blocked_until
    )

# ... (search_candidates оставляем как было, я его опустил для краткости, ты его не удаляй)
