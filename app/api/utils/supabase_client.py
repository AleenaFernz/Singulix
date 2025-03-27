import os
import logging
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

logger = logging.getLogger(__name__)

# Load environment variables
env_path = Path(__file__).resolve().parent.parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

_supabase_client = None

def get_supabase_client() -> Client:
    global _supabase_client
    if _supabase_client is None:
        supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
        
        logger.debug(f"Initializing Supabase client with URL: {supabase_url}")
        if not supabase_url or not supabase_key:
            raise ValueError("Supabase URL and key must be set in environment variables")
            
        _supabase_client = create_client(supabase_url, supabase_key)
    return _supabase_client 