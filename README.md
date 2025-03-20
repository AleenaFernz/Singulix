# Singulix

A comprehensive crowd control and event management system that helps event organizers manage large gatherings efficiently while ensuring crowd safety and compliance.

## Features

### For Event Organizers
- Event creation and management
- Time slot configuration
- Capacity management
- Entry criteria settings (age, gender, etc.)
- Dietary restrictions tracking
- Ticket purchase limits
- Multiple venue support
- Team member management
- Real-time crowd monitoring
- Alert system for crowd thresholds
- Team communication interface

### For Event Attendees
- User registration and authentication
- Event browsing and ticket purchase
- Time slot selection
- QR code generation
- Email notifications
- Ticket validation

### For Event Team
- Role-based access control
- Real-time crowd monitoring
- QR code scanning
- Team communication
- Emergency alerts

## Technical Stack

- Backend: FastAPI (Python)
- Frontend: React with TypeScript
- UI Framework: Material-UI
- Authentication: Supabase
- Database: Supabase (PostgreSQL)
- Real-time Updates: WebSocket
- Email Service: SMTP
- QR Code: qrcode library

## Prerequisites

- Python 3.8 or higher
- Node.js 14.0 or higher
- npm or yarn
- Git
- Supabase account
- SMTP server for email notifications

## Project Structure

```
Singulix/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── config.py
│   └── venv/
└── frontend-react/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    ├── public/
    ├── package.json
    └── tsconfig.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   python -m uvicorn main:app --reload
   ```

The backend server will run at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend application will run at `http://localhost:3000`

## Environment Variables

### Backend
Create a `.env` file in the backend directory with the following variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
```

### Frontend
Create a `.env` file in the frontend-react directory with the following variables:
```
REACT_APP_API_URL=http://127.0.0.1:8000
```

## API Endpoints

### Authentication
- `POST /signup` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user

### Event Management
- `POST /events` - Create new event
- `GET /events` - List all events
- `GET /events/{id}` - Get event details
- `PUT /events/{id}` - Update event
- `DELETE /events/{id}` - Delete event

### Ticket Management
- `POST /tickets` - Purchase tickets
- `GET /tickets` - List user's tickets
- `GET /tickets/{id}` - Get ticket details
- `POST /tickets/validate` - Validate ticket QR code

### Team Management
- `POST /team` - Add team member
- `GET /team` - List team members
- `PUT /team/{id}` - Update team member
- `DELETE /team/{id}` - Remove team member

## Development

- Backend API documentation is available at `http://127.0.0.1:8000/docs`
- Frontend hot-reload is enabled for development
- Real-time updates are handled through WebSocket connections

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.