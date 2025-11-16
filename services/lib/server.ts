import Fastify, { FastifyInstance } from 'fastify';
import authPlugin from './plugins/auth';
import loggingPlugin from './plugins/logging';
import errorHandlerPlugin from './plugins/error';
import securityPlugin from './plugins/security';
import envValidationPlugin from './plugins/env';

interface ServerOptions {
  registerRoutes: (app: FastifyInstance) => void | Promise<void>;
}

export function createServer({ registerRoutes }: ServerOptions) {
  const app = Fastify({ logger: true });

  // Validate environment configuration before anything else
  app.register(envValidationPlugin);

  // Register core plugins
  app.register(loggingPlugin);
  app.register(errorHandlerPlugin);
  app.register(securityPlugin);
  app.register(authPlugin);

  // Register application routes
  registerRoutes(app);

  return app;
}

export type { ServerOptions };
