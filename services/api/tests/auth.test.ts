import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../server';
import { signJwt } from '../../lib/jwt';

let app: any;
let url: string;

beforeAll(async () => {
  process.env.JWT_SECRETS = 'test-secret';
  process.env.HASH_PEPPER = 'pepper';
  app = createApp();
  await app.listen({ port: 0 });
  const address = app.server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  url = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  await app.close();
});

describe('auth', () => {
  it('rejects invalid token', async () => {
    const res = await fetch(url + '/api/v1/me/journal', {
      headers: { Authorization: 'Bearer invalid' },
    });
    expect(res.status).toBe(401);
  });

  it('rejects expired token', async () => {
    const token = await signJwt({ sub: 'u1', role: 'b2c', aud: 'test' }, { expiresIn: '1ms' });
    await new Promise(r => setTimeout(r, 5));
    const res = await fetch(url + '/api/v1/me/journal', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(401);
  });
});
