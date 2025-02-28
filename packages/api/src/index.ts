import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { Pool } from 'pg';
import { env } from './env';
import { appointmentsRoutes } from './routes/appointments';
import { customersRoutes } from './routes/customers';
import { servicesRoutes } from './routes/services';
import { authRoutes } from './routes/auth';
import { reportsRoutes } from './routes/reports';
import { rateLimitPlugin } from './plugins/rate-limit';
import { errorHandler } from './plugins/error-handler';
import { validateSession } from './plugins/auth';

// Create database pool
const pool = new Pool({
  connectionString: env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Create Fastify instance
const app = fastify({
  logger: true,
  trustProxy: true
});

// Register plugins
app.register(cors, {
  origin: env.CORS_ORIGIN,
  credentials: true
});

app.register(jwt, {
  secret: env.JWT_SECRET
});

app.register(rateLimitPlugin);
app.register(errorHandler);

// Add database to request
app.decorateRequest('db', null);
app.addHook('onRequest', async (request) => {
  request.db = pool;
});

// Register routes
app.register(authRoutes, { prefix: '/api/v1/auth' });
app.register(appointmentsRoutes, { prefix: '/api/v1/appointments' });
app.register(customersRoutes, { prefix: '/api/v1/customers' });
app.register(servicesRoutes, { prefix: '/api/v1/services' });
app.register(reportsRoutes, { prefix: '/api/v1/reports' });

// Add authentication to protected routes
app.addHook('onRequest', validateSession);

// Start server
const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    app.log.info(`Server listening on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();