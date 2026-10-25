import os
import re
import httpx
from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from ..auth import get_db, UserDB, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

oauth = OAuth()
oauth.register(
    name="github",
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url="https://github.com/login/oauth/access_token",
    authorize_url="https://github.com/login/oauth/authorize",
    api_base_url="https://api.github.com/",
    client_kwargs={"scope": "read:user user:email", "timeout": 30.0},
)

@router.get("/github")
async def github_login(request: Request):
    role = request.query_params.get("role", "developer")
    request.session["oauth_role"] = role
    redirect_uri = request.url_for("github_callback")
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get("/github/callback", name="github_callback")
async def github_callback(request: Request, db: Session = Depends(get_db)):
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

        email = user_data.get("email")
        if not email:
            emails_resp = await client.get("https://api.github.com/user/emails", headers=headers)
            emails = emails_resp.json()
            email = emails[0]["email"] if isinstance(emails, list) and emails else f"{user_data['login']}@github.local"

        repos_resp = await client.get(f"https://api.github.com/users/{user_data['login']}/repos?per_page=100&sort=updated", headers=headers)
        repos = repos_resp.json() if repos_resp.status_code == 200 else []
        
        languages = {}
        total_stars = 0
        projects = []
        
        # Функция для получения количества коммитов
        async def get_commit_count(repo_url):
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
                
                # СЧИТАЕМ БАЙТЫ КОДА ДЛЯ ЯЗЫКОВ (как на GitHub)
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
                    "commits": commits
                })
        
        # Высчитываем проценты на основе байтов
        total_bytes = sum(languages.values())
        lang_stats = [{"name": k, "percent": round((v / total_bytes) * 100)} for k, v in sorted(languages.items(), key=lambda x: x[1], reverse=True)] if total_bytes > 0 else []

        stats = {
            "username": user_data["login"],
            "public_repos": user_data.get("public_repos", 0),
            "followers": user_data.get("followers", 0),
            "total_stars": total_stars,
            "languages": lang_stats,
            "projects": projects
        }

    role = request.session.pop("oauth_role", "developer")
    user = db.query(UserDB).filter(UserDB.email == email).first()
    
    if not user:
        user = UserDB(email=email, hashed_password="oauth_no_password", role=role, full_name=user_data.get("name") or user_data.get("login"))
        db.add(user)
        db.commit()
        db.refresh(user)
    
    user.github_username = user_data["login"]
    user.github_stats = stats
    db.commit()

    access_token = create_access_token({"sub": user.email})
    return RedirectResponse(url=f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/auth/callback?token={access_token}")
