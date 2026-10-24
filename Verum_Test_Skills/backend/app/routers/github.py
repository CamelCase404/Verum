import os

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/github", tags=["github"])


class GithubRequest(BaseModel):
    username: str


@router.post("/analyze")
async def analyze_github(data: GithubRequest):
    username = data.username.strip().replace("https://github.com/", "").strip("/")
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")

    # Базовые заголовки (User-Agent обязателен для GitHub API)
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "Verum-App"}

    # Безопасно добавляем токен (игнорируем, если в нём есть русские буквы)
    github_token = os.getenv("GITHUB_TOKEN", "").strip()
    if github_token:
        try:
            github_token.encode("ascii")  # Проверка на ASCII
            headers["Authorization"] = f"Bearer {github_token}"
        except UnicodeEncodeError:
            print(
                "⚠️ Внимание: GITHUB_TOKEN содержит недопустимые символы и был проигнорирован."
            )

    async with httpx.AsyncClient(headers=headers, timeout=15.0) as client:
        user_resp = await client.get(f"https://api.github.com/users/{username}")
        if user_resp.status_code == 404:
            raise HTTPException(status_code=404, detail="GitHub user not found")
        user = user_resp.json()

        repos_resp = await client.get(
            f"https://api.github.com/users/{username}/repos",
            params={"per_page": 100, "sort": "updated"},
        )
        repos = repos_resp.json() if repos_resp.status_code == 200 else []

    languages: dict[str, int] = {}
    total_stars = 0
    projects = []

    if isinstance(repos, list):
        for repo in repos[:10]:
            if repo.get("fork"):
                continue
            total_stars += repo.get("stargazers_count", 0)
            lang = repo.get("language")
            if lang:
                languages[lang] = languages.get(lang, 0) + 1
            projects.append(
                {
                    "name": repo.get("name"),
                    "description": repo.get("description"),
                    "url": repo.get("html_url"),
                    "language": lang,
                    "stars": repo.get("stargazers_count", 0),
                    "updated_at": repo.get("updated_at"),
                }
            )

    return {
        "username": username,
        "avatar_url": user.get("avatar_url"),
        "public_repos": user.get("public_repos", 0),
        "followers": user.get("followers", 0),
        "total_stars": total_stars,
        "languages": sorted(languages.items(), key=lambda x: x[1], reverse=True),
        "projects": projects,
    }
