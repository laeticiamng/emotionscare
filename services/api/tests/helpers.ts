import Fastify, { type FastifyInstance } from 'fastify';

type RegisterFn = (app: FastifyInstance) => void;

type BuildOptions = {
  user?: { sub: string } | null;
};

export const buildTestApp = (register: RegisterFn, options: BuildOptions = {}) => {
  const app = Fastify();
  app.decorateRequest('user', null);

  if (options.user !== null) {
    app.addHook('onRequest', (req, _reply, done) => {
      (req as any).user = options.user ?? { sub: 'user_test' };
      done();
    });
  }

  register(app);
  return app;
};
