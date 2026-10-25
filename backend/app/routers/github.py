import os
import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

router = APIRouter(prefix="/api/github", tags=["github"])

class GithubRequest(BaseModel):
    username: str

def get_headers():
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "Verum-App"
    }
    token = os.getenv("GITHUB_TOKEN", "").strip()
    if token and token.startswith(("ghp_", "github_pat_")):
        headers["Authorization"] = f"Bearer {token}"
    return headers


@router.post("/analyze")
async def analyze_github(data: GithubRequest):
    username = data.username.strip().replace("https://github.com/", "").strip("/")
    if not username:
        raise HTTPException(400, "Username is required")

    async with httpx.AsyncClient(headers=get_headers(), timeout=30.0) as client:
        user_resp = await client.get(f"https://api.github.com/users/{username}")
        if user_resp.status_code == 404:
            raise HTTPException(404, "GitHub user not found")
        if user_resp.status_code != 200:
            raise HTTPException(400, "GitHub API error")
        user = user_resp.json()

        repos_resp = await client.get(
            f"https://api.github.com/users/{username}/repos",
            params={"per_page": 100, "sort": "updated"},
        )
        repos = repos_resp.json() if repos_resp.status_code == 200 else []
        if not isinstance(repos, list):
            repos = []

        # Оставляем только не-форки, максимум 15
        top_repos = [r for r in repos if not r.get("fork")][:15]

        # ДЛЯ КАЖДОГО РЕПО ЗАПРАШИВАЕМ ЯЗЫКИ И КОММИТЫ
        async def fetch_repo_details(repo):
            owner = repo["owner"]["login"]
            name = repo["name"]
            repo_url = repo["html_url"]
            default_branch = repo.get("default_branch", "main")

            try:
                lang_resp = await client.get(f"https://api.github.com/repos/{owner}/{name}/languages")
                languages = lang_resp.json() if lang_resp.status_code == 200 else {}
            except Exception:
                languages = {}

            # Коммиты: запрашиваем только 1 штуку, чтобы узнать total из Link заголовка
            commits_count = 0
            try:
                commits_resp = await client.get(
                    f"https://api.github.com/repos/{owner}/{name}/commits",
                    params={"per_page": 1, "sha": default_branch},
                )
                if commits_resp.status_code == 200:
                    link = commits_resp.headers.get("link", "")
                    if 'rel="last"' in link:
                        try:
                            # Пример: <https://api.github.com/...?page=42>; rel="last"
                            last = link.split('rel="last"')[0]
                            page_num = last.split("page=")[-1].split(">")[0].strip()
                            commits_count = int(page_num)
                        except Exception:
                            commits_count = 1
                    else:
                        commits_count = len(commits_resp.json()) if isinstance(commits_resp.json(), list) else 0
            except Exception:
                commits_count = 0

            return {
                "name": name,
                "description": repo.get("description"),
                "url": repo_url,
                "stars": repo.get("stargazers_count", 0),
                "forks": repo.get("forks_count", 0),
                "language": repo.get("language"),
                "updated_at": repo.get("updated_at"),
                "languages": languages,
                "commits": commits_count,
            }

        # Параллельно, но с ограничением (чтобы не спамить)
        projects = []
        for repo in top_repos:
            projects.append(await fetch_repo_details(repo))

    # Агрегируем языки
    total_langs: dict[str, int] = {}
    total_stars = 0
    for p in projects:
        total_stars += p["stars"]
        for lang, bytes_count in p["languages"].items():
            total_langs[lang] = total_langs.get(lang, 0) + bytes_count

    total_bytes = sum(total_langs.values()) or 1
    lang_percentages = [
        {"name": lang, "percent": round((b / total_bytes) * 100, 1), "bytes": b}
        for lang, b in sorted(total_langs.items(), key=lambda x: x[1], reverse=True)
    ]

    return {
        "username": username,
        "avatar_url": user.get("avatar_url"),
        "public_repos": user.get("public_repos", 0),
        "followers": user.get("followers", 0),
        "total_stars": total_stars,
        "languages": lang_percentages,
        "projects": projects,
    }
