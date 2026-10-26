FROM python:3.12-slim

WORKDIR /app

# Обновляем pip и setuptools, чтобы сборщик работал корректно
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код
COPY . .

# Создаем папки для загрузок
RUN mkdir -p uploads/avatars uploads/images uploads/chat

# Запускаем сервер
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
