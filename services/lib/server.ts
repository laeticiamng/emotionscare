import Fastify, { FastifyInstance } from 'fastify';
import authPlugin from './plugins/auth';
import loggingPlugin from './plugins/logging';
import errorHandlerPlugin from './plugins/error';

interface ServerOptions {
  registerRoutes: (app: FastifyInstance) => void | Promise<void>;
}

export function createServer({ registerRoutes }: ServerOptions) {
  const app = Fastify({ logger: true });

  app.register(loggingPlugin);
  app.register(errorHandlerPlugin);
  app.register(authPlugin);

  registerRoutes(app);

  return app;
}

export type { ServerOptions };
