import { describe, it, expect, afterAll } from 'vitest';
import { createApp } from '../server';

const app = createApp();

afterAll(async () => {
  await app.close();
});

describe('health endpoints', () => {
  it('returns service status for /health without authentication', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['cache-control']).toBe('no-store');

    const payload = response.json();
    expect(payload).toMatchObject({
      ok: expect.any(Boolean),
      version: expect.any(String),
      services: expect.objectContaining({
        api: true,
      }),
    });
    expect(typeof payload.uptime).toBe('number');
    expect(payload.metrics).toEqual(
      expect.objectContaining({ rss: expect.any(Number), heapUsed: expect.any(Number) })
    );
  });

  it('aliases /api/healthz to the same payload', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/healthz' });

    expect(response.statusCode).toBe(200);
    const payload = response.json();
    expect(payload.services.api).toBe(true);
  });
});
