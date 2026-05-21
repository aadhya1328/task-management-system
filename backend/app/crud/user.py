from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def increment_failed_login(db: Session, user: User):
    user.failed_login_attempts += 1
    if user.failed_login_attempts >= 5:
        user.is_locked = True
    db.add(user)
    db.commit()
    db.refresh(user)

def reset_failed_login(db: Session, user: User):
    user.failed_login_attempts = 0
    db.add(user)
    db.commit()
    db.refresh(user)
