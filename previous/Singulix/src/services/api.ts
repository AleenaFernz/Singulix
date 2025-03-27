import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hxxxkgztjbxbrwrirpev.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4eHhrZ3p0amJ4YnJ3cmlycGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTE4NDIsImV4cCI6MjA1Nzk2Nzg0Mn0.Uq5LMGgJX_kiRq-4mvs36jTr8DbR3QxVlcOLXr0HOCc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface AuthResponse {
  message: string;
  session?: any;
  user?: any;
}

export const authService = {
  async signup(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    return {
      message: "Signup successful",
      session: data.session,
      user: data.user
    };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      message: "Login successful",
      session: data.session,
      user: data.user
    };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getSession() {
    return supabase.auth.getSession();
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}; 