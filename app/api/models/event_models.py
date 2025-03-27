from pydantic import BaseModel
from typing import List, Optional
from datetime import date, time, datetime

class TicketType(BaseModel):
    name: str
    price: float
    quantity: int

class EventCreate(BaseModel):
    name: str
    description: str
    venue: str
    date: date
    time: time
    capacity: int
    ticket_types: List[TicketType]

class EventResponse(BaseModel):
    id: str
    name: str
    description: str
    venue: str
    date: date
    time: time
    capacity: int
    status: str
    created_by: str
    created_at: datetime 