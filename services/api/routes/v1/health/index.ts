import { FastifyPluginAsync } from 'fastify';

/**
 * Health Check Routes
 *
 * Endpoints:
 * - GET /v1/health  - Basic health check
 * - GET /v1/healthz - Detailed health check with dependencies
 */

export const healthRoutes: FastifyPluginAsync = async app => {
  // Basic health check
  app.get('/', async (req, reply) => {
    return {
      ok: true,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    };
  });

  // Detailed health check
  app.get('/healthz', async (req, reply) => {
    const checks = {
      database: { ok: true, latency: 0 },
      supabase: { ok: true, latency: 0 },
    };

    // TODO: Implement actual health checks
    // checks.database = await checkDatabase();
    // checks.supabase = await checkSupabase();

    const allHealthy = Object.values(checks).every(c => c.ok);

    if (!allHealthy) {
      reply.code(503);
    }

    return {
      ok: allHealthy,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services: checks,
    };
  });
};

export default healthRoutes;
