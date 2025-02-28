import { env } from '../env';
import { AppError } from '../error';
import { query } from '../db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const JWT_SECRET = env.VITE_JWT_SECRET;
const TOKEN_EXPIRY = {
  access: '1h',
  refresh: '7d',
  magic: '30m'
};

interface TokenPayload {
  sub: string;
  type: 'access' | 'refresh' | 'magic';
  email?: string;
  exp?: number;
}

export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial');

export async function generateToken(payload: TokenPayload): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + getExpirySeconds(payload.type);
  
  // Store token in database for magic links
  if (payload.type === 'magic') {
    await query(
      `INSERT INTO auth_tokens (token, user_id, type, expires_at)
       VALUES ($1, $2, $3, to_timestamp($4))`,
      [crypto.randomUUID(), payload.sub, payload.type, exp]
    );
  }

  return jwt.sign({ ...payload, exp }, JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // Verify token in database for magic links
    if (decoded.type === 'magic') {
      const valid = await query(
        `SELECT id FROM auth_tokens 
         WHERE token = $1 AND expires_at > NOW()`,
        [token]
      );
      if (!valid.length) return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export async function invalidateToken(token: string): Promise<void> {
  await query(
    'DELETE FROM auth_tokens WHERE token = $1',
    [token]
  );
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function getExpirySeconds(type: TokenPayload['type']): number {
  const duration = TOKEN_EXPIRY[type];
  const hours = parseInt(duration);
  return hours * 60 * 60;
}