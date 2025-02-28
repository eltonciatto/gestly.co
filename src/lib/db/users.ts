import { query, queryOne } from './postgres';
import type { User } from './types';

export async function getUserById(id: string): Promise<User | null> {
  return queryOne<User>(
    'SELECT id, email, full_name, role, business_id FROM profiles WHERE id = $1',
    [id]
  );
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return queryOne<User>(
    'SELECT id, email, full_name, role, business_id FROM profiles WHERE email = $1',
    [email]
  );
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const result = await queryOne<User>(
    `INSERT INTO profiles (email, full_name, role) 
     VALUES ($1, $2, $3) 
     RETURNING id, email, full_name, role, business_id`,
    [user.email, user.full_name, user.role]
  );
  
  if (!result) {
    throw new Error('Failed to create user');
  }
  
  return result;
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  const fields = Object.keys(data)
    .map((key, i) => `${key} = $${i + 2}`)
    .join(', ');
    
  return queryOne<User>(
    `UPDATE profiles 
     SET ${fields} 
     WHERE id = $1 
     RETURNING id, email, full_name, role, business_id`,
    [id, ...Object.values(data)]
  );
}