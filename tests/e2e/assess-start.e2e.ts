import { expect, test } from '@playwright/test';
import { vi } from 'vitest';

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

test.beforeAll(() => {
  handlerRef = { current: null };
  (globalThis as { Deno?: { env: { get: typeof getEnv } } }).Deno = { env: { get: getEnv } };
});

test.afterAll(() => {
  vi.unstubAllGlobals();
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete (globalThis as { Deno?: unknown }).Deno;
});

test.beforeEach(async ({ page }) => {
  envStore.clear();
  envStore.set('SUPABASE_URL', 'https://edge.supabase.local');
  envStore.set('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
  envStore.set('FF_ASSESS_WHO5', 'true');
  envStore.set('FF_ASSESS_STAI6', 'true');
  envStore.set('FF_ASSESS_SAM', 'true');
  envStore.set('FF_ASSESS_SUDS', 'true');

  corsAllowed = true;

  authenticateRequest.mockResolvedValue({ status: 200, user: { id: 'user-1', user_metadata: { role: 'member' } } });
  maybeSingleMock.mockReset();
  maybeSingleMock.mockResolvedValue({ data: { id: 'consent-1' }, error: null });

  await page.route('https://app.local/', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body></body></html>' }),
  );
});

test.afterEach(async ({ page }) => {
  await page.unroute('https://app.local/');
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

async function setupEdgeRoute(page: import('@playwright/test').Page, handler: Handler) {
  await page.route('**/functions/v1/assess-start', async (route) => {
    const request = route.request();
    const headers = new Headers();
    const rawHeaders = request.headers();
    for (const [key, value] of Object.entries(rawHeaders)) {
      headers.set(key, value);
    }
    const bodyBuffer = request.postDataBuffer();
    const edgeRequest = new Request(request.url(), {
      method: request.method(),
      headers,
      body: bodyBuffer ? new Uint8Array(bodyBuffer) : undefined,
    });
    const edgeResponse = await handler(edgeRequest);
    const responseBody = await edgeResponse.text();
    const responseHeaders = Object.fromEntries(edgeResponse.headers.entries());
    await route.fulfill({
      status: edgeResponse.status,
      headers: responseHeaders,
      body: responseBody,
    });
  });
}

test('blocks assessment start when opt-in is missing', async ({ page }) => {
  const handler = await getHandler();
  maybeSingleMock.mockResolvedValueOnce({ data: null, error: null });
  await setupEdgeRoute(page, handler);

  await page.goto('https://app.local/');

  const result = await page.evaluate(async () => {
    const res = await fetch('/functions/v1/assess-start', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer access-token',
      },
      body: JSON.stringify({ instrument: 'WHO5', locale: 'fr' }),
    });
    return { status: res.status, body: await res.json() };
  });

  expect(result.status).toBe(403);
  expect(result.body).toEqual({ error: 'optin_required' });
});

test('returns 404 when the feature flag is disabled', async ({ page }) => {
  envStore.set('FF_ASSESS_WHO5', 'false');
  const handler = await getHandler();
  await setupEdgeRoute(page, handler);

  await page.goto('https://app.local/');

  const result = await page.evaluate(async () => {
    const res = await fetch('/functions/v1/assess-start', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer access-token',
      },
      body: JSON.stringify({ instrument: 'WHO5', locale: 'fr' }),
    });
    return { status: res.status, body: await res.json() };
  });

  expect(result.status).toBe(404);
  expect(result.body).toEqual({ error: 'instrument_disabled' });
});

test('delivers catalog items without scores when conditions are met', async ({ page }) => {
  const handler = await getHandler();
  await setupEdgeRoute(page, handler);

  await page.goto('https://app.local/');

  const result = await page.evaluate(async () => {
    const res = await fetch('/functions/v1/assess-start', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer access-token',
      },
      body: JSON.stringify({ instrument: 'WHO5', locale: 'fr' }),
    });
    const payload = await res.json();
    return { status: res.status, body: payload, cacheControl: res.headers.get('cache-control') };
  });

  expect(result.status).toBe(200);
  expect(result.cacheControl).toBe('public, max-age=300, stale-while-revalidate=60');
  expect(result.body).toMatchObject({ code: 'WHO5', version: '1.0', expiry_minutes: 30 });
  expect(result.body).not.toHaveProperty('scores');
  expect(Array.isArray(result.body.items)).toBe(true);
});
