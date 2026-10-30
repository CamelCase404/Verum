import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.auth import SessionLocal, UserDB, get_password_hash

def create_admin(email, password, name="Главный Админ"):
    db = SessionLocal()
    existing = db.query(UserDB).filter(UserDB.email == email).first()
    
    if existing:
        print(f"⚠️  Пользователь с email {email} уже существует.")
        if existing.role != "admin":
            existing.role = "admin"
            db.commit()
            print(f"✅ Роль пользователя {email} изменена на ADMIN.")
        else:
            print(f"ℹ️  Пользователь {email} уже является администратором.")
        db.close()
        return

    admin = UserDB(
        email=email,
        hashed_password=get_password_hash(password),
        role="admin",
        full_name=name
    )
    db.add(admin)
    db.commit()
    db.close()
    print(f"✅ Администратор {email} успешно создан!")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Использование: python create_admin.py <email> <password>")
        sys.exit(1)
    
    create_admin(sys.argv[1], sys.argv[2])
