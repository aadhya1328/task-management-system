from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.db.database import get_db
from app.schemas.user import UserCreate, UserResponse, Token
from app.crud import user as crud_user

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    """
    user = crud_user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud_user.create_user(db, user=user_in)
    return user

@router.post("/login", response_model=Token)
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = crud_user.get_user_by_email(db, email=form_data.username) # OAuth2 uses username for email
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if user.is_locked:
        raise HTTPException(status_code=400, detail="Account is locked due to too many failed login attempts")

    if not verify_password(form_data.password, user.hashed_password):
        crud_user.increment_failed_login(db, user)
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    crud_user.reset_failed_login(db, user)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
