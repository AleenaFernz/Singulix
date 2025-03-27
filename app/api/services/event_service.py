from datetime import datetime
from ..models.event_models import EventCreate, EventResponse
from ..utils.auth import get_user_from_token
from ..utils.email import send_email
from ..utils.supabase import get_supabase_client
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

async def create_event(event: EventCreate, user: dict) -> EventResponse:
    """
    Create a new event with pending status.
    """
    try:
        supabase = get_supabase_client()
        
        # Get user ID from either 'id' or 'sub' field
        user_id = user.get("id") or user.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user information"
            )
        
        # Convert date and time to ISO format strings
        event_data = {
            "name": event.name,
            "description": event.description,
            "venue": event.venue,
            "date": event.date.isoformat(),  # Convert date to ISO format string
            "time": event.time.isoformat(),  # Convert time to ISO format string
            "capacity": event.capacity,
            "created_by": user_id,
            "status": "pending"
        }
        
        result = supabase.table("events").insert(event_data).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create event"
            )
            
        return EventResponse(**result.data[0])
    except Exception as e:
        logger.error(f"Error in create_event: {str(e)}")
        raise

async def get_events_by_user(user_info: dict, filters: dict = None) -> list:
    """
    Get events based on user role and filters.
    
    Args:
        user_info (dict): User information containing 'sub' (user ID) and 'role'
        filters (dict, optional): Additional filters to apply to the query
    """
    try:
        supabase = get_supabase_client()
        query = supabase.table("events").select("*")
        
        # Get user role and ID
        user_role = user_info.get("role")
        user_id = user_info.get("sub") or user_info.get("id")
        
        if not user_id:
            raise Exception("Invalid user information")

        # Apply role-based filtering
        if user_role == 'super_admin':
            # Super admin can see all events
            pass
        elif user_role == 'admin':
            # Admin can see their created events
            query = query.eq("created_by", user_id)
        else:
            # Regular users can only see approved events
            query = query.eq("status", "approved")
        
        # Apply additional filters if provided
        if filters:
            for key, value in filters.items():
                query = query.eq(key, value)
        
        result = query.execute()
        return result.data if result.data else []
    except Exception as e:
        logger.error(f"Error in get_events_by_user: {str(e)}")
        raise

async def get_event_by_id(event_id: str) -> dict:
    """
    Get a single event by its ID.
    """
    try:
        supabase = get_supabase_client()
        result = supabase.table("events").select("*").eq("id", event_id).single().execute()
        
        if not result.data:
            return None
            
        return result.data
    except Exception as e:
        logger.error(f"Error in get_event_by_id: {str(e)}")
        raise

async def update_event_status(event_id: str, status: str) -> dict:
    """
    Update the status of an event.
    """
    try:
        supabase = get_supabase_client()
        logger.debug(f"Updating event {event_id} status to {status}")
        
        # First check if event exists
        check_result = supabase.table("events").select("*").eq("id", event_id).execute()
        if not check_result.data:
            logger.error(f"Event {event_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
            
        logger.debug(f"Found event: {check_result.data[0]}")
        
        # Update the status
        result = supabase.table("events").update({"status": status}).eq("id", event_id).execute()
        
        if not result.data:
            logger.error(f"Failed to update event {event_id} status")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update event status"
            )
            
        logger.debug(f"Successfully updated event status: {result.data[0]}")
        return result.data[0]
    except Exception as e:
        logger.error(f"Error in update_event_status: {str(e)}")
        raise 