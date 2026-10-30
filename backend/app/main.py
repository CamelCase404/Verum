from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from .config import settings
from .routers import auth, auth_github, catalog, github, interview, media, chat, company, admin

app = FastAPI(title="Verum API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    same_site="lax",
    https_only=False,
)

app.include_router(media.router)
app.include_router(catalog.router)
app.include_router(interview.router)
app.include_router(auth.router)
app.include_router(github.router)
app.include_router(auth_github.router)
app.include_router(chat.router)
app.include_router(company.router)
app.include_router(admin.router)


import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/api/health")
def health():
    return {"ok": True}


from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

@app.exception_handler(Exception)
async def handle_general_exception(request: Request, exc: Exception):
    # Логируем ошибку для отладки
    print(f"Unhandled error: {exc}")
    # Возвращаем ответ с заголовком CORS, чтобы браузер не блокировал его
    return JSONResponse(
        status_code=HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal Server Error", "error": str(exc)},
        headers={"access-control-allow-origin": "*"}
    )
