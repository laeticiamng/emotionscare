import { describe, it, expect, beforeAll } from 'vitest';

describe('Music Generation Edge Function', () => {
  const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/music-generation`;

  beforeAll(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      throw new Error('VITE_SUPABASE_URL not configured');
    }
  });

  it('should handle OPTIONS request (CORS)', async () => {
    const response = await fetch(FUNCTION_URL, {
      method: 'OPTIONS',
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('should require authentication', async () => {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Relaxing music' }),
    });

    expect([401, 403]).toContain(response.status);
  });

  it('should validate prompt parameter', async () => {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({}),
    });

    expect([400, 401]).toContain(response.status);
  });
});
