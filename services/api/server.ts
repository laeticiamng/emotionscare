import Fastify from 'fastify';
import { VoiceSchema, TextSchema } from '../journal/lib/validate';
import { hash } from '../journal/lib/hash';
import { insertVoice, insertText, listFeed } from '../journal/lib/db';

export function createApp() {
  const app = Fastify();

  app.addHook('preHandler', async (req, reply) => {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      reply.code(401).send({ ok: false, error: { code: 'unauthorized', message: 'Unauthorized' } });
      return;
    }
    (req as any).user = { sub: auth.slice(7) };
  });

  const handleVoice = async (req: any, reply: any) => {
    const data = VoiceSchema.parse(req.body);
    const userHash = hash(req.user.sub);
    const row = insertVoice({ ...data, user_hash: userHash });
    reply.code(201).send({ ok: true, data: { id: row.id, ts: row.ts } });
  };

  const handleText = async (req: any, reply: any) => {
    const data = TextSchema.parse(req.body);
    const userHash = hash(req.user.sub);
    const row = insertText({ ...data, user_hash: userHash });
    reply.code(201).send({ ok: true, data: { id: row.id, ts: row.ts } });
  };

  app.post('/api/v1/journal/voice', handleVoice);
  app.post('/api/v1/journal/text', handleText);

  app.post('/journal_voice', async (req, reply) => {
    reply.header('X-Deprecated-Endpoint', 'true');
    await handleVoice(req, reply);
  });
  app.post('/journal_text', async (req, reply) => {
    reply.header('X-Deprecated-Endpoint', 'true');
    await handleText(req, reply);
  });

  app.get('/api/v1/me/journal', async (req: any, reply: any) => {
    const userHash = hash(req.user.sub);
    const entries = listFeed(userHash);
    reply.send({ ok: true, data: { entries, weekly: [] } });
  });

  return app;
}
