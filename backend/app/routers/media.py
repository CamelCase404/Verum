import os
import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from ..interview_store import get as get_interview

router = APIRouter(prefix="/api/media", tags=["media"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_VIDEO_BYTES = 500 * 1024 * 1024  # 500 MB


@router.post("/upload")
async def upload_video(interview_id: str, file: UploadFile = File(...)):
    # 1. Валидация ID
    if not interview_id or not interview_id.strip():
        raise HTTPException(400, "interview_id is required")

    # 2. Валидация content-type
    if not file.content_type or not file.content_type.startswith(("video/", "audio/")):
        raise HTTPException(400, "Разрешены только видео или аудио файлы")

    # 3. Интервью должно существовать
    it = await get_interview(interview_id)
    if not it:
        raise HTTPException(404, "Interview not found")

    # 4. Принимаем видео только для завершённых интервью
    if not it.finished:
        raise HTTPException(409, "Interview is not finished yet")

    # 5. Если интервью отклонено — файл не нужен
    if it.rejected:
        return {"status": "ignored", "message": "Interview rejected. Video discarded."}

    # 6. Уникальное имя
    ext = (file.filename.rsplit(".", 1)[-1] if file.filename and "." in file.filename else "webm")
    filename = f"{interview_id}_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = UPLOAD_DIR / filename

    # 7. Запись с контролем размера
    total = 0
    try:
        with open(filepath, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                total += len(chunk)
                if total > MAX_VIDEO_BYTES:
                    buffer.close()
                    try:
                        os.remove(filepath)
                    except Exception:
                        pass
                    raise HTTPException(413, f"Файл слишком большой (максимум {MAX_VIDEO_BYTES // (1024 * 1024)} МБ)")
                buffer.write(chunk)
    except HTTPException:
        raise
    except Exception as e:
        try:
            os.remove(filepath)
        except Exception:
            pass
        raise HTTPException(500, f"Ошибка сохранения: {e}")

    # 8. Race condition: интервью могло стать rejected, пока писали
    it_after = await get_interview(interview_id)
    if it_after and it_after.rejected:
        try:
            os.remove(filepath)
            print(f"  🗑️ Видео удалено после записи (интервью стало Reject): {filepath}")
        except Exception as e:
            print(f"  ⚠️ Не удалось удалить видео {filepath}: {e}")
        return {"status": "ignored", "message": "Interview became rejected during upload."}

    return {"status": "ok", "filename": filename, "path": str(filepath), "size": total}
