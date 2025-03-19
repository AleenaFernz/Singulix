# Singulix

A FastAPI backend service with Supabase authentication.

## Setup Instructions

1. Make sure you have Python 3.12+ installed
2. Clone the repository
3. Navigate to the backend directory:
   ```bash
   cd backend
   ```
4. Create and activate a virtual environment:
   ```bash
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate

   # On Unix or MacOS
   python -m venv venv
   source venv/bin/activate
   ```
5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
6. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

The server will start at `http://127.0.0.1:8000`

## API Endpoints

- `GET /`: Welcome message
- `POST /signup`: User registration
- `POST /login`: User authentication

## Environment Variables

The project uses Supabase for authentication. Make sure to set up your Supabase credentials in `config.py`.