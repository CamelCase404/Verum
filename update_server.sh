#!/bin/bash
# Скрипт для обновления проекта на сервере

SERVER_IP="130.49.149.109"
SERVER_USER="root"
PROJECT_PATH="/root/Verum"

echo "🚀 Подключаемся к серверу $SERVER_IP для обновления..."

ssh $SERVER_USER@$SERVER_IP << EOF
  cd $PROJECT_PATH
  echo "📥 Скачиваем свежий код из Git..."
  git pull
  
  echo "🐳 Пересобираем и перезапускаем контейнеры..."
  docker compose -f docker-compose.prod.yml up -d --build frontend_main frontend_test
  
  echo "✅ Обновление завершено! Сайт перезапущен."
EOF
