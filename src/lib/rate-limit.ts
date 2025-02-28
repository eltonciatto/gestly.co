import { Redis } from 'ioredis';
import { env } from './env';
import { AppError } from './error';

const redis = new Redis(env.REDIS_URL);

interface RateLimitOptions {
  points: number;     // Number of requests
  duration: number;   // Time window in seconds
  blockDuration?: number; // Block duration in seconds
}

export class RateLimit {
  static async check(
    key: string,
    options: RateLimitOptions
  ): Promise<void> {
    const current = await redis.get(key);
    
    // If key doesn't exist, create it
    if (!current) {
      await redis.setex(key, options.duration, '1');
      return;
    }

    const count = parseInt(current);
    
    // Check if limit exceeded
    if (count >= options.points) {
      // Check if already blocked
      const blocked = await redis.get(`${key}:blocked`);
      if (blocked) {
        throw new AppError(
          'Too many requests. Try again later.',
          'rate_limit',
          429
        );
      }

      // Block for specified duration
      if (options.blockDuration) {
        await redis.setex(
          `${key}:blocked`,
          options.blockDuration,
          'true'
        );
      }

      throw new AppError(
        'Rate limit exceeded',
        'rate_limit',
        429
      );
    }

    // Increment counter
    await redis.incr(key);
  }
}