from __future__ import annotations

import os
from typing import List, Dict
from gigachat import GigaChat
from gigachat.models import Chat, Messages, MessagesRole
from .config import settings

def _client() -> GigaChat:
    if "gigachat.devices" in settings.GIGACHAT_BASE_URL:
        return GigaChat(
            base_url=settings.GIGACHAT_BASE_URL,
            credentials=settings.GIGACHAT_CREDENTIALS,
            scope=settings.GIGACHAT_SCOPE,
            verify_ssl_certs=settings.GIGACHAT_VERIFY_SSL,
            model=settings.GIGACHAT_MODEL,
        )
    token = os.getenv("GIGACHAT_ACCESS_TOKEN")
    if not token:
        raise ValueError("Для api.giga.chat нужен GIGACHAT_ACCESS_TOKEN")
    return GigaChat(
        base_url=settings.GIGACHAT_BASE_URL,
        access_token=token,
        verify_ssl_certs=settings.GIGACHAT_VERIFY_SSL,
        model=settings.GIGACHAT_MODEL,
    )

def ask_chat(system_prompt: str, history: List[Dict[str, str]], user_prompt: str, temperature: float = 0.3) -> str:
    """Отправляет запрос с учетом всей истории диалога."""
    messages = [Messages(role=MessagesRole.SYSTEM, content=system_prompt)]
    
    for msg in history:
        role = MessagesRole.USER if msg["role"] == "user" else MessagesRole.ASSISTANT
        messages.append(Messages(role=role, content=msg["content"]))
        
    messages.append(Messages(role=MessagesRole.USER, content=user_prompt))
    
    chat = Chat(model=settings.GIGACHAT_MODEL, messages=messages, temperature=temperature)
    with _client() as client:
        response = client.chat(chat)
        content = response.choices[0].message.content
        if not isinstance(content, str):
            raise ValueError("Модель вернула не текст")
        return content.strip()

def ask_text(system_prompt: str, user_prompt: str) -> str:
    return ask_chat(system_prompt, [], user_prompt)
