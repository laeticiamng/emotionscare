import { FastifyPluginAsync } from 'fastify';
import rateLimit from '@fastify/rate-limit';

/**
 * Rate Limiting Plugin
 *
 * Protects the API from abuse by limiting the number of requests
 * per IP address within a time window.
 *
 * Configuration via environment variables:
 * - RATE_LIMIT_MAX: Maximum requests per time window (default: 100)
 * - RATE_LIMIT_WINDOW: Time window in milliseconds (default: 15 minutes)
 * - REDIS_URL: Optional Redis connection for distributed rate limiting
 */

export const rateLimitPlugin: FastifyPluginAsync = async app => {
  const maxRequests = process.env.RATE_LIMIT_MAX
    ? parseInt(process.env.RATE_LIMIT_MAX, 10)
    : 100;

  const timeWindow = process.env.RATE_LIMIT_WINDOW
    ? parseInt(process.env.RATE_LIMIT_WINDOW, 10)
    : 15 * 60 * 1000; // 15 minutes

  // Allow-list for IPs that should bypass rate limiting
  const allowList = process.env.RATE_LIMIT_ALLOWLIST
    ? process.env.RATE_LIMIT_ALLOWLIST.split(',').map(ip => ip.trim())
    : ['127.0.0.1', '::1'];

  await app.register(rateLimit, {
    max: maxRequests,
    timeWindow,
    cache: 10000, // Keep 10k IPs in memory
    allowList,

    // Optional: Use Redis for distributed rate limiting
    // redis: process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : undefined,

    errorResponseBuilder: (req, context) => {
      const remaining = context.max && context.ttl ? Math.max(0, context.max - (req as any).rateLimit?.current || 0) : 0;
      return {
        ok: false,
        error: {
          code: 'rate_limit_exceeded',
          message: `Too many requests. Please try again later.`,
          statusCode: 429,
          details: {
            limit: context.max,
            remaining,
            reset: new Date(Date.now() + (context.ttl || 0)),
          },
        },
      };
    },

    // Custom key generator (default is IP address)
    keyGenerator: (req: any) => {
      // Use authenticated user ID if available, otherwise IP
      return req.user?.id || req.ip;
    },
  });

  app.log.info(
    {
      maxRequests,
      timeWindow: `${timeWindow / 1000}s`,
      allowList,
    },
    'Rate limiting plugin registered'
  );
};

export default rateLimitPlugin;
