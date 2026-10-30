import os
import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from ..interview_store import get as get_interview

router = APIRouter(prefix="/api/media", tags=["media"])

# Папка для хранения (создастся автоматически)
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_video(interview_id: str, file: UploadFile = File(...)):
    # Проверяем, что это видео/аудио
    if not file.content_type.startswith(("video/", "audio/")):
        raise HTTPException(400, "Разрешены только видео или аудио файлы")

    # ПРОВЕРКА: если интервью уже завершено и отклонено (Reject), видео не нужно
    it = await get_interview(interview_id)
    if it and it.finished and it.rejected:
        # Если интервью отклонено, мы отвечаем 200 OK, чтобы фронтенд не паниковал, 
        # но НЕ сохраняем файл.
        return {"status": "ignored", "message": "Interview rejected. Video discarded."}

    # Генерируем уникальное имя
    ext = file.filename.split(".")[-1] if file.filename else "webm"
    filename = f"{interview_id}_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = UPLOAD_DIR / filename

    # Сохраняем файл кусками, чтобы не забить память
    try:
        with open(filepath, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):  # по 1 МБ
                buffer.write(chunk)
    except Exception as e:
        raise HTTPException(500, f"Ошибка сохранения: {e}")

    # ПОВТОРНАЯ ПРОВЕРКА после записи: интервью могло стать rejected,
    # пока мы писали файл (race condition между media.py и save_skills)
    it_after = await get_interview(interview_id)
    if it_after and it_after.rejected:
        try:
            os.remove(filepath)
            print(f"  🗑️ Видео удалено после записи (интервью стало Reject): {filepath}")
        except Exception as e:
            print(f"  ⚠️ Не удалось удалить видео {filepath}: {e}")
        return {"status": "ignored", "message": "Interview became rejected during upload."}

    return {"status": "ok", "filename": filename, "path": str(filepath)}
