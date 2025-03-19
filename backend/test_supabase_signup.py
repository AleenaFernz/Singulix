import requests

SUPABASE_URL = "https://hxxxkgztjbxbrwrirpev.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4eHhrZ3p0amJ4YnJ3cmlycGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTE4NDIsImV4cCI6MjA1Nzk2Nzg0Mn0.Uq5LMGgJX_kiRq-4mvs36jTr8DbR3QxVlcOLXr0HOCc"

signup_url = f"{SUPABASE_URL}/auth/v1/signup"

headers = {
    "apikey": SUPABASE_KEY,
    "Content-Type": "application/json"
}

data = {
    "email": "newuser123@gmail.com",
    "password": "SecurePassword123!"
}


response = requests.post(signup_url, json=data, headers=headers)

print("Supabase Response:", response.status_code, response.text)
