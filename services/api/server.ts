import { performance } from 'node:perf_hooks';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

import { VoiceSchema, TextSchema } from '../journal/lib/validate';
import { hash } from '../journal/lib/hash';
import { insertVoice, insertText, listFeed } from '../journal/lib/db';
import type { FastifyBaseLogger } from 'fastify';

import { createServer } from '../lib/server';
import { moodPlaylistRequestSchema, buildMoodPlaylistResponse } from './music';
import { registerAssessmentRoutes } from './routes/assessments';
import { registerScanRoutes } from './routes/scans';
import { registerCoachRoutes } from './routes/coach';
import { registerGoalRoutes } from './routes/goals';

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

type CheckStatus = 'ok' | 'degraded' | 'down';

type BasicCheck = {
  status: CheckStatus;
  latency_ms: number;
  error?: string;
};

type FunctionCheck = BasicCheck & {
  name: string;
};

type HealthChecks = {
  supabase: BasicCheck;
  functions: FunctionCheck[];
  storage: BasicCheck;
};

type RuntimeInfo = {
  node: string;
  platform: NodeJS.Platform;
  environment: string;
};

type UptimeInfo = {
  seconds: number;
  since: string;
};

type HealthResponse = {
  status: CheckStatus;
  version: string;
  runtime: RuntimeInfo;
  uptime: UptimeInfo;
  timestamp: string;
  checks: HealthChecks;
  signature: string;
};

const require = createRequire(import.meta.url);
const packageJson = require('../../package.json') as { version?: string };
const packageVersion = packageJson?.version ?? '0.0.0';
const bootTime = Date.now();

const DEFAULT_DEPENDENCY_TIMEOUT = Number.parseInt(process.env.HEALTHCHECK_TIMEOUT_MS ?? '1500', 10);
const HEALTH_RATE_LIMIT = Number.parseInt(process.env.HEALTH_RATE_LIMIT ?? '60', 10);
const HEALTH_RATE_WINDOW = Number.parseInt(process.env.HEALTH_RATE_WINDOW_MS ?? '60000', 10);

const getAppVersion = () => process.env.RELEASE_VERSION ?? packageVersion;

const parseList = (value?: string) =>
  value
    ? value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
    : [];

const getRuntimeInfo = (): RuntimeInfo => ({
  node: process.version,
  platform: process.platform,
  environment: process.env.NODE_ENV ?? 'development',
});

const getUptimeInfo = (): UptimeInfo => ({
  seconds: Number(process.uptime().toFixed(3)),
  since: new Date(bootTime).toISOString(),
});

const getAllowedOrigins = () => parseList(process.env.HEALTH_ALLOWED_ORIGINS);
const getSupabaseUrl = () =>
  process.env.HEALTH_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL ??
  null;
const getSupabaseKey = () =>
  process.env.HEALTH_SUPABASE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY ??
  '';
const getFunctionTargets = () => parseList(process.env.HEALTH_FUNCTIONS ?? 'ai-emotion-analysis,ai-coach');
const getDirectStorageUrl = () => process.env.HEALTH_STORAGE_URL ?? null;
const getStorageBucket = () => process.env.HEALTH_STORAGE_BUCKET ?? null;
const getStorageObject = () => process.env.HEALTH_STORAGE_OBJECT ?? null;
const getSentryHeartbeatUrl = () =>
  process.env.SENTRY_HEARTBEAT_URL ?? process.env.SENTRY_CRON_HEARTBEAT_URL ?? null;

const createRateLimiter = (limit: number, windowMs: number) => {
  const bucket = new Map<string, { count: number; resetAt: number }>();
  const normalizedLimit = Number.isFinite(limit) && limit > 0 ? limit : 60;
  const normalizedWindow = Number.isFinite(windowMs) && windowMs > 0 ? windowMs : 60000;

  return (key: string) => {
    const now = Date.now();
    const entry = bucket.get(key);
    if (!entry || now >= entry.resetAt) {
      bucket.set(key, { count: 1, resetAt: now + normalizedWindow });
      return true;
    }

    if (entry.count >= normalizedLimit) {
      return false;
    }

    entry.count += 1;
    return true;
  };
};

const healthRateLimiter = createRateLimiter(HEALTH_RATE_LIMIT, HEALTH_RATE_WINDOW);

const timedFetch = async (url: string, init: RequestInit = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_DEPENDENCY_TIMEOUT);

  try {
    return await fetch(url, {
      ...init,
      cache: 'no-store',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
};

const sendSentryHeartbeat = async (status: CheckStatus, logger?: FastifyBaseLogger) => {
  const url = getSentryHeartbeatUrl();
  if (!url) {
    return;
  }

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'emotionscare-health/1.0',
      },
      body: JSON.stringify({ status, checked_at: new Date().toISOString() }),
    });
  } catch (error) {
    if (logger?.warn) {
      logger.warn({ err: error }, 'healthcheck.sentry_heartbeat_failed');
    }
  }
};

const buildSupabaseHeaders = () => {
  const supabaseAnonKey = getSupabaseKey();
  if (!supabaseAnonKey) {
    return {
      Accept: 'application/json',
    } as Record<string, string>;
  }

  return {
    Accept: 'application/json',
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  } as Record<string, string>;
};

const pingSupabase = async (): Promise<BasicCheck> => {
  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl) {
    return { status: 'degraded', latency_ms: 0, error: 'not_configured' };
  }

  const headers = buildSupabaseHeaders();
  const started = performance.now();

  try {
    const authUrl = new URL('/auth/v1/settings', supabaseUrl).toString();
    const restUrl = new URL('/rest/v1/?select=1', supabaseUrl).toString();

    const authResponse = await timedFetch(authUrl, { headers });
    const restResponse = await timedFetch(restUrl, {
      headers: { ...headers, Range: '0-0' },
      method: 'GET',
    });

    const latency = Math.round(performance.now() - started);
    const restOk = restResponse.status < 500;
    const success = authResponse.ok && restOk;

    return {
      status: success ? 'ok' : restOk ? 'degraded' : 'down',
      latency_ms: latency,
      error: success ? undefined : restOk ? `http_${restResponse.status}` : `http_${restResponse.status}`,
    };
  } catch (error) {
    return {
      status: 'down',
      latency_ms: Math.round(performance.now() - started),
      error: error instanceof Error ? error.name : 'unknown_error',
    };
  }
};

const pingFunction = async (name: string): Promise<FunctionCheck> => {
  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl) {
    return { name, status: 'degraded', latency_ms: 0, error: 'not_configured' };
  }

  const headers = buildSupabaseHeaders();
  const endpoint = new URL(`/functions/v1/${name}`, supabaseUrl).toString();
  const started = performance.now();

  try {
    const response = await timedFetch(endpoint, { method: 'HEAD', headers });
    const latency = Math.round(performance.now() - started);

    if (!response.ok) {
      return {
        name,
        status: response.status >= 500 ? 'down' : 'degraded',
        latency_ms: latency,
        error: `http_${response.status}`,
      };
    }

    return { name, status: 'ok', latency_ms: latency };
  } catch (error) {
    return {
      name,
      status: 'down',
      latency_ms: Math.round(performance.now() - started),
      error: error instanceof Error ? error.name : 'unknown_error',
    };
  }
};

const resolveStorageUrl = () => {
  const directStorageUrl = getDirectStorageUrl();
  if (directStorageUrl) {
    return directStorageUrl;
  }

  const supabaseUrl = getSupabaseUrl();
  const storageBucket = getStorageBucket();
  const storageObject = getStorageObject();
  if (supabaseUrl && storageBucket && storageObject) {
    return new URL(`/storage/v1/object/public/${storageBucket}/${storageObject}`, supabaseUrl).toString();
  }

  return null;
};

const pingStorage = async (): Promise<BasicCheck> => {
  const target = resolveStorageUrl();
  if (!target) {
    return { status: 'degraded', latency_ms: 0, error: 'not_configured' };
  }

  const started = performance.now();

  try {
    const response = await timedFetch(target, { method: 'HEAD' });
    const latency = Math.round(performance.now() - started);

    if (!response.ok) {
      return {
        status: response.status >= 500 ? 'down' : 'degraded',
        latency_ms: latency,
        error: `http_${response.status}`,
      };
    }

    return { status: 'ok', latency_ms: latency };
  } catch (error) {
    return {
      status: 'down',
      latency_ms: Math.round(performance.now() - started),
      error: error instanceof Error ? error.name : 'unknown_error',
    };
  }
};

const computeOverallStatus = (
  supabase: BasicCheck,
  functions: FunctionCheck[],
  storage: BasicCheck,
): CheckStatus => {
  if (supabase.status === 'down') {
    return 'down';
  }

  if (supabase.status === 'degraded') {
    return 'degraded';
  }

  if (storage.status === 'down') {
    return 'degraded';
  }

  if (storage.status === 'degraded') {
    return 'degraded';
  }

  if (functions.some(fn => fn.status === 'down')) {
    return 'degraded';
  }

  if (functions.some(fn => fn.status === 'degraded')) {
    return 'degraded';
  }

  return 'ok';
};

const signPayload = (payload: Omit<HealthResponse, 'signature'>) => {
  const secret = process.env.HEALTH_SIGNING_SECRET ?? '';
  const canonical = JSON.stringify(payload);
  return createHash('sha256').update(canonical + secret).digest('hex');
};

const buildHealthPayload = async (): Promise<HealthResponse> => {
  const supabaseCheck = await pingSupabase();
  const functionChecks = await Promise.all(
    getFunctionTargets().map(target => pingFunction(target)),
  );
  const storageCheck = await pingStorage();

  const basePayload = {
    status: computeOverallStatus(supabaseCheck, functionChecks, storageCheck),
    version: getAppVersion(),
    runtime: getRuntimeInfo(),
    uptime: getUptimeInfo(),
    timestamp: new Date().toISOString(),
    checks: {
      supabase: supabaseCheck,
      functions: functionChecks,
      storage: storageCheck,
    },
  } as const;

  return {
    ...basePayload,
    signature: signPayload(basePayload),
  };
};

const buildRateLimitedPayload = (): HealthResponse => {
  const base = {
    status: 'degraded' as CheckStatus,
    version: getAppVersion(),
    runtime: getRuntimeInfo(),
    uptime: getUptimeInfo(),
    timestamp: new Date().toISOString(),
    checks: {
      supabase: { status: 'degraded', latency_ms: 0, error: 'rate_limited' },
      functions: [] as FunctionCheck[],
      storage: { status: 'degraded', latency_ms: 0, error: 'rate_limited' },
    },
  } as const;

  return {
    ...base,
    signature: signPayload(base),
  };
};

const applyHealthCors = (request: any, reply: any) => {
  const origin = request.headers?.origin as string | undefined;
  const allowedOrigins = getAllowedOrigins();
  if (origin && allowedOrigins.includes(origin)) {
    reply.header('access-control-allow-origin', origin);
  }

  reply.header('access-control-allow-methods', 'GET');
  reply.header('vary', 'origin');
};

export function createApp(options: CreateAppOptions = {}) {
  const journalDb: JournalDb = {
    insertVoice: options.journalDb?.insertVoice ?? defaultJournalDb.insertVoice,
    insertText: options.journalDb?.insertText ?? defaultJournalDb.insertText,
    listFeed: options.journalDb?.listFeed ?? defaultJournalDb.listFeed,
  };

  return createServer({
    registerRoutes(app) {
      // Register modular API routes
      registerAssessmentRoutes(app);
      registerScanRoutes(app);
      registerCoachRoutes(app);
      registerGoalRoutes(app);

      const sendHealth = async (request: any, reply: any) => {
        applyHealthCors(request, reply);
        reply.header('cache-control', 'no-store');

        const identifier = String(
          request.ip ??
            request.headers?.['x-forwarded-for'] ??
            request.headers?.['x-real-ip'] ??
            'anonymous',
        );

        if (!healthRateLimiter(identifier)) {
          reply.code(429).send(buildRateLimitedPayload());
          return;
        }

        const payload = await buildHealthPayload();
        reply.send(payload);
        void sendSentryHeartbeat(payload.status, app.log);
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
