from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pwdlib import PasswordHash  # <-- НОВЫЙ ИМПОРТ
from sqlalchemy import select, JSON, Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

from .schemas import UserRole

from .config import settings

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 дней

# Инициализируем современный хэшер (по умолчанию использует Argon2)
password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
from typing import Optional
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

import os
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://verum_user:verum_password_secure_change_me@db:5432/verum_db")
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
engine = create_async_engine(DATABASE_URL, echo=False)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # developer / company
    full_name = Column(String)
    skills_data = Column(JSON, nullable=True)  # Сюда сохраняем отчет от ИИ
    company_name = Column(String, nullable=True)
    website = Column(String, nullable=True)
    github_username = Column(String, nullable=True)
    github_stats = Column(JSON, nullable=True)
    bio = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    projects = Column(JSON, nullable=True)
    job_postings = Column(JSON, nullable=True)
    last_test_at = Column(DateTime, nullable=True)
    attempts_used = Column(Integer, default=0, nullable=False)
    blocked_until = Column(DateTime, nullable=True)
    test_status = Column(String, default="none")
    pending_skills_data = Column(JSON, nullable=True)
    interview_video_url = Column(String, nullable=True)



class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("users.id"))
    developer_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    text = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)



async def get_db():
    async with SessionLocal() as db:
        yield db


def verify_password(plain: str, hashed: str) -> bool:
    # pwdlib сам разберется с форматом и вернет True/False
    return password_hash.verify(plain, hashed)


def get_password_hash(password: str) -> str:
    # pwdlib автоматически генерирует соль и делает хэш
    return password_hash.hash(password)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



async def get_current_user_optional(token: Optional[str] = Depends(oauth2_scheme_optional), db: AsyncSession = Depends(get_db)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
    except JWTError:
        return None

    result = await db.execute(select(UserDB).where(UserDB.email == email))
    return result.scalars().first()

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(UserDB).where(UserDB.email == email))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user
