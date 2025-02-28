import fp from 'fastify-plugin';
import { env } from '../env';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  }
}

const store: RateLimitStore = {};

export const rateLimitPlugin = fp(async (fastify) => {
  fastify.addHook('onRequest', async (request, reply) => {
    const key = request.ip;
    const now = Date.now();

    // Clean expired entries
    if (store[key] && store[key].resetTime <= now) {
      delete store[key];
    }

    // Initialize or increment counter
    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + env.RATE_LIMIT_WINDOW
      };
    } else {
      store[key].count++;
    }

    // Check limit
    if (store[key].count > env.RATE_LIMIT_MAX) {
      reply.code(429).send({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded'
      });
      return reply;
    }

    // Add headers
    reply.header('X-RateLimit-Limit', env.RATE_LIMIT_MAX);
    reply.header('X-RateLimit-Remaining', env.RATE_LIMIT_MAX - store[key].count);
    reply.header('X-RateLimit-Reset', store[key].resetTime);
  });
});