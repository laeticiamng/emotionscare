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

const recordEdgeLatencyMetricMock = vi.fn();
vi.mock('../functions/_shared/metrics.ts', () => ({
  recordEdgeLatencyMetric: (...args: unknown[]) => recordEdgeLatencyMetricMock(...args),
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
  ALLOWED_ORIGINS: 'https://example.com',
  CSV_SIGNING_SECRET: 'test-signing-secret',
  FF_ASSESS_WHO5: 'true',
  FF_ASSESS_STAI6: 'true',
  FF_ASSESS_SAM: 'true',
  FF_ASSESS_SUDS: 'true',
};

const ORG_ONE = '11111111-1111-1111-1111-111111111111';
const ORG_TWO = '22222222-2222-2222-2222-222222222222';

function setDefaultAuthSuccess() {
  authenticateRequestMock.mockResolvedValue({
    status: 200,
    user: { id: 'user-123', user_metadata: { role: 'member' } },
  });
}

function setOrgAuthSuccess(options: { role?: string; orgs?: string[] } = {}) {
  const { role = 'b2b_admin', orgs = [ORG_ONE] } = options;
  authenticateRequestMock.mockResolvedValue({
    status: 200,
    user: { id: 'user-123', user_metadata: { role, org_ids: orgs } },
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
  recordEdgeLatencyMetricMock.mockReset();
  resetEdgeRateLimits();
  envStore.SUPABASE_URL = 'https://example.supabase.co';
  envStore.SUPABASE_ANON_KEY = 'anon-key';
  envStore.ALLOWED_ORIGINS = 'https://example.com';
  envStore.CSV_SIGNING_SECRET = 'test-signing-secret';
  envStore.FF_ASSESS_WHO5 = 'true';
  envStore.FF_ASSESS_STAI6 = 'true';
  envStore.FF_ASSESS_SAM = 'true';
  envStore.FF_ASSESS_SUDS = 'true';
  delete envStore.EDGE_RATE_LIMIT_ASSESS_START;
  delete envStore.EDGE_RATE_LIMIT_ASSESS_AGGREGATE;
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
      category: 'assess',
      message: 'assess:start:catalog_served',
    }));
    expect(recordEdgeLatencyMetricMock).toHaveBeenCalledWith(expect.objectContaining({
      route: 'assess-start',
      status: 200,
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
    const assessmentInsertMock = vi.fn().mockResolvedValue({ error: null });
    const signalInsertMock = vi.fn().mockResolvedValue({ error: null });
    const consentBuilder = {
      eq: vi.fn(() => consentBuilder),
      order: vi.fn(() => consentBuilder),
      limit: vi.fn(() => consentBuilder),
      maybeSingle: vi.fn(async () => ({ data: { is_active: true, revoked_at: null }, error: null })),
    };
    const consentSelect = vi.fn(() => consentBuilder);
    const fromMock = vi.fn((table: string) => {
      if (table === 'assessments') {
        return { insert: assessmentInsertMock };
      }
      if (table === 'clinical_signals') {
        return { insert: signalInsertMock };
      }
      if (table === 'clinical_consents') {
        return { select: consentSelect };
      }
      throw new Error(`unexpected table ${table}`);
    });
    supabaseClientMock.mockReturnValue({ from: fromMock });

    const handler = await importEdgeHandler('../functions/assess-submit/index.ts');

    const response = await handler(new Request('https://edge/assess-submit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
        authorization: 'Bearer token-123',
      },
      body: JSON.stringify({ instrument: 'WHO5', answers: { '1': 4, '2': 5, '3': 5, '4': 4, '5': 4 } }),
    }));

    expect(response.status).toBe(200);
    expect(assessmentInsertMock).toHaveBeenCalledTimes(1);
    const payload = assessmentInsertMock.mock.calls[0][0];
    expect(payload.user_id).toBe('user-123');
    expect(payload.instrument).toBe('WHO5');
    expect(typeof payload.score_json.summary).toBe('string');
    expect(payload.score_json.summary).not.toMatch(/\d/);
    expect(payload.score_json.level).toBeGreaterThanOrEqual(0);
    expect(payload.score_json.level).toBeLessThanOrEqual(4);
    expect(payload.score_json.instrument_version).toBeTruthy();
    expect(payload.score_json).not.toHaveProperty('answers');
    expect(payload.submitted_at).toEqual(payload.ts);
    const body = await response.json();
    expect(body.summary).toBe(payload.score_json.summary);
    expect(consentSelect).toHaveBeenCalledWith('is_active, revoked_at');
    expect(logAccessMock).toHaveBeenCalledWith(expect.objectContaining({
      route: 'assess-submit',
      action: 'assess:submit',
      result: 'success',
    }));
    expect(addSentryBreadcrumbMock).toHaveBeenCalledWith(expect.objectContaining({
      category: 'assess',
      message: 'assess:submit:summary_generated',
    }));
    expect(recordEdgeLatencyMetricMock).toHaveBeenCalledWith(expect.objectContaining({
      route: 'assess-submit',
      status: 200,
    }));
  });

  it('captures database errors', async () => {
    setDefaultAuthSuccess();
    const assessmentInsertMock = vi.fn().mockResolvedValue({ error: { message: 'db failure', code: '42P01' } });
    const signalInsertMock = vi.fn().mockResolvedValue({ error: null });
    const consentBuilder = {
      eq: vi.fn(() => consentBuilder),
      order: vi.fn(() => consentBuilder),
      limit: vi.fn(() => consentBuilder),
      maybeSingle: vi.fn(async () => ({ data: { is_active: true, revoked_at: null }, error: null })),
    };
    const consentSelect = vi.fn(() => consentBuilder);
    const fromMock = vi.fn((table: string) => {
      if (table === 'assessments') {
        return { insert: assessmentInsertMock };
      }
      if (table === 'clinical_signals') {
        return { insert: signalInsertMock };
      }
      if (table === 'clinical_consents') {
        return { select: consentSelect };
      }
      throw new Error(`unexpected table ${table}`);
    });
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
    expect(assessmentInsertMock).toHaveBeenCalledTimes(1);
  });

  it('returns 403 when clinical opt-in is absent', async () => {
    setDefaultAuthSuccess();
    const consentBuilder = {
      eq: vi.fn(() => consentBuilder),
      order: vi.fn(() => consentBuilder),
      limit: vi.fn(() => consentBuilder),
      maybeSingle: vi.fn(async () => ({ data: null, error: null })),
    };
    const consentSelect = vi.fn(() => consentBuilder);
    const fromMock = vi.fn((table: string) => {
      if (table === 'clinical_consents') {
        return { select: consentSelect };
      }
      if (table === 'assessments') {
        return { insert: vi.fn() };
      }
      if (table === 'clinical_signals') {
        return { insert: vi.fn() };
      }
      throw new Error(`unexpected table ${table}`);
    });
    supabaseClientMock.mockReturnValue({ from: fromMock });

    const handler = await importEdgeHandler('../functions/assess-submit/index.ts');

    const response = await handler(new Request('https://edge/assess-submit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
        authorization: 'Bearer token-123',
      },
      body: JSON.stringify({ instrument: 'WHO5', answers: { '1': 4 } }),
    }));

    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.error).toBe('optin_required');
  });

  it('returns 404 when instrument flag is disabled', async () => {
    envStore.FF_ASSESS_WHO5 = 'false';
    setDefaultAuthSuccess();
    const handler = await importEdgeHandler('../functions/assess-submit/index.ts');

    const response = await handler(new Request('https://edge/assess-submit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
        authorization: 'Bearer token-123',
      },
      body: JSON.stringify({ instrument: 'WHO5', answers: { '1': 3 } }),
    }));

    expect(response.status).toBe(404);
    const payload = await response.json();
    expect(payload.error).toBe('instrument_disabled');
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
      body: JSON.stringify({ org_id: ORG_ONE, period: '2024-03' }),
    }));

    expect(response.status).toBe(401);
    expect(logUnauthorizedAccessMock).toHaveBeenCalled();
  });

  it('validates request body', async () => {
    setOrgAuthSuccess();
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

  it('rejects users without organisational role', async () => {
    setOrgAuthSuccess({ role: 'member' });
    const handler = await importEdgeHandler('../functions/assess-aggregate/index.ts');

    const response = await handler(new Request('https://edge/assess-aggregate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: JSON.stringify({ org_id: ORG_ONE, period: '2024-03' }),
    }));

    expect(response.status).toBe(403);
    expect(logUnauthorizedAccessMock).toHaveBeenCalledWith(expect.anything(), 'forbidden_role');
  });

  it('rejects users outside the requested organisation scope', async () => {
    setOrgAuthSuccess({ orgs: [ORG_TWO] });
    const handler = await importEdgeHandler('../functions/assess-aggregate/index.ts');

    const response = await handler(new Request('https://edge/assess-aggregate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: JSON.stringify({ org_id: ORG_ONE, period: '2024-03' }),
    }));

    expect(response.status).toBe(403);
    expect(logUnauthorizedAccessMock).toHaveBeenCalledWith(expect.anything(), 'forbidden_org_scope');
  });

  it('rejects requests without organisation claim', async () => {
    authenticateRequestMock.mockResolvedValue({
      status: 200,
      user: { id: 'user-123', user_metadata: { role: 'b2b_admin' } },
    });
    const handler = await importEdgeHandler('../functions/assess-aggregate/index.ts');

    const response = await handler(new Request('https://edge/assess-aggregate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
      },
      body: JSON.stringify({ org_id: ORG_ONE, period: '2024-03' }),
    }));

    expect(response.status).toBe(403);
    expect(logUnauthorizedAccessMock).toHaveBeenCalledWith(expect.anything(), 'missing_org_claim');
  });

  it('returns sanitized summaries filtered on n >= 5', async () => {
    setOrgAuthSuccess();
    const selectMock = vi.fn();
    const eqMock = vi.fn();
    const inMock = vi.fn();
    const gteMock = vi.fn();
    const result = { data: [
      { instrument: 'WHO5', period: '2024-03', n: 7, text_summary: 'Équipe sereine et 12,5 % initiatives positives.' },
      { instrument: 'STAI6', period: '2024-03', n: 3, text_summary: 'Sensibilité ponctuelle.' },
    ], error: null };
    const builder: any = {
      select: selectMock,
      eq: eqMock,
      in: inMock,
      gte: gteMock,
      then: (onFulfilled: (value: unknown) => unknown, onRejected?: (reason: unknown) => unknown) =>
        Promise.resolve(result).then(onFulfilled, onRejected),
    };
    selectMock.mockReturnValue(builder);
    eqMock.mockReturnValue(builder);
    inMock.mockReturnValue(builder);
    gteMock.mockReturnValue(builder);
    const fromMock = vi.fn(() => builder);
    supabaseClientMock.mockReturnValue({ from: fromMock });

    const handler = await importEdgeHandler('../functions/assess-aggregate/index.ts');

    const response = await handler(new Request('https://edge/assess-aggregate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
        authorization: 'Bearer token-123',
      },
      body: JSON.stringify({ org_id: ORG_ONE, period: '2024-03' }),
    }));

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.summaries).toHaveLength(1);
    expect(payload.summaries[0].instrument).toBe('WHO5');
    expect(payload.summaries[0].text).not.toMatch(/\d/);
    expect(payload.summaries[0].text).not.toContain('%');
    expect(payload.summaries[0].text.length).toBeGreaterThan(0);
    expect(payload.summaries[0]).not.toHaveProperty('n');
    expect(payload.summaries[0]).not.toHaveProperty('signature');
    expect(inMock).not.toHaveBeenCalled();
    expect(gteMock).toHaveBeenCalledWith('n', 5);
    expect(addSentryBreadcrumbMock).toHaveBeenCalledWith(expect.objectContaining({
      category: 'assess',
      message: 'assess:aggregate:summaries_served',
    }));
    expect(logAccessMock).toHaveBeenCalledWith(expect.objectContaining({
      route: 'assess-aggregate',
      action: 'assess:aggregate',
    }));
    expect(recordEdgeLatencyMetricMock).toHaveBeenCalledWith(expect.objectContaining({
      route: 'assess-aggregate',
      status: 200,
    }));
    expect(supabaseClientMock).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'anon-key',
      expect.objectContaining({
        global: { headers: { Authorization: 'Bearer token-123' } },
      }),
    );
    expect(fromMock).toHaveBeenCalledWith('org_assess_rollups');
  });

  it('propagates database errors', async () => {
    setOrgAuthSuccess();
    const error = { message: 'db read failed' };
    const builder: any = {
      select: vi.fn(),
      eq: vi.fn(),
      in: vi.fn(),
      gte: vi.fn(),
      then: (onFulfilled: (value: unknown) => unknown, onRejected?: (reason: unknown) => unknown) =>
        Promise.resolve({ data: null, error }).then(onFulfilled, onRejected),
    };
    builder.select.mockReturnValue(builder);
    builder.eq.mockReturnValue(builder);
    builder.in.mockReturnValue(builder);
    builder.gte.mockReturnValue(builder);
    const fromMock = vi.fn(() => builder);
    supabaseClientMock.mockReturnValue({ from: fromMock });

    const handler = await importEdgeHandler('../functions/assess-aggregate/index.ts');

    const response = await handler(new Request('https://edge/assess-aggregate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
        authorization: 'Bearer token-123',
      },
      body: JSON.stringify({ org_id: ORG_ONE, period: '2024-03', instruments: ['WHO5'] }),
    }));

    expect(response.status).toBe(500);
    expect(captureSentryExceptionMock).toHaveBeenCalledWith(error, expect.objectContaining({
      route: 'assess-aggregate',
      stage: 'db_read',
    }));
    expect(supabaseClientMock).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'anon-key',
      expect.objectContaining({
        global: { headers: { Authorization: 'Bearer token-123' } },
      }),
    );
  });

  it('enforces per-user rate limits', async () => {
    envStore.EDGE_RATE_LIMIT_ASSESS_AGGREGATE = '1';
    setOrgAuthSuccess();

    const selectMock = vi.fn();
    const eqMock = vi.fn();
    const inMock = vi.fn();
    const gteMock = vi.fn();
    const result = { data: [], error: null };
    const builder: any = {
      select: selectMock,
      eq: eqMock,
      in: inMock,
      gte: gteMock,
      then: (onFulfilled: (value: unknown) => unknown, onRejected?: (reason: unknown) => unknown) =>
        Promise.resolve(result).then(onFulfilled, onRejected),
    };
    selectMock.mockReturnValue(builder);
    eqMock.mockReturnValue(builder);
    inMock.mockReturnValue(builder);
    gteMock.mockReturnValue(builder);
    const fromMock = vi.fn(() => builder);
    supabaseClientMock.mockReturnValue({ from: fromMock });

    const handler = await importEdgeHandler('../functions/assess-aggregate/index.ts');

    const makeRequest = () => new Request('https://edge/assess-aggregate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://example.com',
        authorization: 'Bearer token-123',
      },
      body: JSON.stringify({ org_id: ORG_ONE, period: '2024-03' }),
    });

    const ok = await handler(makeRequest());
    expect(ok.status).toBe(200);

    const limited = await handler(makeRequest());
    expect(limited.status).toBe(429);
    const payload = await limited.json();
    expect(payload.error).toBe('rate_limited');
    expect(payload.retry_after).toBeGreaterThan(0);
    expect(supabaseClientMock).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'anon-key',
      expect.objectContaining({
        global: { headers: { Authorization: 'Bearer token-123' } },
      }),
    );
  });
});
