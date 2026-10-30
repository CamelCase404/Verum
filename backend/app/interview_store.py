from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from typing import Optional

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, relationship

from .schemas import Level

import os
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://verum_user:verum_password_secure_change_me@db:5432/verum_db")
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
engine = create_async_engine(DATABASE_URL, echo=False)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


class DBInterview(Base):
    __tablename__ = "interviews"
    id = Column(String, primary_key=True, index=True)
    level = Column(String)
    stack_id = Column(String)
    language_id = Column(String)
    stage = Column(Integer, default=0)
    finished = Column(Boolean, default=False)
    rejected = Column(Boolean, default=False)
    reject_reason = Column(String, nullable=True)
    turns = relationship(
        "DBTurn",
        back_populates="interview",
        cascade="all, delete-orphan",
        order_by="DBTurn.id",
    )


class DBTurn(Base):
    __tablename__ = "turns"
    id = Column(Integer, primary_key=True, autoincrement=True)
    interview_id = Column(String, ForeignKey("interviews.id"))
    role = Column(String)
    content = Column(Text)
    seconds_spent = Column(Integer, default=0)
    interview = relationship("DBInterview", back_populates="turns")



@dataclass
class TurnData:
    role: str
    content: str
    seconds_spent: int = 0


@dataclass
class Interview:
    id: str
    level: Level
    stack_id: str
    language_id: str
    stage: int = 0
    finished: bool = False
    rejected: bool = False
    reject_reason: Optional[str] = None
    turns: list[TurnData] = field(default_factory=list)


async def create(level: Level, stack_id: str, language_id: str) -> Interview:
    async with SessionLocal() as db:
        new_it = DBInterview(
            id=str(uuid.uuid4()), level=level, stack_id=stack_id, language_id=language_id
        )
        db.add(new_it)
        await db.commit()
        await db.refresh(new_it)
        interview_id = new_it.id
    return await get(interview_id)


async def get(interview_id: str) -> Optional[Interview]:
    from sqlalchemy import select
    async with SessionLocal() as db:
        result = await db.execute(select(DBInterview).where(DBInterview.id == interview_id))
        db_it = result.scalars().first()
        if not db_it:
            return None

        # Загружаем turns
        turns_result = await db.execute(select(DBTurn).where(DBTurn.interview_id == interview_id).order_by(DBTurn.id))
        turns_db = turns_result.scalars().all()

        turns = [
            TurnData(role=t.role, content=t.content, seconds_spent=t.seconds_spent)
            for t in turns_db
        ]
        return Interview(
            id=db_it.id,
            level=db_it.level,
            stack_id=db_it.stack_id,
            language_id=db_it.language_id,
            stage=db_it.stage,
            finished=db_it.finished,
            rejected=db_it.rejected,
            reject_reason=db_it.reject_reason,
            turns=turns,
        )


async def save(interview: Interview):
    from sqlalchemy import select, delete
    async with SessionLocal() as db:
        result = await db.execute(select(DBInterview).where(DBInterview.id == interview.id))
        db_it = result.scalars().first()
        if db_it:
            db_it.stage = interview.stage
            db_it.finished = interview.finished
            db_it.rejected = interview.rejected
            db_it.reject_reason = interview.reject_reason

            await db.execute(delete(DBTurn).where(DBTurn.interview_id == interview.id))
            for t in interview.turns:
                db.add(
                    DBTurn(
                        interview_id=interview.id,
                        role=t.role,
                        content=t.content,
                        seconds_spent=t.seconds_spent,
                    )
                )
            await db.commit()
