from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
import shutil
import uuid
import os
from pydantic import BaseModel

from ..auth import (
    UserDB,
    create_access_token,
    get_current_user,
    get_db,
    get_password_hash,
    verify_password,
)
from ..schemas import Token, UserProfile, UserRegister, UpdateProfileReq

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginReq(BaseModel):
    email: str
    password: str

@router.post("/register", response_model=Token)
def register(data: UserRegister, db=Depends(get_db)):
    existing = db.query(UserDB).filter(UserDB.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
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
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserProfile)
def me(user: UserDB = Depends(get_current_user)):
    return UserProfile(
        id=user.id, email=user.email, role=user.role, full_name=user.full_name,
        skills=user.skills_data, company_name=user.company_name, website=user.website,
        github_username=user.github_username, github_stats=user.github_stats, bio=user.bio,
        avatar_url=user.avatar_url, projects=user.projects, job_postings=user.job_postings,
        last_test_at=user.last_test_at
    )

class SearchRequest(BaseModel):
    grade: Optional[str] = None
    stack: Optional[str] = None
    language: Optional[str] = None
    job_id: Optional[str] = None

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
def search_candidates(req: SearchRequest, user: UserDB = Depends(get_current_user), db=Depends(get_db)):
    query = db.query(UserDB).filter(UserDB.role == "developer", UserDB.skills_data.isnot(None))
    users = query.all()

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
            
            # Расчет ЗП
            base_salaries = {"Junior": 60000, "Middle": 150000, "Senior": 250000, "Reject": 0}
            base_salary = base_salaries.get(grade, 0)
            score_modifier = 0.8 + (score / 100) * 0.5
            test_salary = base_salary * score_modifier
            gh_stats = u.github_stats or {}
            stars = gh_stats.get("total_stars", 0)
            github_bonus = min(stars * 1000, 30000)
            estimated_salary = int(test_salary + github_bonus)

            # УМНЫЙ РАСЧЕТ СОВПАДЕНИЯ (Match Score)
            match_score = 0
            if user.role == "company" and user.job_postings:
                target_job = None
                if req.job_id:
                    target_job = next((j for j in user.job_postings if str(j.get("id")) == str(req.job_id)), None)
                if not target_job:
                    target_job = user.job_postings[-1]
                    
                job_stack = target_job.get("stack", "").lower()
                job_level = target_job.get("level", "").lower()
                cand_grade = grade.lower()

                # 1. Стек (макс 50)
                if job_stack and cand_stack:
                    if job_stack == cand_stack:
                        match_score += 50
                    elif job_stack in cand_stack or cand_stack in job_stack:
                        match_score += 30
                    else:
                        # Штраф за полное несовпадение стека
                        match_score = 0 

                # 2. Уровень (макс 30)
                if job_level and cand_grade:
                    levels = ["junior", "middle", "senior"]
                    if job_level in levels and cand_grade in levels:
                        diff = abs(levels.index(job_level) - levels.index(cand_grade))
                        if diff == 0: match_score += 30
                        elif diff == 1: match_score += 15

                # 3. Баллы за тест (макс 20)
                match_score += int((score / 100) * 20)
            else:
                # Если вакансия не выбрана, просто показываем качество теста
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

@router.post("/skills")
def save_skills(report: SkillsReport, user: UserDB = Depends(get_current_user), db=Depends(get_db)):
    if user.role != "developer": raise HTTPException(status_code=403, detail="Only developers")
    user.skills_data = report.model_dump()
    user.last_test_at = datetime.utcnow()
    db.commit()
    return {"status": "ok"}

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
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    os.makedirs("uploads/avatars", exist_ok=True)
    filepath = f"uploads/avatars/{filename}"
    with open(filepath, "wb") as buffer: shutil.copyfileobj(file.file, buffer)
    url = f"http://localhost:8000/uploads/avatars/{filename}"
    user.avatar_url = url
    db.commit()
    return {"url": url}

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), user: UserDB = Depends(get_current_user)):
    if not file.content_type.startswith("image/"): raise HTTPException(400, "Только изображения")
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    os.makedirs("uploads/images", exist_ok=True)
    os.makedirs("uploads/images", exist_ok=True)
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
        last_test_at=user.last_test_at,
    )
