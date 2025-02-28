import { Redis } from 'ioredis';
import { env } from './env';

const redis = new Redis(env.REDIS_URL);
const MAX_RETRIES = 3;

interface QueueOptions {
  attempts?: number;
  backoff?: {
    type: 'fixed' | 'exponential';
    delay: number;
  };
}

export class Queue {
  static async add(
    queue: string,
    data: any,
    options: QueueOptions = {}
  ): Promise<string> {
    const id = crypto.randomUUID();
    const job = {
      id,
      data,
      attempts: 0,
      maxAttempts: options.attempts || MAX_RETRIES,
      backoff: options.backoff || { type: 'exponential', delay: 1000 },
      createdAt: new Date().toISOString()
    };

    await redis.lpush(queue, JSON.stringify(job));
    return id;
  }

  static async process(
    queue: string,
    handler: (data: any) => Promise<void>
  ): Promise<void> {
    while (true) {
      const job = await redis.rpop(queue);
      if (!job) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      const { id, data, attempts, maxAttempts, backoff } = JSON.parse(job);

      try {
        await handler(data);
      } catch (error) {
        console.error(`Error processing job ${id}:`, error);

        if (attempts < maxAttempts) {
          const delay = backoff.type === 'exponential'
            ? backoff.delay * Math.pow(2, attempts)
            : backoff.delay;

          await new Promise(resolve => setTimeout(resolve, delay));
          await Queue.add(queue, data, {
            attempts: maxAttempts,
            backoff
          });
        }
      }
    }
  }
}