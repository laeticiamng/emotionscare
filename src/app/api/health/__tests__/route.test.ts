import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const limitMock = vi.fn<[], Promise<{ error: { message?: string } | null }>>();
const selectMock = vi.fn(() => ({ limit: limitMock }));
const fromMock = vi.fn(() => ({ select: selectMock }));
const createClientMock = vi.fn(() => ({ from: fromMock }));

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock,
}));

describe('GET /api/health', () => {
  const originalEnv = { ...process.env };
  const originalFetch = global.fetch;
  let nowSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    limitMock.mockReset();
    selectMock.mockClear();
    fromMock.mockClear();
    createClientMock.mockClear();

    process.env = { ...originalEnv };
    process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role';
    process.env.VITE_WEB_URL = 'https://app.example.com';
    process.env.SENTRY_RELEASE = '1.2.3';
    process.env.SENTRY_ENVIRONMENT = 'test';

    let now = 0;
    nowSpy = vi.spyOn(performance, 'now').mockImplementation(() => {
      now += 7;
      return now;
    });

    global.fetch = vi.fn((input: RequestInfo, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      if (url.includes('/functions/v1/health-edge')) {
        return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }));
      }
      return Promise.resolve(new Response(null, { status: 200 }));
    });

    limitMock.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    global.fetch = originalFetch;
    nowSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('returns latencies when all checks succeed', async () => {
    const { GET } = await import('../route');
    const response = await GET(new Request('http://localhost/api/health'));

    expect(response.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/functions/v1/health-edge'),
      expect.objectContaining({ method: 'POST' }),
    );

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(typeof body.supabase_ms).toBe('number');
    expect(typeof body.edge_ms).toBe('number');
    expect(typeof body.storage_ms).toBe('number');
    expect(body.version).toBe('1.2.3');
    expect(body.env).toBe('test');
    expect(body.errors).toBeUndefined();
  });

  it('reports degraded status when Supabase fails but soft fail keeps HTTP 200', async () => {
    process.env.HEALTH_SOFT_FAIL = 'true';
    limitMock.mockResolvedValue({ error: { message: 'db offline' } });

    const { GET } = await import('../route');
    const response = await GET(new Request('http://localhost/api/health'));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('degraded');
    expect(body.errors).toMatchObject({ supabase: 'db offline' });
  });
});
