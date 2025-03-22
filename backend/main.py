from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import os
from dotenv import load_dotenv
import qrcode
import io
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import aiosmtplib
from jinja2 import Environment, FileSystemLoader
import json
from supabase import create_client, Client

from models import *
from database import Database

# Load environment variables
load_dotenv()

app = FastAPI(title="Singulix API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
db = Database()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# Dependency to get current user from Supabase JWT
async def get_current_user(request: Request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        # Verify JWT token with Supabase
        jwt = auth_header.split(' ')[1]
        user = supabase.auth.get_user(jwt)
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

# Email configuration
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# Initialize Jinja2 environment for email templates
env = Environment(loader=FileSystemLoader("templates"))

async def send_email(to_email: str, subject: str, template_name: str, context: dict):
    """Send email using SMTP"""
    template = env.get_template(template_name)
    html_content = template.render(**context)
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    
    msg.attach(MIMEText(html_content, "html"))
    
    await aiosmtplib.send(
        msg,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        username=SMTP_USER,
        password=SMTP_PASSWORD,
        use_tls=True
    )

def generate_qr_code(data: str) -> str:
    """Generate QR code and return base64 encoded image"""
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

# Venue routes
@app.post("/venues", response_model=Venue)
async def create_venue(venue: VenueCreate):
    return await db.create_venue(venue)

@app.get("/venues", response_model=List[Venue])
async def list_venues():
    return await db.list_venues()

@app.get("/venues/{venue_id}", response_model=Venue)
async def get_venue(venue_id: str):
    venue = await db.get_venue(venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue

# Event routes
@app.post("/events", response_model=Event)
async def create_event(event: EventCreate, current_user: dict = Depends(get_current_user)):
    return await db.create_event(event, current_user["id"])

@app.get("/events", response_model=List[Event])
async def list_events(organizer_id: Optional[str] = None):
    return await db.list_events(organizer_id)

@app.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: str):
    event = await db.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

# Time slot routes
@app.post("/time-slots", response_model=TimeSlot)
async def create_time_slot(time_slot: TimeSlotCreate):
    return await db.create_time_slot(time_slot)

@app.get("/time-slots/{event_id}", response_model=List[TimeSlot])
async def list_time_slots(event_id: str):
    return await db.list_time_slots(event_id)

# Ticket routes
@app.post("/tickets", response_model=Ticket)
async def create_ticket(ticket: TicketCreate, current_user: dict = Depends(get_current_user)):
    # Generate QR code
    qr_data = {
        "ticket_id": str(ticket.id),
        "event_id": ticket.event_id,
        "time_slot_id": ticket.time_slot_id,
        "user_id": current_user["id"]
    }
    qr_code = generate_qr_code(json.dumps(qr_data))
    
    # Create ticket
    ticket_obj = await db.create_ticket(ticket, current_user["id"], qr_code)
    
    # Send email with ticket details
    event = await db.get_event(ticket.event_id)
    time_slot = await db.get_time_slot(ticket.time_slot_id)
    
    await send_email(
        current_user["email"],
        "Your Event Ticket",
        "ticket_email.html",
        {
            "event": event,
            "time_slot": time_slot,
            "ticket": ticket_obj,
            "qr_code": qr_code
        }
    )
    
    return ticket_obj

@app.get("/tickets/{ticket_id}", response_model=Ticket)
async def get_ticket(ticket_id: str, current_user: dict = Depends(get_current_user)):
    ticket = await db.get_ticket(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if ticket.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to view this ticket")
    return ticket

@app.post("/tickets/validate/{qr_code}", response_model=Ticket)
async def validate_ticket(qr_code: str):
    ticket = await db.validate_ticket(qr_code)
    if not ticket:
        raise HTTPException(status_code=404, detail="Invalid ticket")
    if not ticket.is_valid:
        raise HTTPException(status_code=400, detail="Ticket is not valid")
    return ticket

# Team member routes
@app.post("/team", response_model=TeamMember)
async def add_team_member(team_member: TeamMemberCreate):
    return await db.add_team_member(team_member)

@app.get("/team/{event_id}", response_model=List[TeamMember])
async def get_team_members(event_id: str):
    return await db.get_team_members(event_id)

# Crowd data routes
@app.post("/crowd-data")
async def record_crowd_data(event_id: str, venue_id: str, current_count: int):
    crowd_data = await db.record_crowd_data(event_id, venue_id, current_count)
    
    # Check if crowd count exceeds threshold
    venue = await db.get_venue(venue_id)
    if current_count > venue.capacity * 0.8:  # 80% threshold
        await db.create_alert(
            event_id,
            "crowd_threshold",
            f"Crowd count ({current_count}) exceeds 80% of venue capacity ({venue.capacity})",
            "high"
        )
    
    return crowd_data

@app.get("/crowd-data/{event_id}/{venue_id}")
async def get_crowd_data(event_id: str, venue_id: str):
    return await db.get_crowd_data(event_id, venue_id)

# Alert routes
@app.get("/alerts/{event_id}")
async def get_alerts(event_id: str, resolved: Optional[bool] = None):
    return await db.get_alerts(event_id, resolved)

@app.post("/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: str):
    return await db.resolve_alert(alert_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
