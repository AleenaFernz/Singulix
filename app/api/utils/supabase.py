from supabase import create_client, Client
import os
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

# Load environment variables from the root directory
load_dotenv()

# Supabase Configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error(f"SUPABASE_URL: {'Set' if SUPABASE_URL else 'Not set'}")
    logger.error(f"SUPABASE_KEY: {'Set' if SUPABASE_KEY else 'Not set'}")
    raise ValueError("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables must be set")

def get_supabase_client() -> Client:
    """
    Get a Supabase client instance.
    
    Returns:
        Client: A configured Supabase client
    """
    try:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        logger.error(f"Error creating Supabase client: {str(e)}")
        raise