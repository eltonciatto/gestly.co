export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'attendant';
  business_id?: string;
}

export interface Session {
  access_token: string;
  expires_at?: number;
  user: User;
}

export interface DatabaseError extends Error {
  code?: string;
  detail?: string;
  table?: string;
  constraint?: string;
}

export interface DatabaseResponse<T = any> {
  data: T | null;
  error: DatabaseError | null;
  count?: number;
  status?: number;
}

export interface AuthClient {
  signUp: (email: string, password: string, metadata?: any) => Promise<DatabaseResponse>;
  signIn: (email: string, password?: string) => Promise<DatabaseResponse>;
  signOut: () => Promise<DatabaseResponse>;
  getUser: () => Promise<User | null>;
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => () => void;
  refreshSession: (refreshToken: string) => Promise<DatabaseResponse>;
}

export interface DatabaseOperations {
  from: (table: string) => {
    select: (columns?: string) => Promise<any[]>;
    insert: (data: any) => Promise<any>;
    update: (data: any) => Promise<any>;
    delete: () => Promise<any>;
    count: () => Promise<number>;
    eq: (column: string, value: any) => any;
    neq: (column: string, value: any) => any;
    gt: (column: string, value: any) => any;
    lt: (column: string, value: any) => any;
    gte: (column: string, value: any) => any;
    lte: (column: string, value: any) => any;
    like: (column: string, pattern: string) => any;
    ilike: (column: string, pattern: string) => any;
    is: (column: string, value: any) => any;
    in: (column: string, values: any[]) => any;
    contains: (column: string, value: any) => any;
    containedBy: (column: string, value: any) => any;
    range: (column: string, from: any, to: any) => any;
    order: (column: string, options?: { ascending?: boolean }) => any;
    limit: (count: number) => any;
    single: () => Promise<any>;
  };
  rpc: (fn: string, params?: any) => Promise<any>;
}

export interface DatabaseClient {
  auth: AuthClient;
  db: DatabaseOperations;
}