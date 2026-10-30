from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ..auth import get_current_user, UserDB
from ..gigachat_client import ask_text
import json, re

router = APIRouter(prefix="/api/company", tags=["company"])

class ParseJobReq(BaseModel):
    description: str

@router.post("/parse-job")
async def parse_job(req: ParseJobReq, user: UserDB = Depends(get_current_user)):
    if user.role != "company":
        raise HTTPException(status_code=403, detail="Только для компаний")
    
    sys_prompt = """Ты — опытный HR-аналитик. Твоя задача — извлечь параметры вакансии из текста.
Верни ответ СТРОГО в формате JSON (без markdown):
{
  "title": "Краткое название (например, 'Senior React Developer')",
  "stack": "Одно из: Frontend, Backend, Fullstack, Mobile, DevOps, Data / ML",
  "level": "Одно из: Junior, Middle, Senior",
  "suggested_salary": "Примерная рыночная зарплата в рублях (только число, например 200000)"
}"""

    prompt = f"Текст вакансии:\n{req.description}"
    
    try:
        raw = await ask_text(sys_prompt, prompt)
        # Очистка от возможных markdown-тегов
        raw = raw.replace("```json", "").replace("```", "").strip()
        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1:
            raw = raw[start:end+1]
            
        data = json.loads(raw)
        return {
            "title": data.get("title", "Разработчик"),
            "stack": data.get("stack", "Frontend"),
            "level": data.get("level", "Middle"),
            "suggested_salary": data.get("suggested_salary", "")
        }
    except Exception as e:
        # Если ИИ ошибся, отдаем дефолтные значения
        return {"title": "Разработчик", "stack": "Frontend", "level": "Middle", "suggested_salary": ""}
