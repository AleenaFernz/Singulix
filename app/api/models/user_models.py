from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserSignup(BaseModel):
    email: str
    password: str  # Required password field
    role: str
    department: Optional[str] = None
    name: Optional[str] = None

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

class UserResponse(BaseModel):
    email: str
    role: str
    department: Optional[str]
    status: str 