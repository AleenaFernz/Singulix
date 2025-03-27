from datetime import datetime
from ..models.user_models import UserSignup
from ..utils.auth import generate_secure_password
from ..utils.supabase_client import get_supabase_client
from ..utils.email import send_email
import logging

logger = logging.getLogger(__name__)

async def get_user_by_email(email: str = None, role: str = None):
    try:
        supabase = get_supabase_client()
        query = supabase.table('users').select('*')
        
        if email:
            query = query.eq('email', email)
        if role:
            query = query.eq('role', role)
            
        result = query.execute()
        
        if email:  # Return single user
            return result.data[0] if result.data and len(result.data) > 0 else None
        else:  # Return list of users
            return result.data if result.data else []
            
    except Exception as e:
        logger.error(f"Error getting user: {str(e)}")
        return None if email else []

async def create_user(user_data: UserSignup, password: str, status: str = "pending"):
    try:
        supabase = get_supabase_client()
        # Check if user exists
        existing_user = supabase.table('users').select('*').eq('email', user_data.email).execute()
        if existing_user.data and len(existing_user.data) > 0:
            return False
        
        # Create new user
        new_user = {
            'email': user_data.email,
            'role': user_data.role,
            'status': status,
            'department': user_data.department,
            'password': password,
            'created_at': datetime.now().isoformat()
        }
        
        result = supabase.table('users').insert(new_user).execute()
        return bool(result.data)
        
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        return False

async def verify_user(email: str, otp: str):
    try:
        supabase = get_supabase_client()
        # Get user with matching OTP
        user_data = supabase.table('users').select('*').eq('email', email).eq('password', otp).eq('status', 'pending').execute()
        
        if not user_data.data:
            return None
            
        user = user_data.data[0]
        
        # Update user status
        secure_password = generate_secure_password()
        supabase.table('users').update({
            'status': 'active',
            'password': secure_password
        }).eq('email', email).execute()
        
        return user
        
    except Exception as e:
        logger.error(f"Error verifying user: {str(e)}")
        return None

async def get_pending_admins():
    try:
        supabase = get_supabase_client()
        result = supabase.table('users').select('*').eq('role', 'admin').eq('status', 'pending_admin').execute()
        return result.data if result.data else []
    except Exception as e:
        logger.error(f"Error getting pending admins: {str(e)}")
        return []

async def approve_admin(admin_id: str):
    try:
        supabase = get_supabase_client()
        
        # Get admin details
        admin = supabase.table('users').select('*').eq('id', admin_id).single().execute()
        if not admin.data:
            return False
            
        # Generate password for admin
        password = generate_secure_password()
        
        # Update admin status
        result = supabase.table('users').update({
            'status': 'active',
            'password': password
        }).eq('id', admin_id).execute()
        
        if result.data:
            # Send password to admin
            await send_email(
                to_email=admin.data['email'],
                subject="Your Admin Account Has Been Approved - Singulix",
                body=f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2>Your Admin Account Has Been Approved!</h2>
                    <p>Hello,</p>
                    <p>Your admin account has been approved. You can now log in using:</p>
                    <p><strong>Email:</strong> {admin.data['email']}</p>
                    <p><strong>Password:</strong> {password}</p>
                    <p>Please change your password after your first login.</p>
                </div>
                """
            )
            return True
            
        return False
        
    except Exception as e:
        logger.error(f"Error approving admin: {str(e)}")
        return False

async def reject_admin(admin_id: str) -> bool:
    try:
        # Get admin user
        admin = await get_user_by_email(admin_id)
        if not admin or admin.get("role") != "admin" or admin.get("status") != "pending_admin":
            return False
            
        # Delete the admin account
        supabase_client = get_supabase_client()
        result = await supabase_client.table("users").delete().eq("id", admin_id).execute()
        
        if not result.data:
            return False
            
        # Send rejection email
        await send_email(
            to_email=admin.get("email"),
            subject="Admin Account Request - Rejected",
            body=f"""
            <h2>Admin Account Request Rejected</h2>
            <p>Dear {admin.get('email')},</p>
            <p>We regret to inform you that your request for an admin account has been rejected.</p>
            <p>If you believe this is a mistake, please contact the super admin.</p>
            <p>Best regards,<br>Singulix Team</p>
            """
        )
        
        return True
        
    except Exception as e:
        logger.error(f"Error rejecting admin: {str(e)}")
        return False 