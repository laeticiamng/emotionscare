import { describe, it, expect, beforeAll } from 'vitest';

describe('Emotion Analytics Edge Function', () => {
  const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/emotion-analytics`;

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
      body: JSON.stringify({ period: '7d' }),
    });

    expect([401, 403]).toContain(response.status);
  });

  it('should validate period parameter', async () => {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ period: 'invalid' }),
    });

    expect([400, 401]).toContain(response.status);
  });
});
