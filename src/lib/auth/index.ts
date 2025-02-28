import { z } from 'zod';
import { sendEmail } from '../email';
import { env } from '../env';
import { AppError } from '../error';
import { generateToken, verifyToken, hashPassword, comparePassword } from './utils';
import type { User, Session } from './types';

// Schemas de validação
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().optional(),
  name: z.string().optional(),
  role: z.enum(['admin', 'attendant']).default('admin')
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().optional()
});

export class Auth {
  constructor(private readonly db: any) {}

  async signUp(data: z.infer<typeof registerSchema>): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { email, password, name, role } = registerSchema.parse(data);

      // Verificar se usuário já existe
      const existingUser = await this.db.db
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new AppError('Email já cadastrado', 'email_exists');
      }

      // Criar usuário
      const user = await this.db.db
        .from('users')
        .insert({
          email,
          password: password ? await hashPassword(password) : null,
          name: name || email.split('@')[0],
          role
        })
        .select()
        .single();

      return { user, error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { 
        user: null, 
        error: error instanceof Error ? error : new Error('Erro ao criar conta')
      };
    }
  }

  async signIn(data: z.infer<typeof loginSchema>): Promise<{ session: Session | null; error: Error | null }> {
    try {
      const { email, password } = loginSchema.parse(data);

      // Se não tiver senha, enviar magic link
      if (!password) {
        return this.signInWithMagicLink(email);
      }

      // Buscar usuário
      const user = await this.db.db
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (!user) {
        throw new AppError('Email ou senha inválidos', 'invalid_credentials');
      }

      // Verificar senha
      const validPassword = await comparePassword(password, user.password);
      if (!validPassword) {
        throw new AppError('Email ou senha inválidos', 'invalid_credentials');
      }

      // Criar sessão
      const session = {
        access_token: generateToken({ userId: user.id, type: 'access' }),
        refresh_token: generateToken({ userId: user.id, type: 'refresh' }),
        user
      };

      return { session, error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      return {
        session: null,
        error: error instanceof Error ? error : new Error('Erro ao fazer login')
      };
    }
  }

  async signInWithMagicLink(email: string): Promise<{ session: Session | null; error: Error | null }> {
    try {
      // Gerar token
      const token = generateToken({ email, type: 'magic_link' });
      const magicLink = `${env.VITE_APP_URL}/auth/confirm?token=${token}`;

      // Enviar email
      await sendEmail({
        to: email,
        subject: 'Link de Acesso - Gestly',
        html: `
          <h2>Link de Acesso</h2>
          <p>Clique no link abaixo para acessar sua conta:</p>
          <a href="${magicLink}">Acessar Conta</a>
        `
      });

      return { session: null, error: null };
    } catch (error) {
      console.error('Error in signInWithMagicLink:', error);
      return {
        session: null,
        error: error instanceof Error ? error : new Error('Erro ao enviar magic link')
      };
    }
  }

  async signOut(): Promise<{ error: Error | null }> {
    // Como a sessão é mantida no cliente, apenas retornamos sucesso
    return { error: null };
  }
}