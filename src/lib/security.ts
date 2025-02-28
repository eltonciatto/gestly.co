import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Schema para validação de senha
export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial');

// Cache para tentativas de login (em memória)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

// Configurações de rate limit
const RATE_LIMIT = {
  MAX_ATTEMPTS: 5,
  WINDOW_MS: 15 * 60 * 1000, // 15 minutos
  BLOCK_DURATION_MS: 30 * 60 * 1000, // 30 minutos
};

export async function checkRateLimit(identifier: string): Promise<boolean> {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);

  // Limpar tentativas antigas
  if (attempts && now - attempts.lastAttempt > RATE_LIMIT.WINDOW_MS) {
    loginAttempts.delete(identifier);
    return true;
  }

  // Verificar bloqueio
  if (attempts && attempts.count >= RATE_LIMIT.MAX_ATTEMPTS) {
    const timeLeft = RATE_LIMIT.BLOCK_DURATION_MS - (now - attempts.lastAttempt);
    if (timeLeft > 0) {
      throw new Error(`Muitas tentativas. Tente novamente em ${Math.ceil(timeLeft / 60000)} minutos.`);
    }
    loginAttempts.delete(identifier);
    return true;
  }

  return true;
}

export function recordLoginAttempt(identifier: string, success: boolean) {
  if (success) {
    loginAttempts.delete(identifier);
    return;
  }

  const attempts = loginAttempts.get(identifier) || { count: 0, lastAttempt: 0 };
  loginAttempts.set(identifier, {
    count: attempts.count + 1,
    lastAttempt: Date.now(),
  });
}

// Função para validar força da senha
export function validatePassword(password: string) {
  return passwordSchema.safeParse(password);
}

// Função para gerar senha temporária segura
export function generateTempPassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Garantir pelo menos um de cada tipo
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)];

  // Completar o resto da senha
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  return password;
}