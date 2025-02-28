import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { hashPassword, comparePassword } from '../utils/auth';
import { AppError } from '../utils/errors';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3),
  business_name: z.string().min(3)
});

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Login
  fastify.post('/login', async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);

    const { rows } = await request.db.query(
      'SELECT id, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (!rows[0]) {
      throw AppError.unauthorized('Invalid credentials');
    }

    const validPassword = await comparePassword(password, rows[0].password_hash);
    if (!validPassword) {
      throw AppError.unauthorized('Invalid credentials');
    }

    const token = await reply.jwtSign(
      { sub: rows[0].id },
      { expiresIn: '1h' }
    );

    return { token };
  });

  // Register
  fastify.post('/register', async (request, reply) => {
    const data = registerSchema.parse(request.body);

    // Start transaction
    const client = await request.db.connect();
    try {
      await client.query('BEGIN');

      // Check if email exists
      const { rows } = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [data.email]
      );

      if (rows[0]) {
        throw AppError.conflict('Email already registered');
      }

      // Create user
      const hashedPassword = await hashPassword(data.password);
      const { rows: [user] } = await client.query(
        `INSERT INTO users (email, password_hash, full_name, role)
         VALUES ($1, $2, $3, 'admin')
         RETURNING id`,
        [data.email, hashedPassword, data.name]
      );

      // Create business
      await client.query(
        `INSERT INTO businesses (owner_id, name, api_key)
         VALUES ($1, $2, gen_random_uuid())`,
        [user.id, data.business_name]
      );

      await client.query('COMMIT');

      const token = await reply.jwtSign(
        { sub: user.id },
        { expiresIn: '1h' }
      );

      return { token };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  });

  // Refresh token
  fastify.post('/refresh', async (request, reply) => {
    try {
      await request.jwtVerify();
      
      const token = await reply.jwtSign(
        { sub: request.user.sub },
        { expiresIn: '1h' }
      );

      return { token };
    } catch (err) {
      throw AppError.unauthorized('Invalid refresh token');
    }
  });
};