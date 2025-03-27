from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
import logging
from supabase import create_client, Client
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Singulix API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
logger.debug(f"Supabase URL: {supabase_url}")
logger.debug(f"Supabase Key exists: {'Yes' if supabase_key else 'No'}")

supabase: Client = create_client(supabase_url, supabase_key)

# SMTP Configuration
SMTP_HOST = "smtp-relay.brevo.com"
SMTP_PORT = 587
SMTP_USERNAME = "88f588001@smtp-brevo.com"
SMTP_PASSWORD = os.getenv("BREVO_SMTP_KEY")
SENDER_EMAIL = "officialarunkn@gmail.com"
SENDER_NAME = "Singulix"

# Add detailed logging for troubleshooting
logger.debug("SMTP Configuration:")
logger.debug(f"Host: {SMTP_HOST}")
logger.debug(f"Port: {SMTP_PORT}")
logger.debug(f"Username: {SMTP_USERNAME}")
logger.debug(f"Password exists: {'Yes' if SMTP_PASSWORD else 'No'}")
if SMTP_PASSWORD:
    logger.debug(f"Password first 10 chars: {SMTP_PASSWORD[:10]}...")
logger.debug(f"Sender Email: {SENDER_EMAIL}")

# Request models
class UserSignup(BaseModel):
    email: str
    role: str
    department: Optional[str] = None

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

async def send_email(to_email: str, subject: str, body: str):
    try:
        logger.debug(f"SMTP Configuration - Host: {SMTP_HOST}, Port: {SMTP_PORT}")
        logger.debug(f"SMTP Username: {SMTP_USERNAME}")
        logger.debug(f"SMTP Password exists: {bool(SMTP_PASSWORD)}")
        if SMTP_PASSWORD:
            # Log first few characters of password for debugging
            logger.debug(f"SMTP Password starts with: {SMTP_PASSWORD[:10]}...")
        
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.set_debuglevel(1)  # Enable SMTP debug output
        logger.debug("Starting TLS")
        server.starttls()
        
        logger.debug("Attempting SMTP login")
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        
        message = MIMEText(body)
        message["Subject"] = subject
        message["From"] = SENDER_EMAIL
        message["To"] = to_email
        
        logger.debug(f"Sending email to {to_email}")
        server.sendmail(SENDER_EMAIL, to_email, message.as_string())
        server.quit()
        logger.debug("Email sent successfully")
        return True
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

# Custom OTP format function
def generate_custom_otp() -> str:
    import random
    # Format: 2 letters + 4 numbers + 2 letters
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    numbers = '0123456789'
    otp = ''.join(random.choices(letters, k=2))  # First 2 letters
    otp += ''.join(random.choices(numbers, k=4))  # Middle 4 numbers
    otp += ''.join(random.choices(letters, k=2))  # Last 2 letters
    return otp

def create_otp_email(user_name: str, otp: str) -> str:
    return f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Welcome to Singulix!</h2>
        <p>Hello {user_name},</p>
        <p>Your verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; 
                    font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
            {otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
    </div>
    """

@app.post("/auth/signup")
async def signup(user: UserSignup):
    try:
        logger.debug(f"Starting signup process for email: {user.email}")
        
        # Check if user already exists
        existing_user = supabase.table('users').select('*').eq('email', user.email).execute()
        logger.debug(f"Existing user check result: {existing_user}")
        
        if existing_user.data and len(existing_user.data) > 0:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Generate OTP
        otp = generate_custom_otp()
        logger.debug(f"Generated OTP for {user.email}")
        
        # Send OTP via Brevo
        logger.debug("Attempting to send email via Brevo...")
        html_content = create_otp_email("User", otp)
        
        email_sent = await send_email(
            to_email=user.email,
            subject="Verify your email - Singulix",
            body=html_content
        )
        
        if not email_sent:
            raise HTTPException(status_code=500, detail="Failed to send verification email")
        
        # Store user data with OTP
        new_user = {
            'email': user.email,
            'role': user.role,
            'status': 'pending',  # pending verification
            'department': user.department,
            'password': otp,  # temporarily store OTP
            'created_at': datetime.now().isoformat()
        }
        
        logger.debug(f"Attempting to insert new user: {new_user}")
        result = supabase.table('users').insert(new_user).execute()
        logger.debug(f"Insert result: {result}")
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create user record")
            
        return {"message": "Signup successful. Please check your email for verification code."}
        
    except HTTPException as he:
        logger.error(f"HTTP Exception in signup: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Signup error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/verify")
async def verify_otp(verification: OTPVerify):
    try:
        logger.debug(f"Starting OTP verification for email: {verification.email}")
        
        # Check OTP in users table
        user_data = supabase.table('users').select('*').eq('email', verification.email).eq('password', verification.otp).eq('status', 'pending').execute()
        
        if not user_data.data:
            raise HTTPException(status_code=400, detail="Invalid OTP")
        
        user = user_data.data[0]
        
        # Generate a secure password
        secure_password = generate_secure_password()
        
        # Update user record with secure password and active status
        supabase.table('users').update({
            'status': 'active',
            'password': secure_password  # Store the secure password
        }).eq('email', verification.email).execute()
        
        logger.debug(f"Successfully verified user: {verification.email}")
        return {
            "message": "Email verified successfully",
            "user": {
                "email": user['email'],
                "role": user['role'],
                "department": user['department']
            }
        }
        
    except Exception as e:
        logger.error(f"OTP verification error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def generate_secure_password():
    """Generate a secure random password"""
    import secrets
    import string
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(alphabet) for _ in range(16))

@app.get("/test-smtp")
async def test_smtp():
    try:
        logger.debug("Testing SMTP connection...")
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            logger.debug("SMTP login successful!")
            return {"status": "success", "message": "SMTP connection and login successful"}
    except Exception as e:
        logger.error(f"SMTP test failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 