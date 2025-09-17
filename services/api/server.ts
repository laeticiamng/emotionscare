import { VoiceSchema, TextSchema } from '../journal/lib/validate';
import { hash } from '../journal/lib/hash';
import { insertVoice, insertText, listFeed } from '../journal/lib/db';
import { createServer } from '../lib/server';

type MaybePromise<T> = T | Promise<T>;

type InsertVoiceInput = Parameters<typeof insertVoice>[0];
type InsertVoiceOutput = Awaited<ReturnType<typeof insertVoice>>;
type InsertTextInput = Parameters<typeof insertText>[0];
type InsertTextOutput = Awaited<ReturnType<typeof insertText>>;
type ListFeedOutput = Awaited<ReturnType<typeof listFeed>>;

type JournalDb = {
  insertVoice: (data: InsertVoiceInput) => MaybePromise<InsertVoiceOutput>;
  insertText: (data: InsertTextInput) => MaybePromise<InsertTextOutput>;
  listFeed: (userHash: string) => MaybePromise<ListFeedOutput>;
};

type CreateAppOptions = {
  journalDb?: Partial<JournalDb>;
};

const defaultJournalDb: JournalDb = {
  insertVoice,
  insertText,
  listFeed,
};

export function createApp(options: CreateAppOptions = {}) {
  const journalDb: JournalDb = {
    insertVoice: options.journalDb?.insertVoice ?? defaultJournalDb.insertVoice,
    insertText: options.journalDb?.insertText ?? defaultJournalDb.insertText,
    listFeed: options.journalDb?.listFeed ?? defaultJournalDb.listFeed,
  };

  return createServer({
    registerRoutes(app) {
      const ensureUser = (req: any, reply: any) => {
        if (!req.user) {
          reply.code(401).send({ ok: false, error: { code: 'unauthorized', message: 'Unauthorized' } });
          return null;
        }
        return req.user;
      };

      const handleVoice = async (req: any, reply: any) => {
        const user = ensureUser(req, reply);
        if (!user) return;
        const data = VoiceSchema.parse(req.body);
        const userHash = hash(user.sub);
        const row = await journalDb.insertVoice({ ...data, user_hash: userHash });
        reply.code(201).send({ ok: true, data: { id: row.id, ts: row.ts } });
      };

      const handleText = async (req: any, reply: any) => {
        const user = ensureUser(req, reply);
        if (!user) return;
        const data = TextSchema.parse(req.body);
        const userHash = hash(user.sub);
        const row = await journalDb.insertText({ ...data, user_hash: userHash });
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
        const user = ensureUser(req, reply);
        if (!user) return;
        const userHash = hash(user.sub);
        const entries = await journalDb.listFeed(userHash);
        reply.send({ ok: true, data: { entries, weekly: [] } });
      });
    },
  });
}
