import { FastifyPluginAsync } from 'fastify';

export const errorHandlerPlugin: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((err, req, reply) => {
    req.log.error(err);
    reply.code(500).send({ ok: false, error: { code: 'internal', message: 'Internal Server Error' } });
  });
};

export default errorHandlerPlugin;
