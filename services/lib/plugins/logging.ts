import { FastifyPluginAsync } from 'fastify';

export const loggingPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('onRequest', (req, _reply, done) => {
    app.log.info({ method: req.method, url: req.url });
    done();
  });
};

export default loggingPlugin;
