import type { DatabaseClient, AuthClient, DatabaseOperations } from '../types';

export class PostgresProvider implements DatabaseClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(connectionString: string) {
    // Parse connection string to get host/port/db
    const url = new URL(connectionString);
    this.baseUrl = `${url.protocol}//${url.host}${url.pathname}`;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${url.password}`
    };
  }

  get auth(): AuthClient {
    return {
      signUp: async (email: string, password: string, metadata?: any) => {
        const response = await fetch(`${this.baseUrl}/auth/signup`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({ email, password, metadata })
        });
        if (!response.ok) throw new Error('Signup failed');
        return await response.json();
      },

      signIn: async (email: string, password: string) => {
        const response = await fetch(`${this.baseUrl}/auth/signin`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error('Signin failed');
        return await response.json();
      },

      signOut: async () => {
        const response = await fetch(`${this.baseUrl}/auth/signout`, {
          method: 'POST',
          headers: this.headers
        });
        if (!response.ok) throw new Error('Signout failed');
      },

      getUser: async () => {
        const response = await fetch(`${this.baseUrl}/auth/user`, {
          headers: this.headers
        });
        if (!response.ok) return null;
        return await response.json();
      },

      onAuthStateChange: (callback) => {
        // Implement auth state change listener
        const unsubscribe = () => {};
        return unsubscribe;
      }
    };
  }

  get db(): DatabaseOperations {
    return {
      from: (table: string) => ({
        select: async (columns = '*') => {
          const response = await fetch(`${this.baseUrl}/${table}?select=${columns}`, {
            headers: this.headers
          });
          if (!response.ok) throw new Error('Query failed');
          return await response.json();
        },

        insert: async (data: any) => {
          const response = await fetch(`${this.baseUrl}/${table}`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data)
          });
          if (!response.ok) throw new Error('Insert failed');
          return await response.json();
        },

        update: async (data: any) => {
          const response = await fetch(`${this.baseUrl}/${table}`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify(data)
          });
          if (!response.ok) throw new Error('Update failed');
          return await response.json();
        },

        delete: async () => {
          const response = await fetch(`${this.baseUrl}/${table}`, {
            method: 'DELETE',
            headers: this.headers
          });
          if (!response.ok) throw new Error('Delete failed');
          return await response.json();
        },

        eq: (column: string, value: any) => this.db.from(table),
        neq: (column: string, value: any) => this.db.from(table),
        gt: (column: string, value: any) => this.db.from(table),
        lt: (column: string, value: any) => this.db.from(table),
        gte: (column: string, value: any) => this.db.from(table),
        lte: (column: string, value: any) => this.db.from(table),
        like: (column: string, pattern: string) => this.db.from(table),
        ilike: (column: string, pattern: string) => this.db.from(table),
        is: (column: string, value: any) => this.db.from(table),
        in: (column: string, values: any[]) => this.db.from(table),
        contains: (column: string, value: any) => this.db.from(table),
        containedBy: (column: string, value: any) => this.db.from(table),
        range: (column: string, from: any, to: any) => this.db.from(table),
        order: (column: string, options?: { ascending?: boolean }) => this.db.from(table),
        limit: (count: number) => this.db.from(table),
        single: async () => {
          const results = await this.db.from(table).select();
          return results[0];
        }
      }),

      rpc: async (fn: string, params?: any) => {
        const response = await fetch(`${this.baseUrl}/rpc/${fn}`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(params)
        });
        if (!response.ok) throw new Error('RPC call failed');
        return await response.json();
      }
    };
  }
}