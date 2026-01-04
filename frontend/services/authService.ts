const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
  id: number;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

class AuthService {
  private readonly TOKEN_KEY = 'snaplink_token';
  private readonly USER_KEY = 'snaplink_user';

  // Get token from localStorage
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get user from localStorage
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Save token and user to localStorage
  private saveAuth(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Clear authentication data
  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Register new user
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        this.saveAuth(data.data.token, data.data.user);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        this.saveAuth(data.data.token, data.data.user);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  // Logout user
  logout(): void {
    this.clearAuth();
  }

  // Get current user from API
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(data.data.user));
        return data.data.user;
      }

      // Token is invalid, clear auth
      this.clearAuth();
      return null;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  // Get authorization header
  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
