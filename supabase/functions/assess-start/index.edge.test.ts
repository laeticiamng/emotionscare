// @ts-nocheck
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
  user: { id: 'user-123', user_metadata: { role: 'member' } },
}));
const logUnauthorizedAccess = vi.fn();
const getCatalog = vi.fn((instrument: string, locale: string) => ({
  code: instrument,
  locale,
  name: 'Test instrument',
  version: '1.0',
  expiry_minutes: 45,
  items: [
    { id: '1', prompt: 'Q1', type: 'scale', min: 0, max: 5 },
  ],
}));
const resolveCors = vi.fn(() => ({ allowed: true, headers: {} }));
const appendCorsHeaders = vi.fn((response: Response) => response);
const preflightResponse = vi.fn(() => new Response(null, { status: 204 }));
const rejectCors = vi.fn(() => new Response(null, { status: 403 }));
const applySecurityHeaders = vi.fn((response: Response) => response);
const hash = vi.fn(() => 'hashed-user');
const logAccess = vi.fn(async () => {});
const addSentryBreadcrumb = vi.fn();
const captureSentryException = vi.fn();
const enforceEdgeRateLimit = vi.fn(async () => ({
  allowed: true,
  identifier: 'rate-id',
  retryAfterSeconds: 0,
}));
const buildRateLimitResponse = vi.fn(() => new Response('rate-limited', { status: 429 }));
const recordEdgeLatencyMetric = vi.fn(async () => {});

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
  instrumentSchema: z.enum(['WHO5', 'STAI6']),
  localeSchema: z.enum(['fr', 'en']),
  getCatalog,
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

beforeEach(() => {
  envValues.clear();
  envValues.set('ALLOWED_ORIGINS', 'https://app.local');
  vi.resetModules();
  authenticateRequest.mockClear();
  logUnauthorizedAccess.mockClear();
  getCatalog.mockClear();
  resolveCors.mockClear();
  appendCorsHeaders.mockClear();
  applySecurityHeaders.mockClear();
  hash.mockClear();
  logAccess.mockClear();
  enforceEdgeRateLimit.mockClear();
  buildRateLimitResponse.mockClear();
  recordEdgeLatencyMetric.mockClear();
  serveCapture.handler = null;
});

describe('assess-start edge handler', () => {
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

  it('returns the requested catalog with caching hints', async () => {
    const handler = await getHandler();
    const request = new Request('https://edge.dev/assess/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://app.local',
      },
      body: JSON.stringify({ instrument: 'WHO5', locale: 'fr' }),
    });

    const response = await handler(request);
    expect(response.status).toBe(200);
    expect(enforceEdgeRateLimit).toHaveBeenCalledWith(expect.any(Request), expect.objectContaining({ route: 'assess-start' }));
    const body = await response.json();
    expect(body).toMatchObject({ instrument: 'WHO5', locale: 'fr', expiry_minutes: 45 });
    expect(getCatalog).toHaveBeenCalledWith('WHO5', 'fr');
    expect(logAccess).toHaveBeenCalledWith(expect.objectContaining({ route: 'assess-start', action: 'assess:start' }));
  });

  it('rejects malformed payloads with validation error', async () => {
    const handler = await getHandler();
    const request = new Request('https://edge.dev/assess/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://app.local' },
      body: JSON.stringify({ instrument: 'UNKNOWN' }),
    });

    const response = await handler(request);
    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body).toMatchObject({ error: 'invalid_body' });
    expect(getCatalog).not.toHaveBeenCalled();
  });
});
