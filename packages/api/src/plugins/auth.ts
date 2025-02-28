import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../utils/errors';

const PUBLIC_ROUTES = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/refresh'
];

export async function validateSession(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Skip auth for public routes
    if (PUBLIC_ROUTES.includes(request.routerPath)) {
      return;
    }

    // Verify token
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new AppError('No token provided', 'unauthorized', 401);
    }

    try {
      const decoded = await request.jwtVerify();
      request.user = decoded;
    } catch (err) {
      throw new AppError('Invalid or expired token', 'unauthorized', 401);
    }

    // Check if user exists and is active
    const { rows } = await request.db.query(
      'SELECT id, role FROM users WHERE id = $1 AND is_active = true',
      [request.user.sub]
    );

    if (!rows[0]) {
      throw new AppError('User not found or inactive', 'unauthorized', 401);
    }

    request.user.role = rows[0].role;

  } catch (error) {
    reply.send(error);
  }
}