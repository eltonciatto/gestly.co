import fp from 'fastify-plugin';
import { FastifyError } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';

export const errorHandler = fp(async (fastify) => {
  fastify.setErrorHandler((error: FastifyError, request, reply) => {
    request.log.error(error);

    // Validation errors
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: error.issues
      });
    }

    // Application errors
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: error.code,
        message: error.message
      });
    }

    // Database errors
    if (error.code?.startsWith('23')) {
      return reply.status(400).send({
        error: 'Database Error',
        message: 'Invalid data provided'
      });
    }

    // Default error
    reply.status(500).send({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  });
});