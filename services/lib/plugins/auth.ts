import { FastifyPluginAsync } from 'fastify';
import { verifyJwt, TokenPayload } from '../jwt';

declare module 'fastify' {
  interface FastifyRequest {
    user: TokenPayload;
  }
}

const PUBLIC_PATHS = new Set(['/health', '/healthz', '/api/healthz']);

export const authPlugin: FastifyPluginAsync = async app => {
  app.decorateRequest('user', null);
  app.addHook('preHandler', async (req, reply) => {
    const routePath = req.routerPath || req.url.split('?')[0];
    if (PUBLIC_PATHS.has(routePath)) {
      return;
    }

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
