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
    GIGACHAT_VERIFY_SSL: bool = (
        os.getenv("GIGACHAT_VERIFY_SSL", "false").lower() == "true"
    )

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
