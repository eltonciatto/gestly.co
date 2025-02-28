import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export const swaggerPlugin = fp(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Gestly API',
        description: 'API documentation for Gestly',
        version: '1.0.0',
        contact: {
          name: 'Gestly Support',
          email: 'support@gestly.co'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        },
        {
          url: 'https://api.gestly.co',
          description: 'Production server'
        }
      ],
      components: {
        schemas: {
          Appointment: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              customer_id: { type: 'string', format: 'uuid' },
              service_id: { type: 'string', format: 'uuid' },
              start_time: { type: 'string', format: 'date-time' },
              status: { type: 'string', enum: ['scheduled', 'confirmed', 'completed', 'cancelled'] }
            },
            required: ['customer_id', 'service_id', 'start_time']
          },
          Customer: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string', minLength: 3 },
              email: { type: 'string', format: 'email' },
              phone: { type: 'string', minLength: 10 }
            },
            required: ['name', 'phone']
          }
        },
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'none',
      deepLinking: true,
      displayRequestDuration: true,
      filter: true
    },
    staticCSP: true
  });
});