import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GET } from '../route';

const createClientMock = vi.hoisted(() => vi.fn());

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock,
}));

const originalEnv = { ...process.env };
const originalFetch = global.fetch;

describe('GET /api/health', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    createClientMock.mockReset();
    global.fetch = vi.fn();
    let now = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => {
      now += 5;
      return now;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  it('returns latencies for each probe when everything is healthy', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://demo.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
    process.env.NEXT_PUBLIC_BASE_URL = 'https://preview.example.com';
    process.env.SENTRY_RELEASE = '1.2.3';
    process.env.SENTRY_ENVIRONMENT = 'preview';

    const selectMock = vi.fn().mockResolvedValue({ error: null });
    const fromMock = vi.fn(() => ({ select: selectMock }));
    createClientMock.mockReturnValue({ from: fromMock } as any);

    (global.fetch as vi.Mock).mockImplementation(async (input, init) => {
      if (init?.method === 'POST') {
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      }
      return new Response(null, { status: 200 });
    });

    const response = await GET(new Request('https://app.test/api/health'));
    expect(response.status).toBe(200);

    const payload = await response.json();
    expect(payload.status).toBe('ok');
    expect(payload.supabase_ms).toEqual(expect.any(Number));
    expect(payload.edge_ms).toEqual(expect.any(Number));
    expect(payload.storage_ms).toEqual(expect.any(Number));
    expect(payload.version).toBe('1.2.3');
    expect(payload.env).toBe('preview');
  });

  it('returns degraded status when a probe fails and soft fail is enabled', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://demo.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
    process.env.NEXT_PUBLIC_BASE_URL = 'https://preview.example.com';
    process.env.HEALTH_SOFT_FAIL = 'true';

    const selectMock = vi.fn().mockResolvedValue({ error: { message: 'boom' } });
    const fromMock = vi.fn(() => ({ select: selectMock }));
    createClientMock.mockReturnValue({ from: fromMock } as any);

    (global.fetch as vi.Mock).mockResolvedValue(new Response(null, { status: 200 }));

    const response = await GET(new Request('https://app.test/api/health'));
    expect(response.status).toBe(200);

    const payload = await response.json();
    expect(payload.status).toBe('degraded');
    expect(payload.error).toContain('boom');
    expect(payload.failing_probe).toBe('supabase');
  });

  it('rejects calls without the required access key', async () => {
    process.env.HEALTH_ACCESS_KEY = 'secret';

    const response = await GET(new Request('https://app.test/api/health'));
    expect(response.status).toBe(401);
    expect(createClientMock).not.toHaveBeenCalled();
  });
});
