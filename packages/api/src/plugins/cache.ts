import fp from 'fastify-plugin';
import Redis from 'ioredis';
import { env } from '../env';

declare module 'fastify' {
  interface FastifyInstance {
    cache: Redis;
  }
}

export const cachePlugin = fp(async (fastify) => {
  const redis = new Redis(env.REDIS_URL);

  fastify.decorate('cache', redis);

  fastify.addHook('onClose', async () => {
    await redis.quit();
  });

  // Cache middleware
  fastify.decorateRequest('getFromCache', async function(key: string) {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  });

  fastify.decorateRequest('setInCache', async function(key: string, value: any, ttl?: number) {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await redis.setex(key, ttl, serialized);
    } else {
      await redis.set(key, serialized);
    }
  });
});