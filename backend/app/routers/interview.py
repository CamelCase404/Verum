from fastapi import APIRouter
from .interview_flow import router_flow
from .interview_analytics import router_analytics

# Главная точка сборки модуля интервью, которую ожидает увидеть main.py
router = APIRouter(prefix="/api/interview", tags=["interview"])

router.include_router(router_flow)
router.include_router(router_analytics)
