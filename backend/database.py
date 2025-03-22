from supabase import create_client, Client
from typing import Optional, List, Dict, Any
import os
from datetime import datetime
from models import *
from passlib.context import CryptContext
from dotenv import load_dotenv

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

load_dotenv()

class Database:
    def __init__(self):
        self.supabase: Client = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_KEY")
        )

    # User operations
    async def create_user(self, email: str, password: str) -> User:
        # Check if user already exists
        result = self.supabase.table("users").select("*").eq("email", email).execute()
        if result.data:
            raise ValueError("User with this email already exists")

        # Hash password
        hashed_password = pwd_context.hash(password)
        
        # Create user
        data = {
            "email": email,
            "password": hashed_password,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        result = self.supabase.table("users").insert(data).execute()
        return User(**result.data[0])

    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        # Get user
        result = self.supabase.table("users").select("*").eq("email", email).execute()
        if not result.data:
            raise ValueError("User not found")

        user = User(**result.data[0])
        
        # Verify password
        if not pwd_context.verify(password, user.password):
            raise ValueError("Invalid password")

        return user

    # Venue operations
    async def create_venue(self, venue: VenueCreate) -> Venue:
        data = venue.dict()
        result = self.supabase.table("venues").insert(data).execute()
        return Venue(**result.data[0])

    async def get_venue(self, venue_id: str) -> Optional[Venue]:
        result = self.supabase.table("venues").select("*").eq("id", venue_id).execute()
        return Venue(**result.data[0]) if result.data else None

    async def list_venues(self) -> List[Venue]:
        result = self.supabase.table("venues").select("*").execute()
        return [Venue(**venue) for venue in result.data]

    # Event operations
    async def create_event(self, event: EventCreate, user_id: str) -> Event:
        try:
            result = self.supabase.table('events').insert({
                'title': event.title,
                'description': event.description,
                'location': event.location,
                'organizer_id': user_id,
                'max_tickets': event.max_tickets,
                'price': event.price
            }).execute()
            
            return Event(**result.data[0])
        except Exception as e:
            raise Exception(f"Error creating event: {str(e)}")

    async def get_event(self, event_id: str) -> Optional[Event]:
        try:
            result = self.supabase.table('events').select('*').eq('id', event_id).execute()
            if not result.data:
                return None
            return Event(**result.data[0])
        except Exception as e:
            raise Exception(f"Error getting event: {str(e)}")

    async def list_events(self, organizer_id: Optional[str] = None) -> List[Event]:
        query = self.supabase.table("events").select("*")
        if organizer_id:
            query = query.eq("organizer_id", organizer_id)
        result = query.execute()
        return [Event(**event) for event in result.data]

    # Time slot operations
    async def create_time_slot(self, time_slot: TimeSlotCreate) -> TimeSlot:
        data = time_slot.dict()
        result = self.supabase.table("time_slots").insert(data).execute()
        return TimeSlot(**result.data[0])

    async def get_time_slot(self, time_slot_id: str) -> Optional[TimeSlot]:
        result = self.supabase.table("time_slots").select("*").eq("id", time_slot_id).execute()
        return TimeSlot(**result.data[0]) if result.data else None

    async def list_time_slots(self, event_id: str) -> List[TimeSlot]:
        result = self.supabase.table("time_slots").select("*").eq("event_id", event_id).execute()
        return [TimeSlot(**slot) for slot in result.data]

    # Ticket operations
    async def create_ticket(self, ticket: TicketCreate, user_id: str, qr_code: str) -> Ticket:
        try:
            result = self.supabase.table('tickets').insert({
                'event_id': ticket.event_id,
                'time_slot_id': ticket.time_slot_id,
                'user_id': user_id,
                'qr_code': qr_code
            }).execute()
            
            return Ticket(**result.data[0])
        except Exception as e:
            raise Exception(f"Error creating ticket: {str(e)}")

    async def get_ticket(self, ticket_id: str) -> Optional[Ticket]:
        try:
            result = self.supabase.table('tickets').select('*').eq('id', ticket_id).execute()
            if not result.data:
                return None
            return Ticket(**result.data[0])
        except Exception as e:
            raise Exception(f"Error getting ticket: {str(e)}")

    async def validate_ticket(self, qr_code: str) -> Optional[Ticket]:
        result = self.supabase.table("tickets").select("*").eq("qr_code", qr_code).execute()
        return Ticket(**result.data[0]) if result.data else None

    # Team member operations
    async def add_team_member(self, team_member: TeamMemberCreate) -> TeamMember:
        data = team_member.dict()
        result = self.supabase.table("team_members").insert(data).execute()
        return TeamMember(**result.data[0])

    async def get_team_members(self, event_id: str) -> List[TeamMember]:
        result = self.supabase.table("team_members").select("*").eq("event_id", event_id).execute()
        return [TeamMember(**member) for member in result.data]

    # Crowd data operations
    async def record_crowd_data(self, event_id: str, venue_id: str, current_count: int) -> CrowdData:
        data = {
            "event_id": event_id,
            "venue_id": venue_id,
            "current_count": current_count
        }
        result = self.supabase.table("crowd_data").insert(data).execute()
        return CrowdData(**result.data[0])

    async def get_crowd_data(self, event_id: str, venue_id: str) -> List[CrowdData]:
        result = self.supabase.table("crowd_data").select("*").eq("event_id", event_id).eq("venue_id", venue_id).execute()
        return [CrowdData(**data) for data in result.data]

    # Alert operations
    async def create_alert(self, event_id: str, alert_type: str, message: str, severity: str) -> Alert:
        data = {
            "event_id": event_id,
            "type": alert_type,
            "message": message,
            "severity": severity
        }
        result = self.supabase.table("alerts").insert(data).execute()
        return Alert(**result.data[0])

    async def get_alerts(self, event_id: str, resolved: Optional[bool] = None) -> List[Alert]:
        query = self.supabase.table("alerts").select("*").eq("event_id", event_id)
        if resolved is not None:
            query = query.eq("is_resolved", resolved)
        result = query.execute()
        return [Alert(**alert) for alert in result.data]

    async def resolve_alert(self, alert_id: str) -> Alert:
        data = {
            "is_resolved": True,
            "resolved_at": datetime.utcnow().isoformat()
        }
        result = self.supabase.table("alerts").update(data).eq("id", alert_id).execute()
        return Alert(**result.data[0]) 