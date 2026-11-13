#!/bin/bash

# --- НАСТРОЙКИ ---
SERVER_IP="130.49.149.109"
SERVER_USER="root"
PROJECT_DIR="/home/camelcase/GitHubProjs/Verum"
LOCAL_BACKEND_PATH="$PROJECT_DIR/backend"
SERVER_PROJECT_PATH="/root/Verum"

echo "🚀 Начинаем локальную сборку бэкенда..."
cd "$PROJECT_DIR" || { echo "❌ Папка проекта не найдена!"; exit 1; }

# 1. Собираем образ локально
docker build -t verum-backend:latest "$LOCAL_BACKEND_PATH"

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при локальной сборке бэкенда. Проверь Dockerfile."
    exit 1
fi

# 2. Сохраняем в архив
echo "📦 Упаковываем образ в архив..."
docker save verum-backend:latest -o "$PROJECT_DIR/backend_image.tar"

# 3. Отправляем на сервер
echo "📤 Отправляем образ на сервер ($SERVER_IP)... (потребуется пароль)"
scp "$PROJECT_DIR/backend_image.tar" $SERVER_USER@$SERVER_IP:$SERVER_PROJECT_PATH/

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при отправке файла."
    rm "$PROJECT_DIR/backend_image.tar"
    exit 1
fi

# 4. Загружаем на сервере и перезапускаем
echo "🔄 Обновляем бэкенд на сервере... (потребуется пароль)"
ssh $SERVER_USER@$SERVER_IP "cd $SERVER_PROJECT_PATH && \
    docker load -i backend_image.tar && \
    docker compose -f docker-compose.prod.yml up -d --no-build backend && \
    rm backend_image.tar && \
    echo '✅ Бэкенд успешно обновлен!' && \
    docker ps --format 'table {{.Names}}\t{{.Status}}' | grep backend"

# 5. Убираем локальный архив
rm "$PROJECT_DIR/backend_image.tar"
echo "✨ Готово! Бэкенд обновлен."
