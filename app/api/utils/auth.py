import random
import string
import secrets
import jwt
from datetime import datetime, timedelta
import os
from typing import Optional
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

# Secret key for JWT tokens
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")  # In production, always use environment variable
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def generate_custom_otp() -> str:
    # Format: 2 letters + 4 numbers + 2 letters
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    numbers = '0123456789'
    otp = ''.join(random.choices(letters, k=2))  # First 2 letters
    otp += ''.join(random.choices(numbers, k=4))  # Middle 4 numbers
    otp += ''.join(random.choices(letters, k=2))  # Last 2 letters
    return otp

def generate_secure_password() -> str:
    """Generate a secure random password"""
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(alphabet) for _ in range(16))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    """Verify a JWT token and return the decoded payload"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

def get_user_from_token(token: str) -> dict:
    """Extract user information from JWT token"""
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")
        
    # Remove 'Bearer ' prefix if present
    if token.startswith('Bearer '):
        token = token[7:]
        
    try:
        payload = verify_token(token)
        if not payload.get("sub"):  # 'sub' is the user ID
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    FastAPI dependency to get the current user from the JWT token.
    
    Args:
        token (str): The JWT token from the request header
        
    Returns:
        dict: The user information from the token
        
    Raises:
        HTTPException: If the token is invalid or expired
    """
    return get_user_from_token(token) 