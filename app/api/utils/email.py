import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from dotenv import load_dotenv
from pathlib import Path

logger = logging.getLogger(__name__)

# Load environment variables
env_path = Path(__file__).resolve().parent.parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# SMTP Configuration
SMTP_HOST = "smtp-relay.brevo.com"
SMTP_PORT = 587
SMTP_USERNAME = "88f588001@smtp-brevo.com"
SMTP_PASSWORD = os.getenv("BREVO_SMTP_KEY")
SENDER_EMAIL = "officialarunkn@gmail.com"
SENDER_NAME = "Singulix"

if not SMTP_PASSWORD:
    raise ValueError("BREVO_SMTP_KEY environment variable is not set")

async def send_email(to_email: str, subject: str, body: str) -> bool:
    try:
        logger.debug(f"SMTP Configuration - Host: {SMTP_HOST}, Port: {SMTP_PORT}")
        logger.debug(f"SMTP Username: {SMTP_USERNAME}")
        logger.debug(f"SMTP Password exists: {bool(SMTP_PASSWORD)}")
        if SMTP_PASSWORD:
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
        return False

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

def create_admin_pending_email(admin_email: str, department: str) -> str:
    return f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">New Admin Account Request</h2>
        <p>A new admin account requires your approval:</p>
        <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p><strong>Email:</strong> {admin_email}</p>
            <p><strong>Department:</strong> {department}</p>
        </div>
        <p>Please log in to your super admin dashboard to approve or reject this request.</p>
    </div>
    """

async def send_event_status_notification(to_email: str, event_name: str, status: str, reason: str = None):
    """
    Send an email notification about event status changes.
    
    Args:
        to_email (str): The recipient's email address
        event_name (str): Name of the event
        status (str): New status of the event ('approved' or 'rejected')
        reason (str, optional): Reason for rejection if status is 'rejected'
    """
    if status == "approved":
        subject = "Event Approved"
        body = f"""
        <h2>Event Approval Notification</h2>
        <p>Your event "{event_name}" has been approved by a super admin.</p>
        <p>You can now proceed with the event preparations.</p>
        
        <p>If you have any questions or need assistance, please contact the support team.</p>
        
        <p>Best regards,<br>
        The Singulix Team</p>
        """
    else:
        subject = "Event Rejected"
        body = f"""
        <h2>Event Rejection Notification</h2>
        <p>Your event "{event_name}" has been rejected by a super admin.</p>
        
        <h3>Reason for Rejection:</h3>
        <p>{reason or "No specific reason provided."}</p>
        
        <p>Please review the feedback and make the necessary adjustments before resubmitting your event.</p>
        
        <p>If you need clarification or assistance, please contact the support team.</p>
        
        <p>Best regards,<br>
        The Singulix Team</p>
        """
    
    await send_email(to_email, subject, body) 