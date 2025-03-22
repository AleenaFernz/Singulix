from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from enum import Enum
from uuid import UUID

class User(BaseModel):
    id: str
    email: str
    password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

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

class EventBase(BaseModel):
    title: str
    description: str
    location: str
    max_tickets: int
    price: float

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: UUID
    organizer_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TicketBase(BaseModel):
    event_id: UUID
    time_slot_id: Optional[UUID]

class TicketCreate(TicketBase):
    pass

class Ticket(TicketBase):
    id: UUID
    user_id: str
    qr_code: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

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

class TimeSlotCreate(BaseModel):
    event_id: str
    start_time: datetime
    end_time: datetime
    capacity: int

class TeamMemberCreate(BaseModel):
    event_id: str
    user_id: str
    role: UserRole

class VenueCreate(BaseModel):
    name: str
    address: str
    capacity: int
    description: Optional[str] = None 