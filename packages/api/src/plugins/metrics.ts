import fp from 'fastify-plugin';

interface Metrics {
  requests: {
    total: number;
    success: number;
    error: number;
    byEndpoint: Record<string, number>;
  };
  responseTime: {
    avg: number;
    min: number;
    max: number;
    p95: number;
  };
  errors: {
    count: number;
    byType: Record<string, number>;
  };
}

const metrics: Metrics = {
  requests: {
    total: 0,
    success: 0,
    error: 0,
    byEndpoint: {}
  },
  responseTime: {
    avg: 0,
    min: Infinity,
    max: 0,
    p95: 0
  },
  errors: {
    count: 0,
    byType: {}
  }
};

const responseTimes: number[] = [];

export const metricsPlugin = fp(async (fastify) => {
  // Track request metrics
  fastify.addHook('onRequest', (request) => {
    metrics.requests.total++;
    const endpoint = `${request.method} ${request.routerPath}`;
    metrics.requests.byEndpoint[endpoint] = (metrics.requests.byEndpoint[endpoint] || 0) + 1;
  });

  // Track response metrics
  fastify.addHook('onResponse', (request, reply) => {
    const responseTime = reply.getResponseTime();
    responseTimes.push(responseTime);

    // Update response time metrics
    metrics.responseTime.min = Math.min(metrics.responseTime.min, responseTime);
    metrics.responseTime.max = Math.max(metrics.responseTime.max, responseTime);
    
    const sum = responseTimes.reduce((a, b) => a + b, 0);
    metrics.responseTime.avg = sum / responseTimes.length;

    // Calculate p95
    const sorted = [...responseTimes].sort((a, b) => a - b);
    const idx = Math.ceil(sorted.length * 0.95) - 1;
    metrics.responseTime.p95 = sorted[idx] || 0;

    // Track success/error
    if (reply.statusCode >= 400) {
      metrics.requests.error++;
      metrics.errors.count++;
    } else {
      metrics.requests.success++;
    }
  });

  // Expose metrics endpoint
  fastify.get('/metrics', async () => {
    return {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      metrics
    };
  });
});