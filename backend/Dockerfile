FROM python:3.12-slim

# Устанавливаем libmagic для проверки файлов
RUN apt-get update && apt-get install -y libmagic1 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Создаем непривилегированного пользователя
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Даем права на папку uploads новому пользователю
RUN mkdir -p uploads/avatars uploads/images uploads/chat && chown -R appuser:appgroup /app

# Переключаемся на безопасного пользователя
USER appuser

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
