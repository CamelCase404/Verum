import os

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))


class Settings:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-prod")

    GIGACHAT_CREDENTIALS: str = os.getenv("GIGACHAT_CREDENTIALS", "")
    GIGACHAT_SCOPE: str = os.getenv("GIGACHAT_SCOPE", "GIGACHAT_API_PERS")
    GIGACHAT_BASE_URL: str = os.getenv(
        "GIGACHAT_BASE_URL", "https://gigachat.devices.sberbank.ru/api/v1"
    )
    GIGACHAT_MODEL: str = os.getenv("GIGACHAT_MODEL", "GigaChat")
    BACKEND_URL: str = os.getenv("BACKEND_URL", "https://api.verumskills.ru")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "https://verumskills.ru")

    GIGACHAT_VERIFY_SSL: bool = (
        os.getenv("GIGACHAT_VERIFY_SSL", "false").lower() == "true"
    )

    # Secure-cookie для OAuth-сессии. В проде за HTTPS → SECURE_COOKIES=true в .env
    SECURE_COOKIES: bool = (
        os.getenv("SECURE_COOKIES", "false").lower() == "true"
    )

    # SaaS-модель (Q3 = чат с нейросетью)
    # ENFORCE_LIMITS=false на время миграции: старые компании не отваливаются,
    # если verifications_left=0. Включать, когда все компании на подписке.
    ENFORCE_LIMITS: bool = (
        os.getenv("ENFORCE_LIMITS", "false").lower() == "true"
    )

    PLANS: dict = {
        "start": {
            "name": "Start",
            "price_month": 30000,
            "verifications_per_month": 20,
            "tokens_per_month": 3000,
            "pay_per_test": 1500,
            "features": [
                "20 тестов для внешних кандидатов",
                "3000 токенов (хватит на 3 Senior, 5 Middle, 10 Junior)",
                "Базовый античит-контроль",
                "Доступ к базе верифицированных кадров",
            ],
        },
        "pro": {
            "name": "Pro",
            "price_month": 75000,
            "verifications_per_month": 60,
            "tokens_per_month": 10000,
            "pay_per_test": 1500,
            "features": [
                "60 тестов для внешних кандидатов",
                "10 000 токенов для доступа к базе",
                "Приоритетная поддержка",
            ],
        },
        "enterprise": {
            "name": "Enterprise",
            "price_month": 200000,
            "verifications_per_month": None,
            "tokens_per_month": None,
            "pay_per_test": None,
            "features": [
                "Безлимитные тесты",
                "Безлимитный доступ к базе",
                "Выделенный менеджер",
            ],
        },
    }

    # портал verum (5174) + интервью (5173) + запас 3000
    CORS_ORIGINS: list[str] = [
        o.strip()
        for o in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://localhost:5173,http://localhost:5174,"
            "http://127.0.0.1:3000,http://127.0.0.1:5173,http://127.0.0.1:5174",
        ).split(",")
        if o.strip()
    ]


settings = Settings()
