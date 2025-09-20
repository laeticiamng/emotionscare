import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

type Handler = (req: Request) => Promise<Response>;

const envValues = new Map<string, string>();
const getEnv = vi.fn((key: string) => envValues.get(key) ?? '');
const originalDeno = (globalThis as { Deno?: unknown }).Deno;

beforeAll(() => {
  (globalThis as { Deno: { env: { get: (key: string) => string } } }).Deno = { env: { get: getEnv } };
});

afterAll(() => {
  if (originalDeno) {
    (globalThis as { Deno: unknown }).Deno = originalDeno;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (globalThis as Record<string, unknown>).Deno;
  }
});

const serveCapture: { handler: Handler | null } = { handler: null };
const authenticateRequest = vi.fn(async () => ({
  status: 200,
  user: { id: 'user-456', user_metadata: { role: 'member' } },
}));
const logUnauthorizedAccess = vi.fn();
const summarizeAssessment = vi.fn(() => ({
  summary: 'Synthèse générée',
  level: 3,
  scores: { total: 18 },
  focus: 'focus-zone',
}));
const getCatalog = vi.fn(() => ({
  code: 'WHO5',
  locale: 'fr',
  name: 'Indice',
  version: '2.0',
  expiry_minutes: 30,
  items: [],
}));
const resolveCors = vi.fn(() => ({ allowed: true, headers: {} }));
const appendCorsHeaders = vi.fn((response: Response) => response);
const preflightResponse = vi.fn(() => new Response(null, { status: 204 }));
const rejectCors = vi.fn(() => new Response(null, { status: 403 }));
const applySecurityHeaders = vi.fn((response: Response) => response);
const hash = vi.fn(() => 'hashed-submit-user');
const logAccess = vi.fn(async () => {});
const addSentryBreadcrumb = vi.fn();
const captureSentryException = vi.fn();
const enforceEdgeRateLimit = vi.fn(async () => ({
  allowed: true,
  identifier: 'rate-submit',
  retryAfterSeconds: 0,
}));
const buildRateLimitResponse = vi.fn(() => new Response('rate', { status: 429 }));
const recordEdgeLatencyMetric = vi.fn(async () => {});
const assessmentsInsert = vi.fn(async () => ({ error: null }));
const signalsInsert = vi.fn(async () => ({ error: null }));
const createClient = vi.fn(() => ({
  from: (table: string) => {
    if (table === 'assessments') {
      return { insert: assessmentsInsert };
    }
    if (table === 'clinical_signals') {
      return { insert: signalsInsert };
    }
    throw new Error(`unexpected table ${table}`);
  },
}));

vi.mock('../_shared/serve.ts', () => ({
  serve: (handler: Handler) => {
    serveCapture.handler = handler;
  },
  __getHandler: () => serveCapture.handler,
}));

vi.mock('../_shared/auth-middleware.ts', () => ({
  authenticateRequest,
  logUnauthorizedAccess,
}));

vi.mock('../_shared/assess.ts', () => ({
  instrumentSchema: z.enum(['WHO5']),
  getCatalog,
  summarizeAssessment,
}));

vi.mock('../_shared/cors.ts', () => ({
  resolveCors,
  appendCorsHeaders,
  preflightResponse,
  rejectCors,
}));

vi.mock('../_shared/http.ts', () => ({
  json: (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  applySecurityHeaders,
}));

vi.mock('../_shared/hash_user.ts', () => ({
  hash,
}));

vi.mock('../_shared/logging.ts', () => ({
  logAccess,
}));

vi.mock('../_shared/sentry.ts', () => ({
  addSentryBreadcrumb,
  captureSentryException,
}));

vi.mock('../_shared/rate-limit.ts', () => ({
  enforceEdgeRateLimit,
  buildRateLimitResponse,
}));

vi.mock('../_shared/metrics.ts', () => ({
  recordEdgeLatencyMetric,
}));

vi.mock('../_shared/supabase.ts', () => ({
  createClient,
}));

beforeEach(() => {
  envValues.clear();
  envValues.set('CORS_ORIGINS', 'https://app.local');
  envValues.set('SUPABASE_URL', 'https://stub.supabase');
  envValues.set('SUPABASE_ANON_KEY', 'anon');
  vi.resetModules();
  authenticateRequest.mockClear();
  summarizeAssessment.mockClear();
  getCatalog.mockClear();
  resolveCors.mockClear();
  appendCorsHeaders.mockClear();
  applySecurityHeaders.mockClear();
  hash.mockClear();
  logAccess.mockClear();
  enforceEdgeRateLimit.mockClear();
  assessmentsInsert.mockClear();
  signalsInsert.mockClear();
  createClient.mockClear();
  recordEdgeLatencyMetric.mockClear();
  serveCapture.handler = null;
});

describe('assess-submit edge handler', () => {
  const getHandler = async (): Promise<Handler> => {
    const serveModule = await import('../_shared/serve.ts');
    const handlerAccessor = serveModule as unknown as { __getHandler: () => Handler | null };
    await import('./index.ts');
    const handler = handlerAccessor.__getHandler();
    if (!handler) {
      throw new Error('handler not registered');
    }
    return handler;
  };

  it('stores sanitized answers and returns success payload', async () => {
    const handler = await getHandler();
    const request = new Request('https://edge.dev/assess/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://app.local',
        Authorization: 'Bearer token',
      },
      body: JSON.stringify({ instrument: 'WHO5', answers: { '1': 4, '2': 5 } }),
    });

    const response = await handler(request);
    expect(response.status).toBe(200);
    expect(createClient).toHaveBeenCalledWith('https://stub.supabase', 'anon', expect.any(Object));
    expect(assessmentsInsert).toHaveBeenCalledTimes(1);
    const payload = assessmentsInsert.mock.calls[0][0];
    expect(payload).toMatchObject({
      user_id: 'user-456',
      instrument: 'WHO5',
      score_json: expect.objectContaining({
        summary: 'Synthèse générée',
        instrument_version: '2.0',
      }),
    });
    expect(logAccess).toHaveBeenCalledWith(expect.objectContaining({ route: 'assess-submit', action: 'assess:submit' }));
    const body = await response.json();
    expect(body).toEqual({ status: 'ok', stored: true, signal: true });
  });

  it('fails early when Supabase configuration is missing', async () => {
    envValues.set('SUPABASE_URL', '');
    const handler = await getHandler();
    const request = new Request('https://edge.dev/assess/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://app.local',
      },
      body: JSON.stringify({ instrument: 'WHO5', answers: { '1': 3 } }),
    });

    const response = await handler(request);
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toMatchObject({ error: 'configuration_error' });
    expect(createClient).not.toHaveBeenCalled();
  });
});
