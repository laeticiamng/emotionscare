import { describe, it, expect } from 'vitest';
import { signJwt, verifyJwt } from './jwt';

describe('jwt', () => {
  it('signs and verifies token', async () => {
    process.env.JWT_SECRETS = 'secret1';
    const token = await signJwt({ sub: 'user1', role: 'b2c', aud: 'test' });
    const payload = await verifyJwt(token);
    expect(payload.sub).toBe('user1');
    expect(payload.role).toBe('b2c');
  });

  it('supports key rotation', async () => {
    process.env.JWT_SECRETS = 'secret2,secret1';
    const token = await signJwt({ sub: 'user2', role: 'b2c', aud: 'test' });
    const payload = await verifyJwt(token);
    expect(payload.sub).toBe('user2');
  });

  it('rejects invalid token', async () => {
    process.env.JWT_SECRETS = 'secret1';
    await expect(verifyJwt('invalid')).rejects.toThrow();
  });
});
