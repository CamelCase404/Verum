import sys
import os
import asyncio
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.auth import SessionLocal, UserDB, get_password_hash
from sqlalchemy import select

async def create_admin(email, password, name="Главный Админ"):
    async with SessionLocal() as db:
        result = await db.execute(select(UserDB).where(UserDB.email == email))
        existing = result.scalars().first()
        
        if existing:
            print(f"⚠️  Пользователь с email {email} уже существует.")
            if existing.role != "admin":
                existing.role = "admin"
                await db.commit()
                print(f"✅ Роль пользователя {email} изменена на ADMIN.")
            else:
                print(f"ℹ️  Пользователь {email} уже является администратором.")
            return

        admin = UserDB(
            email=email,
            hashed_password=get_password_hash(password),
            role="admin",
            full_name=name
        )
        db.add(admin)
        await db.commit()
        print(f"✅ Администратор {email} успешно создан!")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Использование: python create_admin.py <email> <password>")
        sys.exit(1)
    asyncio.run(create_admin(sys.argv[1], sys.argv[2]))
