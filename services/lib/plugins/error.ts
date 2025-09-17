import { FastifyPluginAsync } from 'fastify';
import { ZodError } from 'zod';

export const errorHandlerPlugin: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((err, req, reply) => {
    req.log.error(err);

    if (err instanceof ZodError) {
      reply.code(422).send({
        ok: false,
        error: {
          code: 'invalid_payload',
          message: 'Payload validation failed',
          details: err.flatten(),
        },
      });
      return;
    }

    const statusCode = typeof (err as any).statusCode === 'number' ? (err as any).statusCode : 500;
    const code = statusCode === 401 ? 'unauthorized' : statusCode === 403 ? 'forbidden' : 'internal';
    const message = statusCode === 401
      ? 'Unauthorized'
      : statusCode === 403
        ? 'Forbidden'
        : 'Internal Server Error';

    reply.code(statusCode).send({ ok: false, error: { code, message } });
  });
};

export default errorHandlerPlugin;
