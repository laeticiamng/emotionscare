import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../server';
import { signJwt } from '../../lib/jwt';

let app: any;
let url: string;
beforeAll(async () => {
  // JWT_SECRETS is already set in setup.ts with 32+ characters
  process.env.HASH_PEPPER = 'pepper';
  app = createApp();
  await app.listen({ port: 0 });
  const address = app.server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  url = `http://127.0.0.1:${port}`;
}, 15000);

afterAll(async () => {
  if (app) {
    await app.close().catch(() => {});
  }
}, 15000);

describe.skip('auth', () => {
  it('rejects invalid token', async () => {
    const res = await fetch(url + '/api/v1/me/journal', {
      headers: { Authorization: 'Bearer invalid' },
    });
    expect(res.status).toBe(401);
  });

  it('rejects expired token', async () => {
    const token = await signJwt({ sub: 'u1', role: 'b2c', aud: 'test' }, { expiresIn: '1s' });
    await new Promise(r => setTimeout(r, 1100));
    const res = await fetch(url + '/api/v1/me/journal', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(401);
  });
});
