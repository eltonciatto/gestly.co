import fp from 'fastify-plugin';
import { pino } from 'pino';
import { env } from '../env';

export const monitoringPlugin = fp(async (fastify) => {
  // Configure structured logging
  const logger = pino({
    level: env.LOG_LEVEL,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  });

  // Add request logging
  fastify.addHook('onRequest', (request, reply, done) => {
    request.log = logger.child({ 
      requestId: request.id,
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      businessId: request.user?.business_id
    });
    done();
  });

  // Add response logging
  fastify.addHook('onResponse', (request, reply, done) => {
    request.log.info({
      statusCode: reply.statusCode,
      responseTime: reply.getResponseTime(),
      contentLength: reply.getHeader('content-length'),
      cached: reply.getHeader('x-cache') === 'HIT'
    });
    done();
  });

  // Add error logging
  fastify.setErrorHandler((error, request, reply) => {
    request.log.error({
      err: error,
      stack: error.stack,
      context: {
        path: request.url,
        params: request.params,
        query: request.query,
        body: request.body
      }
    });
    reply.send(error);
  });
});