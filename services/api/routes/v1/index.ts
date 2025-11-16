import { FastifyPluginAsync } from 'fastify';
import journalRoutes from './journal';
import healthRoutes from './health';
// import musicRoutes from './music';
// import assessmentRoutes from './assessments';

/**
 * API v1 Routes
 *
 * Registers all domain-specific route modules under /v1 prefix
 */

export const v1Routes: FastifyPluginAsync = async app => {
  // Health check routes (public)
  await app.register(healthRoutes, { prefix: '/health' });

  // Protected routes (require authentication)
  await app.register(journalRoutes, { prefix: '/journal' });
  // await app.register(musicRoutes, { prefix: '/music' });
  // await app.register(assessmentRoutes, { prefix: '/assessments' });

  app.log.info('API v1 routes registered');
};

export default v1Routes;
