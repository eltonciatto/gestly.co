import { apiClient } from '../api/client';

// This is now just a wrapper around the API client
// All actual database operations happen server-side
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const { data } = await apiClient.db.query({ text, params });
  return data;
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const { data } = await apiClient.db.queryOne({ text, params });
  return data;
}

export async function transaction<T>(callback: () => Promise<T>): Promise<T> {
  const { data } = await apiClient.db.transaction(callback);
  return data;
}

// No need for cleanup since we're not managing connections
export function closePool() {
  // No-op
}