/* @vitest-environment node */

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

type Handler = (req: Request) => Promise<Response>;

type QueryResponse<T> = { data: T | null; error: { message: string } | null };

type SupabaseQueues = {
  select: Array<QueryResponse<any>>;
  update: Array<QueryResponse<any>>;
  insert: Array<QueryResponse<any>>;
};

const envStore = new Map<string, string | undefined>();
const getEnv = vi.fn((key: string) => envStore.get(key));

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://app.local',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  Vary: 'Origin',
};

const authenticateRequest = vi.fn();
const logUnauthorizedAccess = vi.fn();
const appendCorsHeaders = vi.fn((response: Response) => {
  Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value));
  return response;
});
const resolveCors = vi.fn(() => ({ allowed: true, headers: corsHeaders }));
const preflightResponse = vi.fn(() => new Response(null, { status: 204, headers: corsHeaders }));
const rejectCors = vi.fn(() =>
  new Response(JSON.stringify({ error: 'origin_not_allowed' }), {
    status: 403,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  }),
);
const applySecurityHeaders = vi.fn((response: Response, options?: { cacheControl?: string }) => {
  response.headers.set('Cache-Control', options?.cacheControl ?? 'no-store');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
});
const json = vi.fn((status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  }),
);
const hash = vi.fn(() => 'hashed-user');
const logAccess = vi.fn(async () => {});
const enforceEdgeRateLimit = vi.fn(async () => ({
  allowed: true,
  identifier: 'rate',
  limit: 5,
  remaining: 4,
  resetAt: Math.floor(Date.now() / 1000) + 60,
  retryAfterSeconds: 60,
  hashedUserId: 'hashed-user',
  hashedIp: null,
}));
const buildRateLimitResponse = vi.fn(() =>
  new Response(
    JSON.stringify({ error: 'rate_limited', message: 'Too many requests', retry_after: 60 }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        'content-type': 'application/json',
        'RateLimit-Limit': '5',
        'RateLimit-Remaining': '0',
        'RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 60),
        'Retry-After': '60',
      },
    },
  ),
);
const recordEdgeLatencyMetric = vi.fn(async () => {});

const queues: SupabaseQueues = {
  select: [],
  update: [],
  insert: [],
};

const makeChain = <T>(response: QueryResponse<T>) => {
  const chain: any = {
    eq: vi.fn(() => chain),
    is: vi.fn(() => chain),
    not: vi.fn(() => chain),
    order: vi.fn(() => chain),
    limit: vi.fn(() => chain),
    select: vi.fn(() => chain),
    maybeSingle: vi.fn(async () => response),
    single: vi.fn(async () => response),
  };
  chain.then = (resolve: (value: QueryResponse<T>) => unknown, reject: (reason?: unknown) => unknown) =>
    Promise.resolve(response).then(resolve, reject);
  return chain;
};

const selectMock = vi.fn(() => makeChain(queues.select.shift() ?? { data: null, error: null }));
const updateMock = vi.fn(() => makeChain(queues.update.shift() ?? { data: null, error: null }));
const insertSelectMock = vi.fn(() => makeChain(queues.insert.shift() ?? { data: null, error: null }));
const insertMock = vi.fn(() => ({ select: insertSelectMock }));
const fromMock = vi.fn(() => ({ select: selectMock, update: updateMock, insert: insertMock }));
const createClient = vi.fn(() => ({ from: fromMock }));

const resetQueues = () => {
  queues.select = [];
  queues.update = [];
  queues.insert = [];
};

const queueSelectResponse = <T>(response: QueryResponse<T>) => {
  queues.select.push(response);
};

const queueUpdateResponse = <T>(response: QueryResponse<T>) => {
  queues.update.push(response);
};

const queueInsertResponse = <T>(response: QueryResponse<T>) => {
  queues.insert.push(response);
};

const handlerRef: { current: Handler | null } = { current: null };

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

vi.mock('../../supabase/functions/_shared/rate-limit.ts', () => ({
  enforceEdgeRateLimit,
  buildRateLimitResponse,
}));

vi.mock('../../supabase/functions/_shared/supabase.ts', () => ({
  createClient,
}));

vi.mock('../../supabase/functions/_shared/metrics.ts', () => ({
  recordEdgeLatencyMetric,
}));

beforeAll(() => {
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
  envStore.set('SUPABASE_ANON_KEY', 'anon-key');
  envStore.set('CORS_ORIGINS', 'https://app.local');

  handlerRef.current = null;
  resetQueues();

  authenticateRequest.mockReset();
  logUnauthorizedAccess.mockReset();
  appendCorsHeaders.mockClear();
  resolveCors.mockClear();
  preflightResponse.mockClear();
  rejectCors.mockClear();
  applySecurityHeaders.mockClear();
  json.mockClear();
  hash.mockClear();
  logAccess.mockClear();
  enforceEdgeRateLimit.mockClear();
  buildRateLimitResponse.mockClear();
  recordEdgeLatencyMetric.mockClear();
  createClient.mockClear();
  fromMock.mockClear();
  selectMock.mockClear();
  updateMock.mockClear();
  insertMock.mockClear();
  insertSelectMock.mockClear();

  resolveCors.mockReturnValue({ allowed: true, headers: corsHeaders });
  authenticateRequest.mockResolvedValue({ status: 200, user: { id: 'user-1' } });
  enforceEdgeRateLimit.mockResolvedValue({
    allowed: true,
    identifier: 'rate',
    limit: 5,
    remaining: 4,
    resetAt: Math.floor(Date.now() / 1000) + 60,
    retryAfterSeconds: 60,
    hashedUserId: 'hashed-user',
    hashedIp: null,
  });
});

afterEach(() => {
  vi.resetModules();
});

const loadHandler = async (modulePath: string): Promise<Handler> => {
  handlerRef.current = null;
  await import(modulePath);
  if (!handlerRef.current) {
    throw new Error(`Handler not registered for ${modulePath}`);
  }
  return handlerRef.current;
};

const getRateHeaders = (response: Response) => ({
  rateLimit: response.headers.get('RateLimit-Limit'),
  retryAfter: response.headers.get('Retry-After'),
});

describe('optin-accept edge function', () => {
  it('creates a new consent when none exists', async () => {
    queueSelectResponse({ data: null, error: null });
    queueInsertResponse({ data: { accepted_at: '2025-03-01T10:00:00.000Z', version: 'v1' }, error: null });

    const handler = await loadHandler('../../supabase/functions/optin-accept/index.ts');

    const response = await handler(
      new Request('https://edge.dev/optin/accept', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer token',
          origin: 'https://app.local',
        },
        body: JSON.stringify({ version: 'v1', scope: { clinical: true } }),
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: 'accepted',
      accepted_at: '2025-03-01T10:00:00.000Z',
      version: 'v1',
    });
    expect(createClient).toHaveBeenCalled();
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(logAccess).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'hashed-user',
      action: 'accept',
      result: 'success',
    }));
  });

  it('returns existing consent when already accepted with same version and scope', async () => {
    queueSelectResponse({
      data: { id: 'consent-1', version: 'v1', scope: { clinical: true }, accepted_at: '2025-03-01T10:00:00.000Z' },
      error: null,
    });

    const handler = await loadHandler('../../supabase/functions/optin-accept/index.ts');

    const response = await handler(
      new Request('https://edge.dev/optin/accept', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer token',
          origin: 'https://app.local',
        },
        body: JSON.stringify({ version: 'v1', scope: { clinical: true } }),
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: 'accepted',
      accepted_at: '2025-03-01T10:00:00.000Z',
      version: 'v1',
    });
    expect(updateMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('rejects unauthorized calls', async () => {
    authenticateRequest.mockResolvedValueOnce({ status: 401, user: null, error: 'missing token' });

    const handler = await loadHandler('../../supabase/functions/optin-accept/index.ts');

    const response = await handler(
      new Request('https://edge.dev/optin/accept', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'https://app.local',
        },
        body: JSON.stringify({ version: 'v1' }),
      }),
    );

    expect(response.status).toBe(401);
    expect(logUnauthorizedAccess).toHaveBeenCalledWith(expect.any(Request), 'missing token');
  });

  it('returns 422 for invalid payload', async () => {
    const handler = await loadHandler('../../supabase/functions/optin-accept/index.ts');

    const response = await handler(
      new Request('https://edge.dev/optin/accept', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer token',
          origin: 'https://app.local',
        },
        body: JSON.stringify({ version: '' }),
      }),
    );

    expect(response.status).toBe(422);
  });

  it('propagates rate limiting decisions', async () => {
    enforceEdgeRateLimit.mockResolvedValueOnce({
      allowed: false,
      identifier: 'rate',
      limit: 5,
      remaining: 0,
      resetAt: Math.floor(Date.now() / 1000) + 60,
      retryAfterSeconds: 60,
      hashedUserId: 'hashed-user',
      hashedIp: null,
    });

    const handler = await loadHandler('../../supabase/functions/optin-accept/index.ts');

    const response = await handler(
      new Request('https://edge.dev/optin/accept', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer token',
          origin: 'https://app.local',
        },
        body: JSON.stringify({ version: 'v1' }),
      }),
    );

    expect(response.status).toBe(429);
    expect(getRateHeaders(response)).toMatchObject({
      rateLimit: '5',
      retryAfter: '60',
    });
  });
});

describe('optin-revoke edge function', () => {
  it('revokes the active consent and returns timestamp', async () => {
    queueUpdateResponse({ data: { revoked_at: '2025-03-02T11:00:00.000Z' }, error: null });

    const handler = await loadHandler('../../supabase/functions/optin-revoke/index.ts');

    const response = await handler(
      new Request('https://edge.dev/optin/revoke', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer token',
          origin: 'https://app.local',
        },
        body: JSON.stringify({ reason: 'user-request' }),
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: 'revoked',
      revoked_at: '2025-03-02T11:00:00.000Z',
    });
    expect(updateMock).toHaveBeenCalled();
    expect(logAccess).toHaveBeenCalledWith(expect.objectContaining({
      route: 'optin-revoke',
      result: 'success',
    }));
  });

  it('remains idempotent when no active consent exists', async () => {
    queueUpdateResponse({ data: null, error: null });
    queueSelectResponse({ data: { revoked_at: '2025-03-01T09:00:00.000Z' }, error: null });

    const handler = await loadHandler('../../supabase/functions/optin-revoke/index.ts');

    const response = await handler(
      new Request('https://edge.dev/optin/revoke', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer token',
          origin: 'https://app.local',
        },
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: 'revoked',
      revoked_at: '2025-03-01T09:00:00.000Z',
    });
    expect(selectMock).toHaveBeenCalled();
  });

  it('rejects unauthorized revocation attempts', async () => {
    authenticateRequest.mockResolvedValueOnce({ status: 401, user: null, error: 'missing token' });

    const handler = await loadHandler('../../supabase/functions/optin-revoke/index.ts');

    const response = await handler(
      new Request('https://edge.dev/optin/revoke', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'https://app.local',
        },
      }),
    );

    expect(response.status).toBe(401);
    expect(logUnauthorizedAccess).toHaveBeenCalledWith(expect.any(Request), 'missing token');
  });

  it('validates request body', async () => {
    const handler = await loadHandler('../../supabase/functions/optin-revoke/index.ts');

    const response = await handler(
      new Request('https://edge.dev/optin/revoke', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer token',
          origin: 'https://app.local',
        },
        body: JSON.stringify({ reason: '' }),
      }),
    );

    expect(response.status).toBe(422);
  });
});
