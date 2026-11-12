from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth import (
    get_current_user, get_db, UserDB,
    Subscription, Invoice, UsageLog, utcnow_naive,
)
from ..config import settings
from ..schemas import (
    PlanInfo, PlansResponse, SubscribeReq, TopupReq,
    UsageItem, UsageResponse,
)

router = APIRouter(prefix="/api/billing", tags=["billing"])


@router.get("/plans", response_model=PlansResponse)
async def get_plans():
    plans = []
    for pid, info in settings.PLANS.items():
        plans.append(PlanInfo(
            id=pid,
            name=info["name"],
            price_month=info["price_month"],
            verifications_per_month=info["verifications_per_month"],
            tokens_per_month=info.get("tokens_per_month"),
            features=info.get("features", []),
        ))
    return PlansResponse(plans=plans)


@router.post("/subscribe")
async def subscribe(
    data: SubscribeReq,
    user: UserDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if user.role != "company":
        raise HTTPException(403, "Только для компаний")
    if data.plan not in settings.PLANS:
        raise HTTPException(400, "Неизвестный тариф")
    
    # ВНИМАНИЕ: В боевом режиме здесь должна быть проверка оплаты через ЮKassa!
    # Сейчас мы эмулируем успешную оплату. Если ENFORCE_LIMITS=True, то без реального чека
    # мы блокируем выдачу тарифа (чтобы нельзя было накликать себе Enterprise бесплатно).
    if settings.ENFORCE_LIMITS:
        raise HTTPException(402, "Оплата временно недоступна. Подключите ЮKassa.")

    await db.execute(select(UserDB).where(UserDB.id == user.id).with_for_update())
    info = settings.PLANS[data.plan]
    now = utcnow_naive()

    # Закрываем старые активные подписки
    old = await db.execute(
        select(Subscription).where(
            Subscription.company_id == user.id,
            Subscription.status == "active",
        )
    )
    for s in old.scalars().all():
        s.status = "expired"

    user.plan = data.plan
    user.subscription_until = now + timedelta(days=30)
    user.verifications_left = (
        None if info["verifications_per_month"] is None
        else info["verifications_per_month"]
    )
    user.tokens = (
        None if info.get("tokens_per_month") is None
        else info.get("tokens_per_month")
    )

    db.add(Subscription(
        company_id=user.id, plan=data.plan,
        expires_at=user.subscription_until, status="active",
    ))
    db.add(Invoice(
        company_id=user.id, amount=info["price_month"],
        description=f"Подписка {info['name']} на 30 дней",
        status="paid", paid_at=now,
    ))

    await db.commit()
    return {
        "status": "ok",
        "plan": data.plan,
        "verifications_left": user.verifications_left,
        "tokens": user.tokens,
        "subscription_until": user.subscription_until.isoformat() if user.subscription_until else None,
    }


@router.post("/topup")
async def topup(
    data: TopupReq,
    user: UserDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if user.role != "company":
        raise HTTPException(403, "Только для компаний")
    if data.verifications <= 0 and data.tokens <= 0:
        raise HTTPException(400, "Укажите verifications и/или tokens > 0")
    if user.plan == "enterprise" and user.verifications_left is None:
        return {"status": "ok", "message": "У вас безлимит"}

    await db.execute(select(UserDB).where(UserDB.id == user.id).with_for_update())
    info = settings.PLANS.get(user.plan or "start", settings.PLANS["start"])
    unit = 5000
    total = data.amount or (data.verifications * unit)
    now = utcnow_naive()

    if data.verifications > 0:
        user.verifications_left = (user.verifications_left or 0) + data.verifications
    if data.tokens > 0:
        user.tokens = (user.tokens or 0) + data.tokens
    db.add(Invoice(
        company_id=user.id, amount=total,
        description=f"Пакет +{data.verifications} верификаций",
        status="paid", paid_at=now,
    ))
    db.add(UsageLog(
        company_id=user.id, action="topup",
        cost=-total, candidate_id=None, interview_id=None,
    ))
    await db.commit()
    return {"status": "ok", "verifications_left": user.verifications_left, "tokens": user.tokens, "amount": total}


@router.get("/usage", response_model=UsageResponse)
async def usage(
    user: UserDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if user.role != "company":
        raise HTTPException(403, "Только для компаний")

    res = await db.execute(
        select(UsageLog)
        .where(UsageLog.company_id == user.id)
        .order_by(UsageLog.created_at.desc())
        .limit(100)
    )
    logs = res.scalars().all()

    total_res = await db.execute(
        select(func.coalesce(func.sum(UsageLog.cost), 0))
        .where(UsageLog.company_id == user.id, UsageLog.cost > 0)
    )
    total_spent = total_res.scalar() or 0

    return UsageResponse(
        items=[UsageItem(
            id=l.id, action=l.action, cost=l.cost,
            candidate_id=l.candidate_id, interview_id=l.interview_id,
            created_at=l.created_at,
        ) for l in logs],
        total_spent=total_spent,
        verifications_left=user.verifications_left,
        plan=user.plan,
        subscription_until=user.subscription_until,
    )
