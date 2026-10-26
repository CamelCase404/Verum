#!/bin/bash
# Скрипт для бэкапа базы данных и файлов (запускать через cron раз в день)

DATE=$(date +%Y-%m-%d_%H-%M)
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

echo "Начинаю бэкап за $DATE..."

# 1. Бэкап PostgreSQL
docker exec -t verum_db pg_dump -U verum_user verum_db > "$BACKUP_DIR/db_$DATE.sql"

# 2. Бэкап загруженных файлов (видео, аватарки)
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" backend/uploads

# 3. Удаляем бэкапы старше 7 дней
find "$BACKUP_DIR" -type f -mtime +7 -delete

echo "✅ Бэкап завершен! Файлы в папке $BACKUP_DIR"
