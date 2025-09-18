import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';

import { VoiceSchema, TextSchema } from '../journal/lib/validate';
import { hash } from '../journal/lib/hash';
import { insertVoice, insertText, listFeed } from '../journal/lib/db';
import { createServer } from '../lib/server';
import { moodPlaylistRequestSchema, buildMoodPlaylistResponse } from './music';
import { z } from 'zod';

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

const dependencyStatusSchema = z.object({
  name: z.string(),
  ok: z.boolean(),
  latency: z.number(),
  optional: z.boolean().default(false),
  lastChecked: z.string(),
  error: z.string().optional(),
});

type DependencyStatus = z.infer<typeof dependencyStatusSchema>;

const healthPayloadSchema = z.object({
  ok: z.boolean(),
  version: z.string(),
  uptime: z.number(),
  timestamp: z.string(),
  services: z.object({
    api: z.boolean(),
    database: z.boolean(),
    storage: z.boolean(),
    ai: z.boolean(),
  }),
  metrics: z.object({
    rss: z.number(),
    heapUsed: z.number(),
  }),
  latency: z.object({
    api: z.number(),
    eventLoop: z.number(),
  }),
  dependencies: z.array(dependencyStatusSchema),
});

type HealthPayload = z.infer<typeof healthPayloadSchema>;

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

const DEFAULT_DEPENDENCY_TIMEOUT = Number.parseInt(process.env.HEALTHCHECK_TIMEOUT_MS ?? '1500', 10);

const measureEventLoopDelay = async () => {
  const start = performance.now();
  await new Promise((resolve) => setImmediate(resolve));
  return performance.now() - start;
};

const checkDependency = async (
  name: string,
  target?: string,
  { optional = false, method = 'HEAD' }: { optional?: boolean; method?: 'HEAD' | 'GET' } = {}
): Promise<DependencyStatus> => {
  const lastChecked = new Date().toISOString();

  if (!target) {
    return dependencyStatusSchema.parse({
      name,
      ok: false,
      latency: 0,
      optional: true,
      lastChecked,
      error: 'not_configured',
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_DEPENDENCY_TIMEOUT);
  const started = performance.now();

  try {
    const response = await fetch(target, {
      method,
      cache: 'no-store',
      redirect: 'follow',
      signal: controller.signal,
    });

    const latency = performance.now() - started;

    if (!response.ok) {
      return dependencyStatusSchema.parse({
        name,
        ok: false,
        latency,
        optional,
        lastChecked,
        error: `http_${response.status}`,
      });
    }

    return dependencyStatusSchema.parse({
      name,
      ok: true,
      latency,
      optional,
      lastChecked,
    });
  } catch (error) {
    const latency = performance.now() - started;
    return dependencyStatusSchema.parse({
      name,
      ok: false,
      latency,
      optional,
      lastChecked,
      error: error instanceof Error ? error.message : 'unknown_error',
    });
  } finally {
    clearTimeout(timeout);
  }
};

const buildHealthPayload = async (): Promise<HealthPayload> => {
  const overallStart = performance.now();

  const [database, storage, ai] = await Promise.all([
    checkDependency('database', process.env.HEALTHCHECK_DATABASE_URL ?? process.env.DATABASE_URL ?? process.env.SUPABASE_URL),
    checkDependency('storage', process.env.SUPABASE_STORAGE_URL ?? process.env.SUPABASE_URL, { optional: true }),
    checkDependency('ai', process.env.HEALTHCHECK_AI_URL ?? process.env.OPENAI_HEALTH_URL, { optional: true }),
  ]);

  const memory = process.memoryUsage();
  const apiLatency = performance.now() - overallStart;
  const eventLoop = await measureEventLoopDelay();

  const services = {
    api: true,
    database: database.ok || database.optional,
    storage: storage.ok || storage.optional,
    ai: ai.ok || ai.optional,
  };

  const payload = {
    ok: [database, storage, ai].every((dependency) => dependency.ok || dependency.optional),
    version: process.env.APP_VERSION ?? resolveVersion(),
    uptime: Math.round((Date.now() - appStartedAt) / 1000),
    timestamp: new Date().toISOString(),
    services,
    metrics: {
      rss: memory.rss,
      heapUsed: memory.heapUsed,
    },
    latency: {
      api: Number(apiLatency.toFixed(2)),
      eventLoop: Number(eventLoop.toFixed(2)),
    },
    dependencies: [database, storage, ai],
  } satisfies HealthPayload;

  return healthPayloadSchema.parse(payload);
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
        const payload = await buildHealthPayload();
        reply.send(payload);
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
