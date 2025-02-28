export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'attendant';
  created_at: string;
  updated_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  user: User;
}

export type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED';