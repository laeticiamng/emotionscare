import { FastifyPluginAsync } from 'fastify';
import healthRoutes from './health';

/**
 * API v1 Routes
 *
 * Registers all domain-specific route modules under /v1 prefix
 */

export const v1Routes: FastifyPluginAsync = async app => {
  // Health check routes (public)
  await app.register(healthRoutes, { prefix: '/health' });

  app.log.info('API v1 routes registered');
};

export default v1Routes;
