import re
from typing import Optional
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
import shutil
import uuid
import os
import glob
from pydantic import BaseModel

from ..auth import (
    utcnow_naive,
    UserDB, create_access_token, get_current_user, get_current_user_optional, get_db, get_password_hash, verify_password,
)
from ..config import settings
from ..interview_store import save as save_interview, get as get_interview
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
async def me(user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Считаем реальное место в топе
    rank = None
    if user.skills_data and user.skills_data.get("total_score_100"):
        my_score = user.skills_data.get("total_score_100")
        all_users = await db.execute(select(UserDB).where(UserDB.skills_data.isnot(None)))
        better_users = [u for u in all_users.scalars().all() if u.skills_data.get("total_score_100", 0) > my_score]
        rank = len(better_users) + 1

    return UserProfile(
        id=user.id, email=user.email, role=user.role, full_name=user.full_name,
        skills=user.skills_data, company_name=user.company_name, website=user.website,
        github_username=user.github_username, github_stats=user.github_stats, bio=user.bio,
        avatar_url=user.avatar_url, projects=user.projects, job_postings=user.job_postings,
        last_test_at=user.last_test_at,
        test_status=user.test_status,
        interview_video_url=user.interview_video_url,
        attempts_used=user.attempts_used or 0,
        blocked_until=user.blocked_until,
        profile_views=user.profile_views or 0,
        top_rank=rank,
        project_rate=user.project_rate,
        expected_salary=user.expected_salary,
        plan=user.plan,
        verifications_left=user.verifications_left,
        tokens=user.tokens,
        subscription_until=user.subscription_until,
        banned=bool(user.banned),
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
    project_rate: int | None = None
    expected_salary: int | None = None

@router.post("/search", response_model=list[CandidateProfile])
async def search_candidates(req: SearchRequest, user: UserDB | None = Depends(get_current_user_optional), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UserDB).where(
            UserDB.role == "developer",
            UserDB.skills_data.isnot(None),
            UserDB.banned == False,
        )
    )
    users = result.scalars().all()

    unlocked_devs = set()
    if user and user.role == "company":
        from ..auth import Conversation
        conv_res = await db.execute(select(Conversation.developer_id).where(Conversation.company_id == user.id))
        unlocked_devs = {row[0] for row in conv_res.fetchall()}

    results = []
    for u in users:
        data = u.skills_data
        if not data: continue

        match = True
        # Уровень (грейд) должен совпадать точно (junior != middle)
        if req.grade and data.get("final_grade", "").lower() != req.grade.lower(): 
            match = False
        # Стек ищем по вхождению, разбивая фильтр на части (чтобы Data / ML находило data)
        if req.stack:
            req_stack_parts = [p.strip().lower() for p in req.stack.replace("/", " ").split() if p.strip()]
            cand_stack = data.get("stack_id", "").lower()
            if not any(part in cand_stack or cand_stack in part for part in req_stack_parts):
                match = False
        # Язык ищем в списке языков кандидата
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

            # Фильтр по минимальной зарплате (используем expected_salary, если он указан)
            if req.min_salary:
                effective_salary = u.expected_salary or estimated_salary
                if effective_salary < req.min_salary:
                    continue

            match_score = 0
            if user and user.role == "company" and user.job_postings:
                target_job = None
                if req.job_id:
                    target_job = next((j for j in user.job_postings if str(j.get("id")) == str(req.job_id)), None)
                if not target_job:
                    # Если вакансия не выбрана, берем последнюю внутреннюю
                    internal_jobs = [j for j in user.job_postings if not j.get("is_external")]
                    if internal_jobs:
                        target_job = internal_jobs[-1]
                
                if target_job:
                    job_stack = target_job.get("stack", "").lower()
                    job_level = target_job.get("level", "").lower()
                    job_salary_str = target_job.get("salary", "")
                    cand_grade = grade.lower()

                    # 1. Балл за тест (макс 40)
                    match_score += int((score / 100) * 40)

                    # 2. Совпадение стека (макс 20)
                    if job_stack and cand_stack:
                        if job_stack == cand_stack: match_score += 20
                        elif job_stack in cand_stack or cand_stack in job_stack: match_score += 10

                    # 3. Совпадение уровня (макс 25)
                    levels = ["junior", "middle", "senior"]
                    if job_level in levels and cand_grade in levels:
                        diff = abs(levels.index(job_level) - levels.index(cand_grade))
                        if diff == 0: match_score += 25
                        elif diff == 1: match_score += 10

                    # 4. Совпадение языков (макс 15)
                    job_langs = [l.strip().lower() for l in str(target_job.get("languages", "")).split(",") if l.strip()]
                    cand_langs = [l.strip().lower() for l in data.get("language_id", "").split(",") if l.strip()]
                    if job_langs and cand_langs:
                        overlap = set(job_langs).intersection(set(cand_langs))
                        if overlap:
                            match_score += 15

                    # 4. Зарплата (макс 10)
                    if job_salary_str and u.expected_salary:
                        salary_nums = [int(n) for n in re.findall(r'\d+', job_salary_str.replace(" ", ""))]
                        if salary_nums:
                            max_job_salary = max(salary_nums)
                            if u.expected_salary <= max_job_salary:
                                match_score += 5
            else:
                match_score = int(score)

            results.append(
                CandidateProfile(
                    id=u.id, full_name=u.full_name, email=u.email, final_grade=grade,
                    total_score=score, stack=data.get("stack_id", ""), language=data.get("language_id", ""),
                    summary=data.get("summary", ""), match_score=min(100, match_score),
                    estimated_salary=estimated_salary, github_stars=stars, avatar_url=u.avatar_url,
                    project_rate=u.project_rate, expected_salary=u.expected_salary,
                    is_unlocked=(u.id in unlocked_devs)
                )
            )
    results.sort(key=lambda x: (x.match_score, x.total_score), reverse=True)
    return results

class SkillsReport(BaseModel):
    chat_history: Optional[list[dict]] = None

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
    if user.role != "developer":
        raise HTTPException(403, "Only developers")

    # Защита от двойного инкремента при повторном вызове save_skills
    current_id = (user.pending_skills_data or {}).get("interview_id")
    new_id = report.model_dump().get("interview_id")
    if current_id != new_id:
        user.attempts_used = (user.attempts_used or 0) + 1

    user.last_test_at = utcnow_naive()

    # Подтягиваем историю чата из интервью (для профиля и модерации)
    chat_history = []
    if report.interview_id:
        try:
            _it = await get_interview(report.interview_id)
            if _it:
                chat_history = [{"role": t.role, "content": t.content} for t in _it.turns]
        except Exception as _e:
            print(f"  ⚠️ Не удалось получить chat_history: {_e}")

    # Если ИИ отклонил (Reject) или прервал собеседование — НЕ отправляем на модерацию
    if report.rejected or report.final_grade == "Reject":
        user.test_status = "rejected"
        user.pending_skills_data = None
        user.interview_video_url = None

        # Помечаем интервью как rejected, чтобы media.py отклонил поздние видео
        if report.interview_id:
            try:
                it = await get_interview(report.interview_id)
                if it:
                    it.rejected = True
                    it.finished = True
                    await save_interview(it)
            except Exception as e:
                print(f"  ⚠️ Не удалось обновить interview rejected: {e}")

            # УДАЛЯЕМ ВИДЕОФАЙЛ С СЕРВЕРА, если финальный грейд Reject
            files = glob.glob(f"uploads/{report.interview_id}_*.webm")
            for f in files:
                try:
                    os.remove(f)
                    print(f"  🗑️ Удалено видео для Reject-интервью: {f}")
                except Exception as e:
                    print(f"  ⚠️ Не удалось удалить видео {f}: {e}")

        # Если это была 3-я попытка — блокируем на полгода
        if (user.attempts_used or 0) >= 3:
            user.blocked_until = utcnow_naive() + timedelta(days=180)
    else:
        # Если прошел успешно — отправляем на модерацию
        user.pending_skills_data = report.model_dump()
        if chat_history:
            user.pending_skills_data["chat_history"] = chat_history
        user.test_status = "pending"

    # Ищем видео по ID собеседования
    if report.interview_id:
        files = glob.glob(f"uploads/{report.interview_id}_*.webm")
        if files:
            user.interview_video_url = f"/{files[0].replace(os.sep, '/')}"

    await db.commit()
    return {"status": "ok"}


@router.delete("/me")
async def delete_account(user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Полное удаление аккаунта и всех связанных данных."""
    from sqlalchemy import delete
    from ..interview_store import SessionLocal as InterviewSession, DBInterview, DBTurn
    
    # 1. Удаляем интервью и ответы (они в другой БД-сессии)
    async with InterviewSession() as idb:
        res = await idb.execute(select(DBInterview.id).where(DBInterview.user_id == user.id))
        it_ids = [r[0] for r in res.fetchall()]
        if it_ids:
            await idb.execute(delete(DBTurn).where(DBTurn.interview_id.in_(it_ids)))
            await idb.execute(delete(DBInterview).where(DBInterview.id.in_(it_ids)))
        await idb.commit()

    # 2. Удаляем пользователя (каскадно удалит чаты, отклики, счета и т.д. благодаря ondelete="CASCADE")
    await db.delete(user)
    await db.commit()
    
    return {"status": "ok"}


@router.put("/profile")
async def update_profile(data: UpdateProfileReq, user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if data.bio is not None: user.bio = data.bio
    if data.avatar_url is not None: user.avatar_url = data.avatar_url
    if data.projects is not None: user.projects = data.projects
    if data.project_rate is not None: user.project_rate = data.project_rate
    if data.expected_salary is not None: user.expected_salary = data.expected_salary
    if data.website is not None: user.website = data.website
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
            # Умный поиск по стеку (вхождение)
            if req.stack and req.stack.lower() not in job.get("stack", "").lower(): 
                match = False
            # Строгий поиск по уровню (Junior ищет Junior)
            if req.level and req.level.lower() != job.get("level", "").lower(): 
                match = False
            # Поиск по формату
            if req.format and req.format.lower() != job.get("format", "").lower(): 
                match = False
            
            # Умный поиск по зарплате (берём нижнюю границу диапазона)
            if req.min_salary:
                salary_str = str(job.get("salary", "0"))
                numbers = re.findall(r'\d+', salary_str.replace(" ", "").replace("\xa0", ""))
                if numbers:
                    job_salary = int(numbers[0])
                    if job_salary < req.min_salary:
                        match = False
                else:
                    match = False # Если зарплата не указана, а фильтр стоит - не показываем

            if match:
                matched_jobs.append({
                    **job,
                    "company_name": comp.full_name,
                    "company_id": comp.id,
                    "company_avatar": comp.avatar_url
                })
    return matched_jobs

# Дедуп просмотров: считаем не больше 1 просмотра в день на пару (viewer_id, target_id)
_profile_views_cache: dict[tuple[int, int], str] = {}

def _today_str() -> str:
    from datetime import date
    return date.today().isoformat()


@router.get("/user/{user_id}", response_model=UserProfile)
async def get_public_profile(user_id: int, db: AsyncSession = Depends(get_db), current_user: UserDB | None = Depends(get_current_user_optional)):
    result = await db.execute(select(UserDB).where(UserDB.id == user_id))
    user = result.scalars().first()
    if not user: raise HTTPException(404, "User not found")
    if user.banned: raise HTTPException(404, "Профиль недоступен")
    
    # Считаем просмотр не больше 1 раза в день от одной компании
    if current_user and current_user.id != user.id and current_user.role == "company":
        today = _today_str()
        key = (current_user.id, user.id)
        if _profile_views_cache.get(key) != today:
            user.profile_views = (user.profile_views or 0) + 1
            _profile_views_cache[key] = today
            # Простая очистка старых записей, чтобы dict не рос бесконечно
            if len(_profile_views_cache) > 50000:
                for k in list(_profile_views_cache.keys()):
                    if _profile_views_cache[k] != today:
                        del _profile_views_cache[k]
            await db.commit()
            await db.refresh(user)

    # Считаем место в топе (сколько людей имеют балл выше + 1)
    rank = None
    if user.skills_data and user.skills_data.get("total_score_100"):
        my_score = user.skills_data.get("total_score_100")
        rank_res = await db.execute(select(func.count(UserDB.id)).where(UserDB.skills_data.isnot(None)))
        # Упрощенный подсчет: реальный ранг считаем через SQL, но для простоты сделаем так:
        all_users = await db.execute(select(UserDB).where(UserDB.skills_data.isnot(None)))
        better_users = [u for u in all_users.scalars().all() if u.skills_data.get("total_score_100", 0) > my_score]
        rank = len(better_users) + 1

    is_unlocked = False
    if current_user and current_user.id != user.id and current_user.role == "company":
        from ..auth import Conversation
        conv_res = await db.execute(select(Conversation).where(Conversation.company_id == current_user.id, Conversation.developer_id == user.id))
        conv = conv_res.scalars().first()
        if conv and (conv.tokens_spent > 0 or current_user.plan == "enterprise"):
            is_unlocked = True

    return UserProfile(
        id=user.id, email=user.email, role=user.role, full_name=user.full_name,
        skills=user.skills_data, company_name=user.company_name, website=user.website,
        github_username=user.github_username, github_stats=user.github_stats, bio=user.bio,
        avatar_url=user.avatar_url, projects=user.projects, job_postings=user.job_postings,
        last_test_at=user.last_test_at, test_status=user.test_status, interview_video_url=user.interview_video_url,
        attempts_used=user.attempts_used or 0,
        blocked_until=user.blocked_until,
        profile_views=user.profile_views or 0,
        top_rank=rank,
        project_rate=user.project_rate,
        expected_salary=user.expected_salary,
        plan=user.plan,
        verifications_left=user.verifications_left,
        tokens=user.tokens,
        subscription_until=user.subscription_until,
        banned=bool(user.banned),
        is_unlocked=is_unlocked,
    )
