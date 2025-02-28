import { Pool } from 'pg';
import { env } from '../env';

let pool: Pool | null = null;

export function getDB() {
  if (!pool) {
    pool = new Pool({
      connectionString: env.VITE_POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    pool.query('SELECT NOW()')
      .then(() => console.log('Database connected'))
      .catch(err => console.error('Database connection error:', err));
  }
  return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await getDB().connect();
  try {
    const { rows } = await client.query(text, params);
    return rows;
  } finally {
    client.release();
  }
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

export async function transaction<T>(callback: (client: Pool) => Promise<T>): Promise<T> {
  const client = await getDB().connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// Add cleanup function
export function closeDB() {
  if (pool) {
    pool.end();
    pool = null;
  }
}