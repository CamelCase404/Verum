import os
import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from sqlalchemy import select

from ..auth import SessionLocal, UserDB
from ..interview_store import get as get_interview

router = APIRouter(prefix="/api/media", tags=["media"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_VIDEO_BYTES = 500 * 1024 * 1024


@router.post("/upload")
async def upload_video(interview_id: str, file: UploadFile = File(...)):
    if not interview_id or not interview_id.strip():
        raise HTTPException(400, "interview_id is required")

    if not file.content_type or not file.content_type.startswith(("video/", "audio/")):
        raise HTTPException(400, "Разрешены только видео или аудио файлы")

    it = await get_interview(interview_id)
    if not it:
        raise HTTPException(404, "Interview not found")

    if it.rejected:
        return {"status": "ignored", "message": "Interview rejected. Video discarded."}

    ext = file.filename.rsplit(".", 1)[-1] if file.filename and "." in file.filename else "webm"
    filename = f"{interview_id}_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = UPLOAD_DIR / filename

    total = 0
    try:
        with open(filepath, "wb") as buffer:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break
                total += len(chunk)
                if total > MAX_VIDEO_BYTES:
                    buffer.close()
                    try:
                        os.remove(filepath)
                    except Exception:
                        pass
                    raise HTTPException(413, "Файл слишком большой (максимум 500 МБ)")
                buffer.write(chunk)
    except HTTPException:
        raise
    except Exception as e:
        try:
            os.remove(filepath)
        except Exception:
            pass
        raise HTTPException(500, f"Ошибка сохранения: {e}")

    # Race condition: интервью могло стать rejected, пока писали
    it_after = await get_interview(interview_id)
    if it_after and it_after.rejected:
        try:
            os.remove(filepath)
        except Exception:
            pass
        return {"status": "ignored", "message": "Interview became rejected during upload."}

    # ✅ Сразу привязываем файл к пользователю через interview.user_id
    if it_after and it_after.user_id:
        try:
            async with SessionLocal() as db:
                result = await db.execute(select(UserDB).where(UserDB.id == it_after.user_id))
                user = result.scalars().first()
                if user:
                    user.interview_video_url = f"/uploads/{filename}"
                    await db.commit()
                    print(f"  📎 media.upload: привязал видео к user_id={user.id}: {user.interview_video_url}")
                else:
                    print(f"  ⚠️ media.upload: user_id={it_after.user_id} не найден")
        except Exception as e:
            print(f"  ⚠️ media.upload: не удалось обновить interview_video_url: {e}")

    return {"status": "ok", "filename": filename, "path": str(filepath), "size": total}
