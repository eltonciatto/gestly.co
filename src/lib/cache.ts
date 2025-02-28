import { Redis } from 'ioredis';
import { env } from './env';

const redis = new Redis(env.REDIS_URL);

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

export class Cache {
  static async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const prefixedKey = options.prefix ? `${options.prefix}:${key}` : key;
    const cached = await redis.get(prefixedKey);
    return cached ? JSON.parse(cached) : null;
  }

  static async set(key: string, value: any, options: CacheOptions = {}): Promise<void> {
    const prefixedKey = options.prefix ? `${options.prefix}:${key}` : key;
    const serialized = JSON.stringify(value);
    
    if (options.ttl) {
      await redis.setex(prefixedKey, options.ttl, serialized);
    } else {
      await redis.set(prefixedKey, serialized);
    }
  }

  static async delete(key: string, options: CacheOptions = {}): Promise<void> {
    const prefixedKey = options.prefix ? `${options.prefix}:${key}` : key;
    await redis.del(prefixedKey);
  }

  static async clear(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length) {
      await redis.del(...keys);
    }
  }
}