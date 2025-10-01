// @ts-nocheck
import { describe, it, expect, vi, afterEach } from 'vitest';
import { handler } from '../functions/music-weekly-org/index.ts';
import * as auth from '../functions/_shared/auth.ts';

describe('music-weekly-org', () => {
  afterEach(() => vi.restoreAllMocks());

  it('allows access when org matches', async () => {
    vi.spyOn(auth, 'authorizeRole').mockResolvedValue({
      user: { id: 'u1', role: 'b2b_admin', org_id: 'abc' },
      status: 200
    } as any);

    const res = await handler(new Request('https://x/org/abc/music/weekly'));
    expect(res.status).toBe(200);
  });

  it('denies access when org mismatches', async () => {
    vi.spyOn(auth, 'authorizeRole').mockResolvedValue({
      user: { id: 'u1', role: 'b2b_admin', org_id: 'abc' },
      status: 200
    } as any);

    const res = await handler(new Request('https://x/org/other/music/weekly'));
    expect(res.status).toBe(403);
  });
});
