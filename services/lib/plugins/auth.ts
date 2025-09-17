import { FastifyPluginAsync } from 'fastify';
import { verifyJwt, TokenPayload } from '../jwt';

declare module 'fastify' {
  interface FastifyRequest {
    user: TokenPayload;
  }
}

export const authPlugin: FastifyPluginAsync = async app => {
  app.decorateRequest('user', null);
  app.addHook('preHandler', async (req, reply) => {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      reply.code(401).send({ ok: false, error: { code: 'unauthorized', message: 'Unauthorized' } });
      return;
    }
    try {
      const token = auth.slice(7);
      (req as any).user = await verifyJwt(token);
    } catch {
      reply.code(401).send({ ok: false, error: { code: 'unauthorized', message: 'Invalid token' } });
      return;
    }
  });
};

export default authPlugin;
