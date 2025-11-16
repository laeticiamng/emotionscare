import { describe, it, expect, beforeEach } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { securityPlugin } from './security';

describe('securityPlugin', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = Fastify({ logger: false });
  });

  afterEach(async () => {
    await app.close();
  });

  it('should register security plugin successfully', async () => {
    process.env.ALLOWED_ORIGINS = 'http://localhost:3000';

    await expect(app.register(securityPlugin)).resolves.not.toThrow();
  });

  it('should set security headers (Helmet)', async () => {
    process.env.ALLOWED_ORIGINS = 'http://localhost:3000';

    await app.register(securityPlugin);

    app.get('/test', async () => ({ ok: true }));

    const response = await app.inject({
      method: 'GET',
      url: '/test',
    });

    // Check for security headers set by Helmet
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBeTruthy();
  });

  it('should configure CORS with allowed origins', async () => {
    process.env.ALLOWED_ORIGINS = 'http://localhost:3000,http://localhost:5173';

    await app.register(securityPlugin);

    app.get('/test', async () => ({ ok: true }));

    const response = await app.inject({
      method: 'GET',
      url: '/test',
      headers: {
        origin: 'http://localhost:3000',
      },
    });

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  it('should block requests from unauthorized origins', async () => {
    process.env.ALLOWED_ORIGINS = 'http://localhost:3000';

    await app.register(securityPlugin);

    app.get('/test', async () => ({ ok: true }));

    const response = await app.inject({
      method: 'GET',
      url: '/test',
      headers: {
        origin: 'http://evil.com',
      },
    });

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('should allow OPTIONS preflight requests', async () => {
    process.env.ALLOWED_ORIGINS = 'http://localhost:3000';

    await app.register(securityPlugin);

    app.get('/test', async () => ({ ok: true }));

    const response = await app.inject({
      method: 'OPTIONS',
      url: '/test',
      headers: {
        origin: 'http://localhost:3000',
        'access-control-request-method': 'GET',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['access-control-allow-methods']).toBeTruthy();
  });

  it('should handle missing ALLOWED_ORIGINS gracefully', async () => {
    delete process.env.ALLOWED_ORIGINS;

    await app.register(securityPlugin);

    app.get('/test', async () => ({ ok: true }));

    const response = await app.inject({
      method: 'GET',
      url: '/test',
    });

    expect(response.statusCode).toBe(200);
  });
});
