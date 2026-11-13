from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, WebSocket, WebSocketDisconnect, Query, WebSocket, WebSocketDisconnect, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List
import os
import shutil
import magic
import uuid

from ..config import settings
from ..auth import get_db, get_current_user, UserDB, Conversation, Message, SECRET_KEY, ALGORITHM, SessionLocal
from jose import JWTError, jwt
from sqlalchemy import func
from jose import JWTError, jwt
from sqlalchemy import func

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, conv_id: int):
        await websocket.accept()
        if conv_id not in self.active_connections:
            self.active_connections[conv_id] = []
        self.active_connections[conv_id].append(websocket)

    def disconnect(self, websocket: WebSocket, conv_id: int):
        if conv_id in self.active_connections:
            if websocket in self.active_connections[conv_id]:
                self.active_connections[conv_id].remove(websocket)
            if not self.active_connections[conv_id]:
                del self.active_connections[conv_id]

    async def broadcast(self, conv_id: int, message: dict):
        if conv_id in self.active_connections:
            for connection in self.active_connections[conv_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()


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
        if user.role != "company" or user.plan != "enterprise":
            raise HTTPException(
                402,
                "Чат не оплачен. Используйте POST /api/company/hire/{developer_id} для списания токенов.",
            )
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
        unread_res = await db.execute(
            select(func.count(Message.id)).where(
                Message.conversation_id == c.id, 
                Message.is_read == False, 
                Message.sender_id != user.id
            )
        )
        unread_count = unread_res.scalar() or 0
        
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
async def get_messages(conv_id: int, before_id: int = None, limit: int = 50, user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    res_conv = await db.execute(select(Conversation).where(Conversation.id == conv_id))
    conv = res_conv.scalars().first()
    if not conv or (conv.company_id != user.id and conv.developer_id != user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not before_id:
        await db.execute(update(Message).where(
            Message.conversation_id == conv_id, 
            Message.sender_id != user.id, 
            Message.is_read == False
        ).values(is_read=True))
        await db.commit()
        await manager.broadcast(conv_id, {"type": "read", "user_id": user.id})
    
    query = select(Message).where(Message.conversation_id == conv_id)
    if before_id:
        query = query.where(Message.id < before_id)
        
    query = query.order_by(Message.id.desc()).limit(limit)
    res_msgs = await db.execute(query)
    msgs = list(res_msgs.scalars().all())
    msgs.reverse()
    
    return [{"id": m.id, "text": m.text, "image_url": m.image_url, "is_mine": m.sender_id == user.id, "created_at": m.created_at.isoformat(), "is_read": m.is_read} for m in msgs]

@router.post("/{conv_id}/upload")
async def upload_chat_image(conv_id: int, file: UploadFile = File(...), user: UserDB = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    res_conv = await db.execute(select(Conversation).where(Conversation.id == conv_id))
    conv = res_conv.scalars().first()
    if not conv or (conv.company_id != user.id and conv.developer_id != user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    ext = file.filename.split('.')[-1].lower() if file.filename else ""
    if ext not in {"jpg", "jpeg", "png", "webp", "gif"}: 
        raise HTTPException(400, "Только изображения")
        
    file_head = await file.read(2048)
    await file.seek(0)
    if not magic.from_buffer(file_head, mime=True).startswith("image/"):
        raise HTTPException(400, "Файл не является изображением")
    
    # Проверка размера (2 MB)
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    if file_size > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Файл слишком большой (максимум 2 МБ)")

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
        
    if len(req.text) > 5000:
        raise HTTPException(status_code=400, detail="Сообщение слишком длинное (макс 5000 символов)")

    msg = Message(conversation_id=conv_id, sender_id=user.id, text=req.text.strip(), image_url=req.image_url)
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    
    await manager.broadcast(conv_id, {
        "type": "message",
        "data": {
            "id": msg.id, 
            "text": msg.text, 
            "image_url": msg.image_url, 
            "is_mine": False, 
            "sender_id": user.id,
            "created_at": msg.created_at.isoformat()
        }
    })
    
    return {"status": "ok"}


@router.websocket("/ws/{conv_id}")
async def websocket_endpoint(websocket: WebSocket, conv_id: int, token: str = Query(...)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            await websocket.close(code=1008)
            return
    except JWTError:
        await websocket.close(code=1008)
        return

    async with SessionLocal() as db:
        result = await db.execute(select(UserDB).where(UserDB.email == email))
        user = result.scalars().first()
        if not user:
            await websocket.close(code=1008)
            return
            
        res_conv = await db.execute(select(Conversation).where(Conversation.id == conv_id))
        conv = res_conv.scalars().first()
        if not conv or (conv.company_id != user.id and conv.developer_id != user.id):
            await websocket.close(code=1008)
            return

    await manager.connect(websocket, conv_id)
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "typing":
                await manager.broadcast(conv_id, {
                    "type": "typing",
                    "user_id": user.id,
                    "is_typing": data.get("is_typing", False)
                })
    except WebSocketDisconnect:
        manager.disconnect(websocket, conv_id)
