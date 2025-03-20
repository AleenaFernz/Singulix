from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    EVENT_MANAGER = "event_manager"
    CROWD_MANAGER = "crowd_manager"
    ATTENDEE = "attendee"

class DietaryRestriction(str, Enum):
    NONE = "none"
    VEGETARIAN = "vegetarian"
    VEGAN = "vegan"
    HALAL = "halal"
    KOSHER = "kosher"
    GLUTEN_FREE = "gluten_free"
    OTHER = "other"

class EventStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class Venue(BaseModel):
    id: str
    name: str
    address: str
    capacity: int
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TimeSlot(BaseModel):
    id: str
    event_id: str
    start_time: datetime
    end_time: datetime
    capacity: int
    current_bookings: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Event(BaseModel):
    id: str
    title: str
    description: str
    organizer_id: str
    venue_id: str
    start_date: datetime
    end_date: datetime
    status: EventStatus = EventStatus.DRAFT
    max_attendees: int
    max_tickets_per_user: int = 1
    age_restriction: Optional[tuple[int, int]] = None  # (min_age, max_age)
    gender_restriction: Optional[str] = None
    dietary_restrictions: List[DietaryRestriction] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Ticket(BaseModel):
    id: str
    event_id: str
    user_id: str
    time_slot_id: str
    qr_code: str
    is_valid: bool = True
    entry_time: Optional[datetime] = None
    dietary_restrictions: List[DietaryRestriction] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TeamMember(BaseModel):
    id: str
    event_id: str
    user_id: str
    role: UserRole
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CrowdData(BaseModel):
    id: str
    event_id: str
    venue_id: str
    current_count: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Alert(BaseModel):
    id: str
    event_id: str
    type: str  # "crowd_threshold", "late_entry", "emergency"
    message: str
    severity: str  # "low", "medium", "high"
    is_resolved: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None

class EventCreate(BaseModel):
    title: str
    description: str
    venue_id: str
    start_date: datetime
    end_date: datetime
    max_attendees: int
    max_tickets_per_user: int = 1
    age_restriction: Optional[tuple[int, int]] = None
    gender_restriction: Optional[str] = None
    dietary_restrictions: List[DietaryRestriction] = []

class TimeSlotCreate(BaseModel):
    event_id: str
    start_time: datetime
    end_time: datetime
    capacity: int

class TicketCreate(BaseModel):
    event_id: str
    time_slot_id: str
    dietary_restrictions: List[DietaryRestriction] = []

class TeamMemberCreate(BaseModel):
    event_id: str
    user_id: str
    role: UserRole

class VenueCreate(BaseModel):
    name: str
    address: str
    capacity: int
    description: Optional[str] = None 