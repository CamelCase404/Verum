import os
import re
import asyncio
import httpx
from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..config import settings
from ..auth import get_db, UserDB, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_API_URL = "https://api.github.com"


@router.get("/github")
async def github_login(request: Request):
    import secrets
    role = request.query_params.get("role", "developer")
    state = secrets.token_urlsafe(16)
    request.session[f"oauth_role_{state}"] = role

    client_id = os.getenv("GITHUB_CLIENT_ID", "")
    redirect_uri = os.getenv("GITHUB_CALLBACK_URL", f"{settings.BACKEND_URL}/api/auth/github/callback")

    if not client_id:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=no_client_id")

    url = (
        f"{GITHUB_AUTHORIZE_URL}"
        f"?client_id={client_id}"
        f"&redirect_uri={redirect_uri}"
        f"&scope=read:user+user:email"
        f"&state={state}"
    )
    return RedirectResponse(url)


@router.get("/github/callback")
async def github_callback(
    request: Request,
    code: str | None = None,
    state: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    if not code:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=no_code")

    role = request.session.pop(f"oauth_role_{state}", "developer") if state else "developer"
    redirect_uri = os.getenv("GITHUB_CALLBACK_URL", f"{settings.BACKEND_URL}/api/auth/github/callback")
    client_id = os.getenv("GITHUB_CLIENT_ID", "")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET", "")

    # ─── 1. Обмен code → access_token (с retry и длинным timeout) ───
    token_data = None
    last_error = None
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(
                    GITHUB_TOKEN_URL,
                    data={
                        "client_id": client_id,
                        "client_secret": client_secret,
                        "code": code,
                        "redirect_uri": redirect_uri,
                    },
                    headers={"Accept": "application/json"},
                )
                if resp.status_code == 200:
                    token_data = resp.json()
                    break
                last_error = f"HTTP {resp.status_code}: {resp.text[:200]}"
        except Exception as e:
            last_error = str(e)
            if attempt < 2:
                await asyncio.sleep(2 ** attempt)

    if not token_data or "access_token" not in token_data:
        print(f"OAuth token error: {last_error}")
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=token_exchange")

    access_token = token_data["access_token"]

    # ─── 2. Получаем профиль, репозитории, языки ───
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github+json",
            "User-Agent": "Verum-App",
        }

        resp = await client.get(f"{GITHUB_API_URL}/user", headers=headers)
        if resp.status_code != 200:
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=github_user")
        user_data = resp.json()

        email = user_data.get("email")
        if not email:
            emails_resp = await client.get(f"{GITHUB_API_URL}/user/emails", headers=headers)
            emails = emails_resp.json()
            email = emails[0]["email"] if isinstance(emails, list) and emails else f"{user_data['login']}@github.local"

        repos_resp = await client.get(
            f"{GITHUB_API_URL}/users/{user_data['login']}/repos?per_page=100&sort=updated",
            headers=headers,
        )
        repos = repos_resp.json() if repos_resp.status_code == 200 else []

        languages: dict[str, int] = {}
        total_stars = 0
        projects: list[dict] = []

        async def get_commit_count(repo_url: str) -> int:
            try:
                c_resp = await client.get(f"{repo_url}/commits?per_page=1", headers=headers)
                if c_resp.status_code == 200:
                    link = c_resp.headers.get("Link", "")
                    if 'rel="last"' in link:
                        match = re.search(r'page=(\d+)>; rel="last"', link)
                        if match:
                            return int(match.group(1))
                    c_data = c_resp.json()
                    return len(c_data) if isinstance(c_data, list) else 0
            except Exception:
                pass
            return 0

        if isinstance(repos, list):
            for i, repo in enumerate(repos):
                total_stars += repo.get("stargazers_count", 0)
                lang_resp = await client.get(repo["languages_url"], headers=headers)
                if lang_resp.status_code == 200:
                    repo_langs = lang_resp.json()
                    for l, b in repo_langs.items():
                        languages[l] = languages.get(l, 0) + b

                commits = 0
                if i < 20 and not repo.get("fork"):
                    commits = await get_commit_count(repo["url"])

                projects.append({
                    "name": repo["name"],
                    "stars": repo["stargazers_count"],
                    "forks": repo["forks_count"],
                    "description": repo["description"],
                    "language": repo.get("language"),
                    "url": repo["html_url"],
                    "commits": commits,
                })

        total_bytes = sum(languages.values())
        lang_stats = (
            [
                {"name": k, "percent": round((v / total_bytes) * 100)}
                for k, v in sorted(languages.items(), key=lambda x: x[1], reverse=True)
            ]
            if total_bytes > 0
            else []
        )

        stats = {
            "username": user_data["login"],
            "public_repos": user_data.get("public_repos", 0),
            "followers": user_data.get("followers", 0),
            "total_stars": total_stars,
            "languages": lang_stats,
            "projects": projects,
        }

    # ─── 3. Сохраняем пользователя ───
    result = await db.execute(select(UserDB).where(UserDB.email == email))
    user = result.scalars().first()
    if not user:
        user = UserDB(
            email=email,
            hashed_password="oauth_no_password",
            role=role,
            full_name=user_data.get("name") or user_data.get("login"),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    user.github_username = user_data["login"]
    user.github_stats = stats
    await db.commit()

    # ─── 4. Возвращаем на фронт с токеном ───
    access_jwt = create_access_token({"sub": user.email})
    return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/callback?token={access_jwt}")
