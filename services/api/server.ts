import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { VoiceSchema, TextSchema } from '../journal/lib/validate';
import { hash } from '../journal/lib/hash';
import { insertVoice, insertText, listFeed } from '../journal/lib/db';
import { createServer } from '../lib/server';
import { moodPlaylistRequestSchema, buildMoodPlaylistResponse } from './music';

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

type HealthServiceState = {
  api: boolean;
  database: boolean;
  storage: boolean;
  ai: boolean;
};

type HealthPayload = {
  ok: boolean;
  version: string;
  uptime: number;
  timestamp: string;
  services: HealthServiceState;
  metrics: {
    rss: number;
    heapUsed: number;
  };
};

const appStartedAt = Date.now();

const resolveVersion = (() => {
  let cached: string | null = null;
  return () => {
    if (cached) return cached;
    try {
      const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
      cached = pkg.version ?? '0.0.0';
    } catch {
      cached = '0.0.0';
    }
    return cached;
  };
})();

const buildHealthPayload = (): HealthPayload => {
  const services: HealthServiceState = {
    api: true,
    database: Boolean(process.env.DATABASE_URL || process.env.SUPABASE_URL),
    storage: Boolean(process.env.SUPABASE_STORAGE_URL || process.env.SUPABASE_URL),
    ai: Boolean(process.env.OPENAI_API_KEY || process.env.HUME_API_KEY),
  };

  const memory = process.memoryUsage();

  return {
    ok: services.api,
    version: process.env.APP_VERSION ?? resolveVersion(),
    uptime: Math.round((Date.now() - appStartedAt) / 1000),
    timestamp: new Date().toISOString(),
    services,
    metrics: {
      rss: memory.rss,
      heapUsed: memory.heapUsed,
    },
  };
};

export function createApp(options: CreateAppOptions = {}) {
  const journalDb: JournalDb = {
    insertVoice: options.journalDb?.insertVoice ?? defaultJournalDb.insertVoice,
    insertText: options.journalDb?.insertText ?? defaultJournalDb.insertText,
    listFeed: options.journalDb?.listFeed ?? defaultJournalDb.listFeed,
  };

  return createServer({
    registerRoutes(app) {
      const sendHealth = async (_req: any, reply: any) => {
        reply.header('cache-control', 'no-store');
        reply.send(buildHealthPayload());
      };

      app.get('/health', sendHealth);
      app.get('/healthz', sendHealth);
      app.get('/api/healthz', sendHealth);

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

      app.post('/api/mood_playlist', async (req, reply) => {
        const parsed = moodPlaylistRequestSchema.safeParse(req.body);

        if (!parsed.success) {
          reply.code(422).send({
            ok: false,
            error: {
              code: 'invalid_payload',
              message: 'Invalid mood playlist payload',
              details: parsed.error.flatten(),
            },
          });
          return;
        }

        const playlist = buildMoodPlaylistResponse(parsed.data);
        reply.send({ ok: true, data: playlist });
      });
    },
  });
}
