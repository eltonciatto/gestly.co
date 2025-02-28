import { sign, verify } from 'jsonwebtoken';
import { z } from 'zod';
import type { User, Session, AuthConfig, AuthResponse } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const defaultConfig: AuthConfig = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  accessTokenExpiry: '1h',
  refreshTokenExpiry: '7d'
};

export class Auth {
  private config: AuthConfig;

  constructor(config?: Partial<AuthConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  async signUp(data: { 
    email: string;
    password: string;
    name?: string;
    role?: 'admin' | 'attendant';
  }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      return result;
    } catch (error) {
      return { user: null, session: null, error: error as Error };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      return result;
    } catch (error) {
      return { user: null, session: null, error: error as Error };
    }
  }

  async signOut(session: Session): Promise<void> {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  async refreshSession(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Session refresh failed');
      }

      return result;
    } catch (error) {
      return { user: null, session: null, error: error as Error };
    }
  }

  async getUser(accessToken: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get user');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }
}

export const createAuth = (config?: Partial<AuthConfig>) => new Auth(config);