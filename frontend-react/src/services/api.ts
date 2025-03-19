import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AuthResponse {
  message: string;
  token?: string;
  user?: any;
}

export const authService = {
  async signup(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/signup', { email, password });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', { email, password });
    return response.data;
  },

  setToken(token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  removeToken() {
    delete api.defaults.headers.common['Authorization'];
  }
}; 