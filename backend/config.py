from supabase import create_client

SUPABASE_URL ="https://hxxxkgztjbxbrwrirpev.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4eHhrZ3p0amJ4YnJ3cmlycGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTE4NDIsImV4cCI6MjA1Nzk2Nzg0Mn0.Uq5LMGgJX_kiRq-4mvs36jTr8DbR3QxVlcOLXr0HOCc"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
