from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional, List
from ..models.event_models import EventCreate, EventResponse
from ..services.event_service import create_event, get_events_by_user, get_event_by_id, update_event_status
from ..utils.auth import get_user_from_token, get_current_user
from ..utils.supabase import get_supabase_client
from ..utils.email import send_email, send_event_status_notification
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    return get_user_from_token(token)

@router.post("/create", response_model=EventResponse)
async def create_event_endpoint(event: EventCreate, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create events"
        )
    
    try:
        return await create_event(event, current_user)
    except Exception as e:
        logger.error(f"Error creating event: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/my-events", response_model=dict)
async def get_user_events(
    current_user: dict = Depends(get_current_user)
):
    try:
        events = await get_events_by_user(current_user)
        
        return {
            "events": [EventResponse(**event) for event in events]
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error fetching events: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/pending-approvals", response_model=dict)
async def get_pending_events(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only super admins can view pending events"
        )
    
    try:
        # Pass the complete user information including role
        events = await get_events_by_user(current_user, {"status": "pending"})
        return {"events": events}
    except Exception as e:
        logger.error(f"Error fetching pending events: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/approve/{event_id}")
async def approve_event(event_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only super admins can approve events"
        )
    
    try:
        logger.debug(f"Attempting to approve event {event_id}")
        event = await get_event_by_id(event_id)
        if not event:
            logger.error(f"Event {event_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        logger.debug(f"Found event: {event}")
        updated_event = await update_event_status(event_id, "approved")
        logger.debug(f"Updated event: {updated_event}")
        
        # Get admin's email from users table
        supabase = get_supabase_client()
        admin_result = supabase.table("users").select("email").eq("id", event["created_by"]).single().execute()
        
        if admin_result.data and admin_result.data.get("email"):
            # Send email notification to the admin who created the event
            await send_event_status_notification(
                admin_result.data["email"],
                event["name"],
                "approved"
            )
            logger.debug("Sent approval notification email")
        else:
            logger.warning(f"Could not find email for admin {event['created_by']}")
        
        return {"message": "Event approved successfully"}
    except Exception as e:
        logger.error(f"Error approving event: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/reject/{event_id}")
async def reject_event(
    event_id: str,
    reason: dict,
    current_user: dict = Depends(get_current_user)
):
    if current_user.get("role") != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only super admins can reject events"
        )
    
    try:
        event = await get_event_by_id(event_id)
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        updated_event = await update_event_status(event_id, "rejected")
        
        # Send email notification to the admin who created the event
        await send_event_status_notification(
            event["created_by_email"],
            event["name"],
            "rejected",
            reason.get("reason")
        )
        
        return {"message": "Event rejected successfully"}
    except Exception as e:
        logger.error(f"Error rejecting event: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 