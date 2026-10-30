from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List
import os
import shutil
import uuid

from ..config import settings
from ..auth import get_db, get_current_user, UserDB, Conversation, Message

router = APIRouter(prefix="/api/chat", tags=["chat"])

class StartChatReq(BaseModel):
    target_user_id: int

class SendMessageReq(BaseModel):
    text: str = ""
    image_url: str | None = None

@router.post("/start")
async def start_chat(req: StartChatReq, user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    company_id = user.id if user.role == "company" else req.target_user_id
    developer_id = user.id if user.role == "developer" else req.target_user_id
    
    res_conv = await db.execute(select(Conversation).where(
        Conversation.company_id == company_id,
        Conversation.developer_id == developer_id
    ))
    conv = res_conv.scalars().first()
    
    if not conv:
        conv = Conversation(company_id=company_id, developer_id=developer_id)
        db.add(conv)
        await db.commit()
        await db.refresh(conv)
    
    return {"conversation_id": conv.id}

@router.get("/conversations")
async def get_conversations(user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if user.role == "company":
        result = await db.execute(select(Conversation).where(Conversation.company_id == user.id))
        convs = result.scalars().all()
    else:
        result = await db.execute(select(Conversation).where(Conversation.developer_id == user.id))
        convs = result.scalars().all()
    
    result = []
    for c in convs:
        other_id = c.developer_id if user.role == "company" else c.company_id
        res_user = await db.execute(select(UserDB).where(UserDB.id == other_id))
        other_user = res_user.scalars().first()
        
        res_msg = await db.execute(select(Message).where(Message.conversation_id == c.id).order_by(Message.created_at.desc()))
        last_msg = res_msg.scalars().first()
        res_unread = await db.execute(select(Message).where(
            Message.conversation_id == c.id, 
            Message.is_read == False, 
            Message.sender_id != user.id
        ))
        unread_count = len(res_unread.scalars().all())
        
        # Определяем текст последнего сообщения (текст или "Фото")
        last_text = "Нет сообщений"
        if last_msg:
            last_text = last_msg.text if last_msg.text else "📷 Фото"

        result.append({
            "id": c.id,
            "other_id": other_user.id if other_user else 0,
            "other_name": other_user.full_name if other_user else "Пользователь",
            "other_avatar": other_user.avatar_url if other_user else None,
            "other_role": other_user.role if other_user else "developer",
            "last_message": last_text,
            "unread": unread_count
        })
    return result

@router.get("/{conv_id}/messages")
async def get_messages(conv_id: int, user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    res_conv = await db.execute(select(Conversation).where(Conversation.id == conv_id))
    conv = res_conv.scalars().first()
    if not conv or (conv.company_id != user.id and conv.developer_id != user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    await db.execute(update(Message).where(
        Message.conversation_id == conv_id, 
        Message.sender_id != user.id, 
        Message.is_read == False
    ).values(is_read=True))
    await db.commit()
    
    res_msgs = await db.execute(select(Message).where(Message.conversation_id == conv_id).order_by(Message.created_at.asc()))
    msgs = res_msgs.scalars().all()
    return [{"id": m.id, "text": m.text, "image_url": m.image_url, "is_mine": m.sender_id == user.id, "created_at": m.created_at.isoformat()} for m in msgs]

@router.post("/{conv_id}/upload")
async def upload_chat_image(conv_id: int, file: UploadFile = File(...), user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    res_conv = await db.execute(select(Conversation).where(Conversation.id == conv_id))
    conv = res_conv.scalars().first()
    if not conv or (conv.company_id != user.id and conv.developer_id != user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Только изображения")
    
    # Проверка размера (2 MB)
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    if file_size > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Файл слишком большой (максимум 2 МБ)")

    ext = file.filename.split(".")[-1]
    filename = f"chat_{uuid.uuid4()}.{ext}"
    os.makedirs("uploads/chat", exist_ok=True)
    filepath = f"uploads/chat/{filename}"
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"url": f"{settings.BACKEND_URL}/uploads/chat/{filename}"}

@router.post("/{conv_id}/messages")
async def send_message(conv_id: int, req: SendMessageReq, user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    res_conv = await db.execute(select(Conversation).where(Conversation.id == conv_id))
    conv = res_conv.scalars().first()
    if not conv or (conv.company_id != user.id and conv.developer_id != user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not req.text.strip() and not req.image_url:
        raise HTTPException(status_code=400, detail="Сообщение не может быть пустым")
    
    msg = Message(conversation_id=conv_id, sender_id=user.id, text=req.text.strip(), image_url=req.image_url)
    db.add(msg)
    await db.commit()
    return {"status": "ok"}
