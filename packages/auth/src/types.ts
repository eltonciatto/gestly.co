export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'attendant';
  businessId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  user: User;
}

export interface AuthConfig {
  jwtSecret: string;
  accessTokenExpiry?: string;
  refreshTokenExpiry?: string;
}

export type AuthResponse = {
  user: User | null;
  session: Session | null;
  error?: Error;
};