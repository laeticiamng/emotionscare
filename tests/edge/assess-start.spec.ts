/* @vitest-environment node */

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

type Handler = (req: Request) => Promise<Response>;

const envStore = new Map<string, string | undefined>();
const getEnv = vi.fn((key: string) => envStore.get(key));

let handlerRef: { current: Handler | null };
let corsAllowed: boolean;
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://app.local',
  'Vary': 'Origin',
};

const authenticateRequest = vi.fn();
const logUnauthorizedAccess = vi.fn();
const appendCorsHeaders = vi.fn((response: Response) => {
  Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value));
  return response;
});
const resolveCors = vi.fn(() => ({ allowed: corsAllowed, headers: corsHeaders }));
const preflightResponse = vi.fn(() => new Response(null, { status: 204, headers: corsHeaders }));
const rejectCors = vi.fn(() =>
  new Response(JSON.stringify({ error: 'origin_not_allowed' }), {
    status: 403,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  }),
);
const applySecurityHeaders = vi.fn((response: Response, options?: { cacheControl?: string; extra?: Record<string, string> }) => {
  if (options?.cacheControl) {
    response.headers.set('Cache-Control', options.cacheControl);
  }
  if (options?.extra) {
    for (const [key, value] of Object.entries(options.extra)) {
      response.headers.set(key, value);
    }
  }
  return response;
});
const json = vi.fn((status: number, data: unknown) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  }),
);
const hash = vi.fn(() => 'hashed-user');
const logAccess = vi.fn(async () => {});
const addSentryBreadcrumb = vi.fn();
const captureSentryException = vi.fn();
const enforceEdgeRateLimit = vi.fn(async () => ({ allowed: true, identifier: 'rate', retryAfterSeconds: 0 }));
const buildRateLimitResponse = vi.fn(() => new Response('rate', { status: 429 }));
const recordEdgeLatencyMetric = vi.fn(async () => {});

const maybeSingleMock = vi.fn();
const eqIsActiveMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
const eqInstrumentMock = vi.fn(() => ({ eq: eqIsActiveMock }));
const eqUserMock = vi.fn(() => ({ eq: eqInstrumentMock }));
const selectMock = vi.fn(() => ({ eq: eqUserMock }));
const fromMock = vi.fn(() => ({ select: selectMock }));
const createClient = vi.fn(() => ({ from: fromMock }));

vi.mock('../../supabase/functions/_shared/serve.ts', () => ({
  serve: (handler: Handler) => {
    handlerRef.current = handler;
  },
}));

vi.mock('../../supabase/functions/_shared/auth-middleware.ts', () => ({
  authenticateRequest,
  logUnauthorizedAccess,
}));

vi.mock('../../supabase/functions/_shared/cors.ts', () => ({
  appendCorsHeaders,
  resolveCors,
  preflightResponse,
  rejectCors,
}));

vi.mock('../../supabase/functions/_shared/http.ts', () => ({
  applySecurityHeaders,
  json,
}));

vi.mock('../../supabase/functions/_shared/hash_user.ts', () => ({
  hash,
}));

vi.mock('../../supabase/functions/_shared/logging.ts', () => ({
  logAccess,
}));

vi.mock('../../supabase/functions/_shared/sentry.ts', () => ({
  addSentryBreadcrumb,
  captureSentryException,
}));

vi.mock('../../supabase/functions/_shared/rate-limit.ts', () => ({
  enforceEdgeRateLimit,
  buildRateLimitResponse,
}));

vi.mock('../../supabase/functions/_shared/metrics.ts', () => ({
  recordEdgeLatencyMetric,
}));

vi.mock('../../supabase/functions/_shared/supabase.ts', () => ({
  createClient,
}));

beforeAll(() => {
  handlerRef = { current: null };
  (globalThis as { Deno?: { env: { get: typeof getEnv } } }).Deno = { env: { get: getEnv } };
});

afterAll(() => {
  vi.unstubAllGlobals();
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete (globalThis as { Deno?: unknown }).Deno;
});

beforeEach(() => {
  envStore.clear();
  envStore.set('SUPABASE_URL', 'https://edge.supabase.local');
  envStore.set('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
  envStore.set('FF_ASSESS_WHO5', 'true');
  envStore.set('FF_ASSESS_STAI6', 'true');
  envStore.set('FF_ASSESS_SAM', 'true');
  envStore.set('FF_ASSESS_SUDS', 'true');

  corsAllowed = true;

  authenticateRequest.mockResolvedValue({ status: 200, user: { id: 'user-1', user_metadata: { role: 'member' } } });
  logUnauthorizedAccess.mockReset();
  appendCorsHeaders.mockClear();
  resolveCors.mockClear();
  preflightResponse.mockClear();
  rejectCors.mockClear();
  applySecurityHeaders.mockClear();
  json.mockClear();
  hash.mockClear();
  logAccess.mockClear();
  addSentryBreadcrumb.mockClear();
  captureSentryException.mockClear();
  enforceEdgeRateLimit.mockClear();
  buildRateLimitResponse.mockClear();
  recordEdgeLatencyMetric.mockClear();
  createClient.mockClear();
  fromMock.mockClear();
  selectMock.mockClear();
  eqUserMock.mockClear();
  eqInstrumentMock.mockClear();
  eqIsActiveMock.mockClear();
  maybeSingleMock.mockReset();
  maybeSingleMock.mockResolvedValue({ data: { id: 'consent-1' }, error: null });
});

afterEach(() => {
  vi.resetModules();
});

const getHandler = async (): Promise<Handler> => {
  handlerRef.current = null;
  await import('../../supabase/functions/assess-start/index.ts');
  if (!handlerRef.current) {
    throw new Error('handler not registered');
  }
  return handlerRef.current;
};

describe('assess-start edge contract', () => {
  it('rejects origins not in the allow-list', async () => {
    corsAllowed = false;
    const handler = await getHandler();
    const response = await handler(
      new Request('https://edge.dev/assess/start', {
        method: 'POST',
        headers: { Origin: 'https://evil.test' },
        body: JSON.stringify({ instrument: 'WHO5' }),
      }),
    );

    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body).toEqual({ error: 'origin_not_allowed' });
  });

  it('returns unauthorized when bearer token is missing', async () => {
    authenticateRequest.mockResolvedValueOnce({ status: 401, user: null, error: 'missing' });
    const handler = await getHandler();

    const response = await handler(
      new Request('https://edge.dev/assess/start', {
        method: 'POST',
        headers: { Origin: 'https://app.local' },
        body: JSON.stringify({ instrument: 'WHO5' }),
      }),
    );

    expect(response.status).toBe(401);
    const payload = await response.json();
    expect(payload).toEqual({ error: 'unauthorized' });
    expect(logUnauthorizedAccess).toHaveBeenCalled();
  });

  it('validates request body and returns 422 on invalid payload', async () => {
    const handler = await getHandler();

    const response = await handler(
      new Request('https://edge.dev/assess/start', {
        method: 'POST',
        headers: { Origin: 'https://app.local', 'content-type': 'application/json' },
        body: JSON.stringify({}),
      }),
    );

    expect(response.status).toBe(422);
    const payload = await response.json();
    expect(payload).toEqual({ error: 'invalid_body' });
  });

  it('returns 404 when the feature flag disables the instrument', async () => {
    envStore.set('FF_ASSESS_WHO5', 'false');
    const handler = await getHandler();

    const response = await handler(
      new Request('https://edge.dev/assess/start', {
        method: 'POST',
        headers: { Origin: 'https://app.local', 'content-type': 'application/json' },
        body: JSON.stringify({ instrument: 'WHO5', locale: 'fr' }),
      }),
    );

    expect(response.status).toBe(404);
    const payload = await response.json();
    expect(payload).toEqual({ error: 'instrument_disabled' });
  });

  it('returns 403 when the user has not opted in', async () => {
    maybeSingleMock.mockResolvedValueOnce({ data: null, error: null });
    const handler = await getHandler();

    const response = await handler(
      new Request('https://edge.dev/assess/start', {
        method: 'POST',
        headers: { Origin: 'https://app.local', 'content-type': 'application/json' },
        body: JSON.stringify({ instrument: 'WHO5', locale: 'fr' }),
      }),
    );

    expect(response.status).toBe(403);
    const payload = await response.json();
    expect(payload).toEqual({ error: 'optin_required' });
  });

  it('delivers the catalog with caching hints and without scoring data', async () => {
    const handler = await getHandler();

    const response = await handler(
      new Request('https://edge.dev/assess/start', {
        method: 'POST',
        headers: { Origin: 'https://app.local', 'content-type': 'application/json' },
        body: JSON.stringify({ instrument: 'WHO5', locale: 'fr' }),
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=300, stale-while-revalidate=60');
    expect(response.headers.get('ETag')).toMatch(/^"[a-f0-9]{64}"$/);

    const payload = await response.json();
    expect(payload).toMatchObject({ code: 'WHO5', version: '1.0', expiry_minutes: 30 });
    expect(payload).not.toHaveProperty('scores');
    expect(Array.isArray(payload.items)).toBe(true);

    expect(logAccess).toHaveBeenCalledWith(
      expect.objectContaining({ route: 'assess-start', action: 'assess:start', result: 'success' }),
    );
    expect(createClient).toHaveBeenCalledWith('https://edge.supabase.local', 'service-role');
  });
});
