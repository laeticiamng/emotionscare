import { describe, it, expect, vi, afterEach } from 'vitest';
import { handler } from '../functions/music-daily-user/index.ts';
import * as auth from '../functions/_shared/auth.ts';

describe('music-daily-user', () => {
  afterEach(() => vi.restoreAllMocks());

  it('returns array for authenticated user', async () => {
    vi.spyOn(auth, 'authorizeRole').mockResolvedValue({
      user: { id: 'u1', role: 'b2c' },
      status: 200
    } as any);

    const res = await handler(new Request('https://x/music/daily'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
