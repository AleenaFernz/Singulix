from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from config import supabase

app = FastAPI()

class UserAuth(BaseModel):
    email: str
    password: str

@app.post("/signup")
def signup(user: UserAuth):
    """Registers a new user with Supabase authentication and assigns a default role."""
    print("Received signup request:", user.email)

    try:
        user_email = user.email.strip()
        print("Formatted Email:", user_email)  # Debugging

        # Supabase signup request
        response = supabase.auth.sign_up({
            "email": user_email,
            "password": user.password
        })

        print("Supabase Response:", response)  # Debugging

        # Convert response to a dictionary
        response_dict = response.__dict__

        # If Supabase returns an error
        if response_dict.get("error"):
            print("Supabase Error:", response_dict["error"])
            raise HTTPException(status_code=400, detail=response_dict["error"].get("message", "Signup failed."))

        # Ensure the user object exists
        if not response_dict.get("user"):
            raise HTTPException(status_code=500, detail="User registration failed in Supabase.")

        # Get user ID
        user_id = response_dict["user"].id

        # Assign default role as 'user' in Supabase metadata
        update_response = supabase.table("users").update({"role": "user"}).eq("id", user_id).execute()
        
        print("Updated Role Response:", update_response)  # Debugging

        return {"message": "User registered successfully with role 'user'!", "user": response_dict["user"]}

    except Exception as e:
        print("Signup error:", str(e))  # Debugging
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")




@app.post("/login")
def login(user: UserAuth):
    """Authenticates a user and returns JWT token."""
    print("Login attempt for:", user.email)

    try:
        user_email = user.email.strip()
        
        # Supabase login request
        response = supabase.auth.sign_in_with_password({
            "email": user_email,
            "password": user.password
        })

        print("Supabase Response:", response)  # Debugging

        # Convert response to a dictionary
        response_dict = response.__dict__

        # If Supabase returns an error
        if hasattr(response, "error") and response.error:
            print("Supabase Error:", response.error)
            raise HTTPException(status_code=400, detail=response.error.get("message", "Invalid login credentials."))

        # Ensure session exists
        if not hasattr(response, "session") or not response.session:
            raise HTTPException(status_code=500, detail="Login failed, no session returned.")

        return {"message": "Login successful!", "token": response.session.access_token}

    except Exception as e:
        print("Login error:", str(e))  # Debugging
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/")
def home():
    return {"message": "Welcome to Singulix Backend!"}
