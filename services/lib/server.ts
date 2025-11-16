import Fastify, { FastifyInstance } from 'fastify';
import authPlugin from './plugins/auth';
import loggingPlugin from './plugins/logging';
import errorHandlerPlugin from './plugins/error';
import securityPlugin from './plugins/security';
import envValidationPlugin from './plugins/env';
import rateLimitPlugin from './plugins/rateLimit';

interface ServerOptions {
  registerRoutes: (app: FastifyInstance) => void | Promise<void>;
  enableRateLimiting?: boolean;
}

export function createServer({ registerRoutes, enableRateLimiting = true }: ServerOptions) {
  const app = Fastify({ logger: true });

  // Validate environment configuration before anything else
  app.register(envValidationPlugin);

  // Register core plugins
  app.register(loggingPlugin);
  app.register(errorHandlerPlugin);
  app.register(securityPlugin);
  app.register(authPlugin);

  // Register rate limiting (after auth to use user ID as key)
  if (enableRateLimiting) {
    app.register(rateLimitPlugin);
  }

  // Register application routes
  registerRoutes(app);

  return app;
}

export type { ServerOptions };
