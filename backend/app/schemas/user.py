from pydantic import BaseModel, EmailStr, Field, constr, field_validator
from typing import Optional
from app.models.user import RoleEnum

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Optional[RoleEnum] = RoleEnum.employee

class UserCreate(UserBase):
    password: constr(min_length=8, max_length=16)

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        import re
        if not re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$", v):
            raise ValueError("Password must contain at least one uppercase, lowercase, number, and special character")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_locked: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
