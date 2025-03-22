from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import os
from dotenv import load_dotenv
import qrcode
import io
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import aiosmtplib
from jinja2 import Environment, FileSystemLoader
import json
from supabase import create_client, Client
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import jwt

from models import *
from database import Database

# Load environment variables
load_dotenv()

# FastAPI init
app = FastAPI(title="Singulix API")

# CORS config (Add frontend URL here)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add deployed frontend here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB init
db = Database()
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Auth models
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# JWT token creator
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

# Authentication routes
@app.post("/signup", response_model=User)
async def signup(user: UserCreate):
    try:
        return await db.create_user(user.email, user.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
       import traceback
       traceback.print_exc()
       raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/login", response_model=Token)
async def login(user: UserLogin):
    try:
        authenticated_user = await db.authenticate_user(user.email, user.password)

        # Token payload
        access_token = create_access_token(
            data={
                "id": authenticated_user.id,
                "email": authenticated_user.email
                # "role": authenticated_user.role (optional, if using roles)
            },
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return {"access_token": access_token, "token_type": "bearer"}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")

# Token decode logic
async def get_current_user(request: Request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("id")
        user_email = payload.get("email")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"id": user_id, "email": user_email}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# 🆕 GET current user info (optional)
@app.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    result = supabase.table("users").select("*").eq("id", current_user["id"]).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return result.data[0]

# ✅ Add all your other endpoints below...

# Example:
@app.post("/venues", response_model=Venue)
async def create_venue(venue: VenueCreate):
    return await db.create_venue(venue)

@app.get("/venues", response_model=List[Venue])
async def list_venues():
    return await db.list_venues()

# ... continue with events, tickets, alerts, etc. (unchanged from your file)

# If running directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
