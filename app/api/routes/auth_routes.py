from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import HTMLResponse, RedirectResponse
from pathlib import Path
from ..models.user_models import UserSignup, OTPVerify, UserResponse
from ..utils.email import send_email, create_otp_email, create_admin_pending_email
from ..utils.auth import generate_custom_otp, generate_secure_password, create_access_token, get_user_from_token
from ..services.user_service import create_user, verify_user, get_user_by_email, get_pending_admins, approve_admin, reject_admin
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    return get_user_from_token(token)

@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        logger.debug(f"Login attempt for email: {form_data.username}")
        # Get user from database
        user = await get_user_by_email(form_data.username)
        if not user:
            raise HTTPException(status_code=400, detail="Incorrect email or password")
            
        logger.debug(f"User found with role: {user.get('role')}")
        
        # Check if user is active
        if user.get("status") != "active":
            if user.get("status") == "pending":
                raise HTTPException(status_code=400, detail="Please verify your email first")
            elif user.get("status") == "pending_admin":
                raise HTTPException(status_code=400, detail="Your admin account is pending approval")
            else:
                raise HTTPException(status_code=400, detail="Account is not active")
        
        # Verify password
        if user.get("password") != form_data.password:
            raise HTTPException(status_code=400, detail="Incorrect email or password")
            
        # Generate access token
        access_token = create_access_token(
            data={
                "sub": str(user.get("id")),
                "email": user.get("email"),
                "role": user.get("role"),
                "department": user.get("department")
            }
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_role": user.get("role"),
            "user_email": user.get("email"),
            "user_department": user.get("department")
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/signup")
async def signup(user: UserSignup):
    """
    Endpoint for user signup. Does not require authentication.
    """
    try:
        logger.debug(f"Starting signup process for email: {user.email}")
        
        if user.role == "super_admin":
            raise HTTPException(status_code=403, detail="Super admin accounts cannot be created through signup")
        
        if user.role == "admin":
            # For admin signups, create account with pending status
            user_created = await create_user(
                user_data=user,
                password=user.password,
                status="pending_admin"
            )
            
            if not user_created:
                raise HTTPException(status_code=500, detail="Failed to create admin account")
            
            # Notify super admins about new admin request
            super_admins = await get_user_by_email(role="super_admin")
            for admin in super_admins:
                await send_email(
                    to_email=admin["email"],
                    subject="New Admin Account Request - Singulix",
                    body=create_admin_pending_email(user.email, user.department)
                )
            
            return {"message": "Admin account created. Waiting for super admin approval."}
        
        else:
            # For regular users, continue with OTP verification flow
            otp = generate_custom_otp()
            html_content = create_otp_email(user.name or "User", otp)
            
            # Send OTP email
            email_sent = await send_email(
                to_email=user.email,
                subject="Verify your email - Singulix",
                body=html_content
            )
            
            if not email_sent:
                raise HTTPException(status_code=500, detail="Failed to send verification email")
            
            # Create user record with OTP as temporary password
            user_created = await create_user(
                user_data=user,
                password=otp,  # Use OTP as temporary password
                status="pending"
            )
            
            if not user_created:
                raise HTTPException(status_code=500, detail="Failed to create user")
            
            return {"message": "Signup successful. Please check your email for verification code."}
            
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify")
async def verify_otp(verification: OTPVerify):
    """
    Endpoint for OTP verification. Does not require authentication.
    """
    try:
        result = await verify_user(verification)
        return result
    except Exception as e:
        logger.error(f"OTP verification error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/login", response_class=HTMLResponse)
async def get_login_page():
    """
    Serve the login page. Does not require authentication.
    """
    try:
        template_path = Path(__file__).resolve().parent.parent.parent / "templates" / "login.html"
        with open(template_path) as f:
            content = f.read()
        return HTMLResponse(content=content)
    except Exception as e:
        logger.error(f"Error serving login page: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/super-admin-dashboard", response_class=HTMLResponse)
async def get_super_admin_dashboard(request: Request):
    """
    Serve the super admin dashboard HTML.
    Authentication will be handled client-side using stored token.
    """
    try:
        template_path = Path(__file__).resolve().parent.parent.parent / "templates" / "super_admin_dashboard.html"
        with open(template_path) as f:
            content = f.read()
        return HTMLResponse(content=content)
    except Exception as e:
        logger.error(f"Error serving dashboard: {str(e)}")
        return RedirectResponse(url="/auth/login")

@router.get("/pending-admins")
async def get_pending_admin_list(current_user: dict = Depends(get_current_user)):
    """
    Get list of pending admin requests. Requires super admin authentication.
    """
    try:
        if current_user.get("role") != "super_admin":
            raise HTTPException(status_code=403, detail="Only super admins can view pending admin requests")
            
        pending_admins = await get_pending_admins()
        return {"pending_admins": pending_admins}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error getting pending admins: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/approve-admin/{admin_id}")
async def approve_admin_account(
    admin_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Approve an admin account. Requires super admin authentication.
    """
    try:
        if current_user.get("role") != "super_admin":
            raise HTTPException(status_code=403, detail="Only super admins can approve admin accounts")
            
        success = await approve_admin(admin_id)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to approve admin account")
            
        return {"message": "Admin account approved successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error approving admin: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reject-admin/{admin_id}")
async def reject_admin_account(
    admin_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Reject an admin account. Requires super admin authentication.
    """
    try:
        if current_user.get("role") != "super_admin":
            raise HTTPException(status_code=403, detail="Only super admins can reject admin accounts")
            
        success = await reject_admin(admin_id)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to reject admin account")
            
        return {"message": "Admin account rejected successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error rejecting admin: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/admin-dashboard", response_class=HTMLResponse)
async def get_admin_dashboard(request: Request):
    """
    Serve the admin dashboard HTML.
    Authentication will be handled client-side using stored token.
    """
    try:
        template_path = Path(__file__).resolve().parent.parent.parent / "templates" / "admin_dashboard.html"
        with open(template_path) as f:
            content = f.read()
        return HTMLResponse(content=content)
    except Exception as e:
        logger.error(f"Error serving admin dashboard: {str(e)}")
        return RedirectResponse(url="/auth/login") 