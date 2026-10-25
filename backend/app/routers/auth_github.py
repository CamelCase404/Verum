import os
import httpx
from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])

oauth = OAuth()
oauth.register(
    name="github",
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url="https://github.com/login/oauth/access_token",
    authorize_url="https://github.com/login/oauth/authorize",
    api_base_url="https://api.github.com/",
    client_kwargs={
        "scope": "read:user user:email",
        "timeout": 30.0,  # <-- увеличили таймаут
    },
)

@router.get("/github")
async def github_login(request: Request):
    redirect_uri = request.url_for("github_callback")
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get("/github/callback", name="github_callback")
async def github_callback(request: Request):
    token = await oauth.github.authorize_access_token(request)

    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {
            "Authorization": f"token {token['access_token']}",
            "Accept": "application/vnd.github+json",
            "User-Agent": "Verum-App",
        }
        resp = await client.get("https://api.github.com/user", headers=headers)
        if resp.status_code != 200:
            return RedirectResponse(url=f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/login?error=github_user")
        user_data = resp.json()

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    name = user_data.get("name") or user_data.get("login")
    return RedirectResponse(
        url=f"{frontend_url}/auth/callback?username={user_data['login']}&name={name}"
    )
