from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from .config import settings
from .routers import auth, auth_github, catalog, github, interview, media

app = FastAPI(title="Verum API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    SessionMiddleware,
    secret_key="verum-super-secret-key-change-in-prod",  # Любая случайная строка
    same_site="lax",
    https_only=False,  # Важно: False для локальной разработки (http)
)

app.include_router(media.router)
app.include_router(catalog.router)
app.include_router(interview.router)
app.include_router(auth.router)
app.include_router(github.router)
app.include_router(auth_github.router)


@app.get("/api/health")
def health():
    return {"ok": True}
