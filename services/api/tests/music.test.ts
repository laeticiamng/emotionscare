import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { createApp } from '../server';
import { signJwt } from '../../lib/jwt';

let app: any;
let url: string;
let token: string;

beforeAll(async () => {
  process.env.JWT_SECRETS = 'test-secret';
  process.env.HASH_PEPPER = 'pepper';
  token = await signJwt({ sub: 'user-1', role: 'b2c', aud: 'test-suite' });

  app = createApp();
  await app.listen({ port: 0 });
  const address = app.server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  url = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  await app.close();
});

describe('POST /api/mood_playlist', () => {
  it('returns an adaptive playlist for the requested mood', async () => {
    const res = await fetch(url + '/api/mood_playlist', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mood: 'calm',
        duration_minutes: 18,
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data).toMatchObject({
      playlist_id: 'calm_relax',
      mood: 'calm',
      unit: 'seconds',
    });
    expect(Array.isArray(body.data.tracks)).toBe(true);
    expect(body.data.tracks.length).toBeGreaterThan(0);
    expect(body.data.energy_profile.baseline).toBeCloseTo(0.2, 1);
  });

  it('adapts the recommended energy based on intensity and context', async () => {
    const res = await fetch(url + '/api/mood_playlist', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mood: 'calm',
        intensity: 0.8,
        context: { activity: 'mood-boost' },
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data.energy_profile.recommended).toBeGreaterThan(body.data.energy_profile.baseline);
    expect(body.data.energy_profile.recommended).toBeLessThanOrEqual(1);
  });

  it('rejects invalid payloads with 422 status', async () => {
    const res = await fetch(url + '/api/mood_playlist', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('invalid_payload');
  });
});

