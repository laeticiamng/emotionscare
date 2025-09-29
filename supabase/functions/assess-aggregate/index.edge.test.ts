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
const TEST_ORG_ID = '11111111-1111-1111-1111-111111111111';
const authenticateRequest = vi.fn(async () => ({
  status: 200,
  user: { id: 'admin-1', user_metadata: { role: 'b2b_admin', org_ids: [TEST_ORG_ID] } },
}));
const logUnauthorizedAccess = vi.fn();
const sanitizeAggregateText = vi.fn((text: string) => text.replace(/\d+%?/g, '').replace(/\s+/g, ' ').trim());
const resolveCors = vi.fn(() => ({ allowed: true, headers: {} }));
const appendCorsHeaders = vi.fn((response: Response) => response);
const preflightResponse = vi.fn(() => new Response(null, { status: 204 }));
const rejectCors = vi.fn(() => new Response(null, { status: 403 }));
const applySecurityHeaders = vi.fn((response: Response) => response);
const hash = vi.fn((value: string) => `hash-${value}`);
const logAccess = vi.fn(async () => {});
const addSentryBreadcrumb = vi.fn();
const captureSentryException = vi.fn();
const enforceEdgeRateLimit = vi.fn(async () => ({
  allowed: true,
  identifier: 'rate-aggregate',
  retryAfterSeconds: 0,
}));
const buildRateLimitResponse = vi.fn(() => new Response('rate', { status: 429 }));
const recordEdgeLatencyMetric = vi.fn(async () => {});
interface QueryResult {
  data: Array<{ instrument: string; period: string; n: number; text_summary: string | null }>;
  error: { message: string } | null;
}

let currentResult: QueryResult = {
  data: [],
  error: null,
};

const buildQuery = () => {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    gte: vi.fn(() => builder),
    in: vi.fn(() => builder),
    then: (resolve: (value: QueryResult) => unknown) => {
      resolve(currentResult);
      return Promise.resolve(undefined);
    },
  };
  return builder;
};

const createClient = vi.fn(() => ({
  from: vi.fn(() => buildQuery()),
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
  instrumentSchema: z.enum(['WHO5', 'STAI6']),
}));

vi.mock('../_shared/clinical_text.ts', () => ({
  sanitizeAggregateText,
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
  envValues.set('ALLOWED_ORIGINS', 'https://app.local');
  envValues.set('SUPABASE_URL', 'https://stub.supabase');
  envValues.set('SUPABASE_ANON_KEY', 'anon-key');
  vi.resetModules();
  authenticateRequest.mockClear();
  logUnauthorizedAccess.mockClear();
  sanitizeAggregateText.mockClear();
  resolveCors.mockClear();
  appendCorsHeaders.mockClear();
  applySecurityHeaders.mockClear();
  hash.mockClear();
  logAccess.mockClear();
  enforceEdgeRateLimit.mockClear();
  recordEdgeLatencyMetric.mockClear();
  createClient.mockClear();
  serveCapture.handler = null;
  currentResult = {
    data: [
      { instrument: 'WHO5', period: '2025-03', n: 9, text_summary: 'Cohorte à 72%' },
      { instrument: 'STAI6', period: '2025-03', n: 4, text_summary: 'Insuffisant' },
    ],
    error: null,
  };
});

describe('assess-aggregate edge handler', () => {
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

  it('returns sanitized summaries with text-only payload', async () => {
    const handler = await getHandler();
    const request = new Request('https://edge.dev/assess/aggregate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://app.local',
      },
      body: JSON.stringify({ org_id: TEST_ORG_ID, period: '2025-03', instruments: ['WHO5'] }),
    });

    const response = await handler(request);
    expect(response.status).toBe(200);
    expect(createClient).toHaveBeenCalledWith(
      'https://stub.supabase',
      'anon-key',
      expect.objectContaining({ global: { headers: {} } }),
    );
    const body = await response.json();
    expect(body.summaries).toEqual([
      {
        instrument: 'WHO5',
        period: '2025-03',
        text: 'Cohorte à',
      },
    ]);
    expect(logAccess).toHaveBeenCalledWith(expect.objectContaining({ route: 'assess-aggregate', action: 'assess:aggregate' }));
  });

  it('denies access for unsupported roles', async () => {
    authenticateRequest.mockResolvedValueOnce({
      status: 200,
      user: { id: 'user', user_metadata: { role: 'b2c' } },
    });

    const handler = await getHandler();
    const request = new Request('https://edge.dev/assess/aggregate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://app.local',
      },
      body: JSON.stringify({ org_id: TEST_ORG_ID, period: '2025-03' }),
    });

    const response = await handler(request);
    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body).toMatchObject({ error: 'forbidden' });
    expect(logUnauthorizedAccess).toHaveBeenCalledWith(expect.any(Request), 'forbidden_role');
  });
});
