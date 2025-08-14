import config from '../config/config';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  name: string;
  email: string;
  wallet: {
    address: string;
    balance: number;
    card: {
      dailyLimit: number;
      monthlyLimit: number;
      currentLimit: number;
    };
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async getGoogleAuthUrl(): Promise<string> {
    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/google/url`);
      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }
      const data = await response.json();
      return data.authUrl;
    } catch (error) {
      console.error('Error getting Google auth URL:', error);
      throw error;
    }
  }

  async handleGoogleCallback(code: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Google authentication failed');
      }

      const data: AuthResponse = await response.json();
      
      // Store tokens in cookies
      Cookies.set('accessToken', data.accessToken, { 
        expires: 1/24, // 1 hour
        secure: import.meta.env.PROD,
        sameSite: 'strict'
      });
      
      Cookies.set('refreshToken', data.refreshToken, { 
        expires: 7, // 7 days
        secure: import.meta.env.PROD,
        sameSite: 'strict'
      });

      // Store user data
      this.currentUser = data.user;
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Error handling Google callback:', error);
      throw error;
    }
  }

  async handleGoogleRedirect(code: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/google/redirect?code=${code}`);
      
      if (!response.ok) {
        throw new Error('Google redirect failed');
      }

      const data: AuthResponse = await response.json();
      
      // Store tokens in cookies
      Cookies.set('accessToken', data.accessToken, { 
        expires: 1/24, // 1 hour
        secure: import.meta.env.PROD,
        sameSite: 'strict'
      });
      
      Cookies.set('refreshToken', data.refreshToken, { 
        expires: 7, // 7 days
        secure: import.meta.env.PROD,
        sameSite: 'strict'
      });

      // Store user data
      this.currentUser = data.user;
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Error handling Google redirect:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    }
    return this.currentUser;
  }

  getAccessToken(): string | null {
    return Cookies.get('accessToken') || null;
  }

  getRefreshToken(): string | null {
    return Cookies.get('refreshToken') || null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getCurrentUser();
  }

  logout(): void {
    // Clear cookies
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    
    // Clear local storage
    localStorage.removeItem('user');
    
    // Clear current user
    this.currentUser = null;
  }

  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      // Update access token cookie
      Cookies.set('accessToken', data.accessToken, { 
        expires: 1/24, // 1 hour
        secure: import.meta.env.PROD,
        sameSite: 'strict'
      });

      return data.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      return null;
    }
  }
}

export const authService = AuthService.getInstance();
export default AuthService;
