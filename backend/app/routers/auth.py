from typing import Optional

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

    user = UserDB(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        role=data.role.value,
        full_name=data.full_name,
    )
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
    # явно прокидываем skills_data в поле skills (модель pydantic ждёт skills)
    return UserProfile(
        id=user.id,
        email=user.email,
        role=user.role,
        full_name=user.full_name,
        skills=user.skills_data,
        company_name=user.company_name,
        website=user.website,
        github_username=user.github_username,
        github_stats=user.github_stats,
        bio=user.bio,
        avatar_url=user.avatar_url,
        projects=user.projects,
        job_postings=user.job_postings,
    )


# --- Поиск кандидатов ---
class SearchRequest(BaseModel):
    grade: Optional[str] = None
    stack: Optional[str] = None
    language: Optional[str] = None


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
    query = db.query(UserDB).filter(
        UserDB.role == "developer", UserDB.skills_data.isnot(None)
    )
    users = query.all()

    results = []
    for u in users:
        data = u.skills_data
        if not data:
            continue

        match = True
        if req.grade and data.get("final_grade", "").lower() != req.grade.lower():
            match = False
        if req.stack and data.get("stack_id", "").lower() != req.stack.lower():
            match = False
        if (
            req.language
            and req.language.lower() not in data.get("language_id", "").lower()
        ):
            match = False

        if match:
            # --- РАСЧЕТ СТОИМОСТИ (Salary) ---
            score = data.get("total_score_100", 0)
            grade = data.get("final_grade", "Reject")
            
            base_salaries = {"Junior": 60000, "Middle": 150000, "Senior": 250000, "Reject": 0}
            base_salary = base_salaries.get(grade, 0)
            
            # Бонус за тест (до +50% к базовой ставке)
            score_modifier = 0.8 + (score / 100) * 0.5
            test_salary = base_salary * score_modifier
            
            # Бонус за GitHub (по 1000 руб за звезду, но не более 30к)
            gh_stats = data.get("github_stats") or {}
            stars = gh_stats.get("total_stars", 0)
            github_bonus = min(stars * 1000, 30000)
            
            estimated_salary = int(test_salary + github_bonus)

            # --- РАСЧЕТ MATCH SCORE (Совпадение) ---
            # Ищем активную вакансию компании для сравнения
            match_score = 50 # Базовый процент, если просто листаем базу
            if user.role == "company" and user.job_postings:
                # Берем последнюю созданную вакансию для сравнения
                latest_job = user.job_postings[-1]
                job_stack = latest_job.get("stack", "").lower()
                job_level = latest_job.get("level", "").lower()
                
                if job_stack == data.get("stack_id", "").lower(): match_score += 20
                if job_level == grade.lower(): match_score += 20
                match_score += int(score * 0.1) # Бонус до 10% за высокий балл

            results.append(
                CandidateProfile(
                    id=u.id,
                    full_name=u.full_name,
                    email=u.email,
                    final_grade=grade,
                    total_score=score,
                    stack=data.get("stack_id", ""),
                    language=data.get("language_id", ""),
                    summary=data.get("summary", ""),
                    match_score=min(100, match_score),
                    estimated_salary=estimated_salary,
                    github_stars=stars,
                    avatar_url=u.avatar_url
                )
            )

    # Сортируем по Match Score, затем по баллам
    results.sort(key=lambda x: (x.match_score, x.total_score), reverse=True)
    return results


# --- Прием отчета от ИИ-собеседования ---
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
def save_skills(
    report: SkillsReport,
    user: UserDB = Depends(get_current_user),
    db=Depends(get_db),
):
    if user.role != "developer":
        raise HTTPException(status_code=403, detail="Only developers can submit skills")
    user.skills_data = report.model_dump()
    db.commit()
    db.refresh(user)
    return {"status": "ok", "skills_data": user.skills_data}


@router.put("/profile")
def update_profile(data: UpdateProfileReq, user: UserDB = Depends(get_current_user), db=Depends(get_db)):
    if data.bio is not None:
        user.bio = data.bio
    if data.avatar_url is not None:
        user.avatar_url = data.avatar_url
    if data.projects is not None:
        user.projects = data.projects
        
    db.commit()
    db.refresh(user)
    return {"status": "ok"}


@router.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    user: UserDB = Depends(get_current_user),
    db=Depends(get_db)
):
    # Проверка, что это картинка
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Можно загружать только изображения")
    
    # Генерируем уникальное имя файла
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = f"uploads/avatars/{filename}"
    
    # Сохраняем файл на диск
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Формируем URL (в проде тут будет ваш домен)
    url = f"http://localhost:8000/uploads/avatars/{filename}"
    
    # Сохраняем в БД
    user.avatar_url = url
    db.commit()
    
    return {"url": url}


@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    user: UserDB = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Можно загружать только изображения")
    
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    os.makedirs("uploads/images", exist_ok=True)
    filepath = f"uploads/images/{filename}"
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    url = f"http://localhost:8000/uploads/images/{filename}"
    return {"url": url}


class UpdateJobsReq(BaseModel):
    job_postings: list[dict]

@router.put("/jobs")
def update_jobs(data: UpdateJobsReq, user: UserDB = Depends(get_current_user), db=Depends(get_db)):
    if user.role != "company":
        raise HTTPException(status_code=403, detail="Только компании могут создавать вакансии")
    user.job_postings = data.job_postings
    db.commit()
    return {"status": "ok"}


@router.get("/user/{user_id}", response_model=UserProfile)
def get_public_profile(user_id: int, db=Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserProfile(
        id=user.id,
        email=user.email,
        role=user.role,
        full_name=user.full_name,
        skills=user.skills_data,
        company_name=user.company_name,
        website=user.website,
        github_username=user.github_username,
        github_stats=user.github_stats,
        bio=user.bio,
        avatar_url=user.avatar_url,
        projects=user.projects,
        job_postings=user.job_postings,
    )
