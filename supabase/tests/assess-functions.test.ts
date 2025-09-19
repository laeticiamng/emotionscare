/* @vitest-environment node */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetEdgeRateLimits } from '../functions/_shared/rate-limit.ts';

const handlerRef: { current: ((req: Request) => Promise<Response>) | null } = { current: null };

const logAccessMock = vi.fn();
vi.mock('../functions/_shared/logging.ts', () => ({
  logAccess: (...args: unknown[]) => logAccessMock(...args),
}));

const authenticateRequestMock = vi.fn();
const logUnauthorizedAccessMock = vi.fn();
vi.mock('../functions/_shared/auth-middleware.ts', () => ({
  authenticateRequest: (...args: unknown[]) => authenticateRequestMock(...args),
  logUnauthorizedAccess: (...args: unknown[]) => logUnauthorizedAccessMock(...args),
}));

const supabaseClientMock = vi.fn();
vi.mock('../functions/_shared/supabase.ts', () => ({
  createClient: (...args: unknown[]) => supabaseClientMock(...args),
}));

const addSentryBreadcrumbMock = vi.fn();
const captureSentryExceptionMock = vi.fn();
vi.mock('../functions/_shared/sentry.ts', () => ({
  addSentryBreadcrumb: (...args: unknown[]) => addSentryBreadcrumbMock(...args),
  captureSentryException: (...args: unknown[]) => captureSentryExceptionMock(...args),
}));

vi.mock('../functions/_shared/serve.ts', () => ({
  serve: (handler: (req: Request) => Promise<Response>) => {
    handlerRef.current = handler;
  },
}));

vi.mock('../functions/_shared/zod.ts', () => ({ z: require('zod') }));

const envStore: Record<string, string | undefined> = {
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_ANON_KEY: 'anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
  CORS_ORIGINS: 'https://example.com',
};

function setDefaultAuthSuccess() {
  authenticateRequestMock.mockResolvedValue({
    status: 200,
    user: { id: 'user-123', user_metadata: { role: 'member' } },
  });
}

async function importEdgeHandler(modulePath: string) {
  handlerRef.current = null;
  await vi.resetModules();
  const salt = Math.random().toString(16).slice(2);
  await import(`${modulePath}?t=${salt}`);
  if (!handlerRef.current) {
    throw new Error(`No handler captured for ${modulePath}`);
  }
  return handlerRef.current;
}

beforeEach(() => {
  handlerRef.current = null;
  logAccessMock.mockReset();
  authenticateRequestMock.mockReset();
  logUnauthorizedAccessMock.mockReset();
  supabaseClientMock.mockReset();
  addSentryBreadcrumbMock.mockReset();
  captureSentryExceptionMock.mockReset();
  resetEdgeRateLimits();
  envStore.SUPABASE_URL = 'https://example.supabase.co';
  envStore.SUPABASE_ANON_KEY = 'anon-key';
  envStore.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
  envStore.CORS_ORIGINS = 'https://example.com';
  delete envStore.EDGE_RATE_LIMIT_ASSESS_START;
  (globalThis as Record<string, unknown>).Deno = {
    env: {
      get: (key: string) => envStore[key],
    },
  };
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete (globalThis as Record<string, unknown>).Deno;
});

describe('assess-start function', () => {
  it('rejects disallowed origins with 403', async () => {
    setDefaultAuthSuccess();
    const handler = await importEdgeHandler('../functions/assess-start/index.ts');

    const response = await handler(new Request('https://edge/assess-start', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://forbidden.example',
      },
      body: JSON.stringify({ instrument: 'WHO5' }),
    }));

    expect(response.status).toBe(403);
    const payload = await response.json();
    expect(payload.error).toBe('origin_not_allowed');
    expect(authenticateRequestMock).not.toHaveBeenCalled();
  });

  it('returns 401 when authentication fails', async () => {
    authenticateRequestMock.mockResolvedValue({ status: 401, user: null, error: 'missing token' });
    const handler = await importEdgeHandler('../functions/assess-start/index.ts');

    const response = await handler(new Request('https://edge/assess-start', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: JSON.stringify({ instrument: 'WHO5' }),
    }));

    expect(response.status).toBe(401);
    expect(logUnauthorizedAccessMock).toHaveBeenCalled();
  });

  it('returns 422 for invalid instrument', async () => {
    setDefaultAuthSuccess();
    const handler = await importEdgeHandler('../functions/assess-start/index.ts');

    const response = await handler(new Request('https://edge/assess-start', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: JSON.stringify({ instrument: 'UNKNOWN' }),
    }));

    expect(response.status).toBe(422);
    const payload = await response.json();
    expect(payload.error).toBe('invalid_body');
  });

  it('returns catalog for valid request', async () => {
    setDefaultAuthSuccess();
    const handler = await importEdgeHandler('../functions/assess-start/index.ts');

    const response = await handler(new Request('https://edge/assess-start', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: JSON.stringify({ instrument: 'WHO5' }),
    }));

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.instrument).toBe('WHO5');
    expect(Array.isArray(payload.items)).toBe(true);
    expect(payload.items.length).toBeGreaterThan(0);
    expect(logAccessMock).toHaveBeenCalledWith(expect.objectContaining({
      route: 'assess-start',
      action: 'assess:start',
      result: 'success',
    }));
    expect(addSentryBreadcrumbMock).toHaveBeenCalledWith(expect.objectContaining({
      category: 'assess:start',
    }));
  });

  it('applies per-user rate limiting', async () => {
    envStore.EDGE_RATE_LIMIT_ASSESS_START = '1';
    setDefaultAuthSuccess();
    const handler = await importEdgeHandler('../functions/assess-start/index.ts');

    const requestBody = JSON.stringify({ instrument: 'WHO5' });
    const requestFactory = () => new Request('https://edge/assess-start', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: requestBody,
    });

    const first = await handler(requestFactory());
    expect(first.status).toBe(200);

    const second = await handler(requestFactory());
    expect(second.status).toBe(429);
    const rateLimited = await second.json();
    expect(rateLimited.error).toBe('rate_limited');
  });
});

describe('assess-submit function', () => {
  it('requires authentication', async () => {
    authenticateRequestMock.mockResolvedValue({ status: 401, user: null, error: 'missing token' });
    const handler = await importEdgeHandler('../functions/assess-submit/index.ts');

    const response = await handler(new Request('https://edge/assess-submit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: JSON.stringify({ instrument: 'WHO5', answers: { w1: 3 } }),
    }));

    expect(response.status).toBe(401);
    expect(logUnauthorizedAccessMock).toHaveBeenCalled();
  });

  it('validates answers payload', async () => {
    setDefaultAuthSuccess();
    const handler = await importEdgeHandler('../functions/assess-submit/index.ts');

    const response = await handler(new Request('https://edge/assess-submit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: JSON.stringify({ instrument: 'WHO5', answers: {} }),
    }));

    expect(response.status).toBe(422);
  });

  it('stores a textual summary without raw answers', async () => {
    setDefaultAuthSuccess();
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    const fromMock = vi.fn(() => ({ insert: insertMock }));
    supabaseClientMock.mockReturnValue({ from: fromMock });

    const handler = await importEdgeHandler('../functions/assess-submit/index.ts');

    const response = await handler(new Request('https://edge/assess-submit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
        authorization: 'Bearer token-123',
      },
      body: JSON.stringify({ instrument: 'WHO5', answers: { w1: 4, w2: 'souvent' } }),
    }));

    expect(response.status).toBe(200);
    expect(insertMock).toHaveBeenCalledTimes(1);
    const payload = insertMock.mock.calls[0][0];
    expect(payload.instrument).toBe('WHO5');
    expect(payload.score_json.summary).toMatch(/bien-être|affect|tension/);
    expect(payload.score_json.summary).not.toMatch(/\d/);
    expect(payload.score_json).not.toHaveProperty('answers');
    expect(logAccessMock).toHaveBeenCalledWith(expect.objectContaining({
      route: 'assess-submit',
      action: 'assess:submit',
      result: 'success',
    }));
  });

  it('captures database errors', async () => {
    setDefaultAuthSuccess();
    const insertMock = vi.fn().mockResolvedValue({ error: { message: 'db failure' } });
    const fromMock = vi.fn(() => ({ insert: insertMock }));
    supabaseClientMock.mockReturnValue({ from: fromMock });

    const handler = await importEdgeHandler('../functions/assess-submit/index.ts');

    const response = await handler(new Request('https://edge/assess-submit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
        authorization: 'Bearer token-123',
      },
      body: JSON.stringify({ instrument: 'WHO5', answers: { w1: 1 } }),
    }));

    expect(response.status).toBe(500);
    expect(captureSentryExceptionMock).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      route: 'assess-submit',
      stage: 'db_insert',
    }));
  });
});

describe('assess-aggregate function', () => {
  it('requires authentication', async () => {
    authenticateRequestMock.mockResolvedValue({ status: 401, user: null, error: 'missing token' });
    const handler = await importEdgeHandler('../functions/assess-aggregate/index.ts');

    const response = await handler(new Request('https://edge/assess-aggregate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: JSON.stringify({ org_id: 'org-1', period: '2024-Q1' }),
    }));

    expect(response.status).toBe(401);
    expect(logUnauthorizedAccessMock).toHaveBeenCalled();
  });

  it('validates request body', async () => {
    setDefaultAuthSuccess();
    const handler = await importEdgeHandler('../functions/assess-aggregate/index.ts');

    const response = await handler(new Request('https://edge/assess-aggregate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: JSON.stringify({ org_id: '', period: '' }),
    }));

    expect(response.status).toBe(422);
  });

  it('returns sanitized summaries filtered on n >= 5', async () => {
    setDefaultAuthSuccess();
    const selectMock = vi.fn();
    const eqMock = vi.fn();
    const inMock = vi.fn();
    const result = { data: [
      { instrument: 'WHO5', period: '2024-Q1', n: 7, text_summary: 'Équipe sereine et 12 initiatives positives.' },
      { instrument: 'STAI6', period: '2024-Q1', n: 3, text_summary: 'Sensibilité ponctuelle.' },
    ], error: null };
    const builder: any = {
      select: selectMock,
      eq: eqMock,
      in: inMock,
      then: (onFulfilled: (value: unknown) => unknown, onRejected?: (reason: unknown) => unknown) =>
        Promise.resolve(result).then(onFulfilled, onRejected),
    };
    selectMock.mockReturnValue(builder);
    eqMock.mockReturnValue(builder);
    inMock.mockReturnValue(builder);
    const fromMock = vi.fn(() => builder);
    supabaseClientMock.mockReturnValue({ from: fromMock });

    const handler = await importEdgeHandler('../functions/assess-aggregate/index.ts');

    const response = await handler(new Request('https://edge/assess-aggregate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: JSON.stringify({ org_id: 'org-1', period: '2024-Q1' }),
    }));

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.summaries).toHaveLength(1);
    expect(payload.summaries[0].instrument).toBe('WHO5');
    expect(payload.summaries[0].text).not.toMatch(/\d/);
    expect(payload.summaries[0].text).toContain('•');
    expect(inMock).not.toHaveBeenCalled();
    expect(addSentryBreadcrumbMock).toHaveBeenCalledWith(expect.objectContaining({
      category: 'assess:aggregate',
    }));
    expect(logAccessMock).toHaveBeenCalledWith(expect.objectContaining({
      route: 'assess-aggregate',
      action: 'assess:aggregate',
    }));
    expect(supabaseClientMock).toHaveBeenCalledWith('https://example.supabase.co', 'service-role-key');
    expect(fromMock).toHaveBeenCalledWith('org_assess_rollups');
  });

  it('propagates database errors', async () => {
    setDefaultAuthSuccess();
    const error = { message: 'db read failed' };
    const builder: any = {
      select: vi.fn(),
      eq: vi.fn(),
      in: vi.fn(),
      then: (onFulfilled: (value: unknown) => unknown, onRejected?: (reason: unknown) => unknown) =>
        Promise.resolve({ data: null, error }).then(onFulfilled, onRejected),
    };
    builder.select.mockReturnValue(builder);
    builder.eq.mockReturnValue(builder);
    builder.in.mockReturnValue(builder);
    const fromMock = vi.fn(() => builder);
    supabaseClientMock.mockReturnValue({ from: fromMock });

    const handler = await importEdgeHandler('../functions/assess-aggregate/index.ts');

    const response = await handler(new Request('https://edge/assess-aggregate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: JSON.stringify({ org_id: 'org-1', period: '2024-Q1', instruments: ['WHO5'] }),
    }));

    expect(response.status).toBe(500);
    expect(captureSentryExceptionMock).toHaveBeenCalledWith(error, expect.objectContaining({
      route: 'assess-aggregate',
      stage: 'db_read',
    }));
  });
});
