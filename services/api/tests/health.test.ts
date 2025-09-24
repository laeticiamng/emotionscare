import { describe, it, expect, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { createApp } from '../server';

const app = createApp();

const originalFetch = global.fetch;

const createResponse = (status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: { get: () => null } as Record<string, unknown>,
  json: async () => ({}),
  text: async () => '',
});

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  process.env.SUPABASE_URL = 'https://supabase.test';
  process.env.SUPABASE_ANON_KEY = 'anon';
  process.env.HEALTH_STORAGE_URL = 'https://storage.test/ping';
  process.env.HEALTH_FUNCTIONS = 'ai-emotion-analysis,ai-coach';
  process.env.RELEASE_VERSION = '1.2.0-test';

  fetchMock = vi.fn();
  global.fetch = fetchMock as unknown as typeof global.fetch;
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.resetAllMocks();
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_ANON_KEY;
  delete process.env.HEALTH_STORAGE_URL;
  delete process.env.HEALTH_FUNCTIONS;
  delete process.env.RELEASE_VERSION;
});

afterAll(async () => {
  await app.close();
});

describe('health endpoints', () => {
  it('returns service status for /health without authentication', async () => {
    fetchMock
      .mockResolvedValueOnce(createResponse(200))
      .mockResolvedValueOnce(createResponse(200))
      .mockResolvedValueOnce(createResponse(200))
      .mockResolvedValueOnce(createResponse(200))
      .mockResolvedValueOnce(createResponse(200));

    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['cache-control']).toBe('no-store');

    const payload = response.json();
    expect(payload).toMatchObject({
      status: 'ok',
      version: '1.2.0-test',
      timestamp: expect.any(String),
      signature: expect.any(String),
      checks: {
        supabase: expect.objectContaining({ status: 'ok', latency_ms: expect.any(Number) }),
        storage: expect.objectContaining({ status: 'ok', latency_ms: expect.any(Number) }),
        functions: expect.any(Array),
      },
    });
    expect(payload.runtime).toMatchObject({
      node: expect.stringMatching(/^v\d+/),
      environment: expect.any(String),
      platform: expect.any(String),
    });
    expect(payload.uptime).toMatchObject({
      seconds: expect.any(Number),
      since: expect.any(String),
    });
    expect(payload.uptime.seconds).toBeGreaterThanOrEqual(0);
    expect(payload.signature.length).toBeGreaterThan(10);
    expect(payload.checks.functions).toHaveLength(2);
    expect(payload.checks.functions[0]).toEqual(
      expect.objectContaining({ name: 'ai-emotion-analysis', latency_ms: expect.any(Number) })
    );
  });

  it('aliases /api/healthz to the same payload', async () => {
    fetchMock
      .mockResolvedValueOnce(createResponse(200))
      .mockResolvedValueOnce(createResponse(200))
      .mockResolvedValueOnce(createResponse(200))
      .mockResolvedValueOnce(createResponse(200))
      .mockResolvedValueOnce(createResponse(200));

    const response = await app.inject({ method: 'GET', url: '/api/healthz' });

    expect(response.statusCode).toBe(200);
    const payload = response.json();
    expect(payload.status).toBe('ok');
    expect(payload.version).toBe('1.2.0-test');
  });

  it('marks status degraded when a critical function is down', async () => {
    fetchMock
      .mockResolvedValueOnce(createResponse(200))
      .mockResolvedValueOnce(createResponse(200))
      .mockResolvedValueOnce(createResponse(503))
      .mockResolvedValueOnce(createResponse(200))
      .mockResolvedValueOnce(createResponse(200));

    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    const payload = response.json();
    expect(payload.status).toBe('degraded');
    expect(payload.checks.functions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'ai-emotion-analysis', status: 'down' }),
      ]),
    );
  });
});
