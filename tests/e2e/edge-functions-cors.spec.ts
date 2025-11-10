import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yaincoxihiqdksxgrsrk.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

test.describe('Edge Functions CORS Security', () => {
  const testEdgeFunctions = [
    'openai-emotion-analysis',
    'ai-coach-response',
    'analyze-voice-hume',
    'hume-analysis',
  ];

  test('Edge Function → accepte requête depuis domaine autorisé (*.emotionscare.ai)', async ({ request }) => {
    const functionUrl = `${SUPABASE_URL}/functions/v1/openai-emotion-analysis`;
    
    const response = await request.post(functionUrl, {
      headers: {
        'Origin': 'https://app.emotionscare.ai',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      data: {
        text: 'Je me sens bien aujourd\'hui',
      },
      failOnStatusCode: false,
    });

    // Should allow request (even if 401/400, CORS should pass)
    const allowOrigin = response.headers()['access-control-allow-origin'];
    expect(allowOrigin).toBe('https://app.emotionscare.ai');
  });

  test('Edge Function → accepte requête depuis domaine dev (*.lovable.app)', async ({ request }) => {
    const functionUrl = `${SUPABASE_URL}/functions/v1/openai-emotion-analysis`;
    
    const response = await request.post(functionUrl, {
      headers: {
        'Origin': 'https://emotive-journey.lovable.app',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      data: {
        text: 'Test depuis lovable.app',
      },
      failOnStatusCode: false,
    });

    const allowOrigin = response.headers()['access-control-allow-origin'];
    expect(allowOrigin).toBe('https://emotive-journey.lovable.app');
  });

  test('Edge Function → BLOQUE requête depuis domaine non autorisé', async ({ request }) => {
    const functionUrl = `${SUPABASE_URL}/functions/v1/openai-emotion-analysis`;
    
    const response = await request.post(functionUrl, {
      headers: {
        'Origin': 'https://evil-attacker.com',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      data: {
        text: 'Tentative d\'attaque',
      },
      failOnStatusCode: false,
    });

    // CORS should block: no Access-Control-Allow-Origin or 403
    const allowOrigin = response.headers()['access-control-allow-origin'];
    expect(allowOrigin).toBeUndefined();
    
    // Should return 403 Forbidden for unauthorized origin
    expect(response.status()).toBe(403);
    
    const body = await response.json();
    expect(body.error).toMatch(/origin_not_allowed|forbidden/i);
  });

  test('Edge Function → gère preflight OPTIONS correctement', async ({ request }) => {
    const functionUrl = `${SUPABASE_URL}/functions/v1/openai-emotion-analysis`;
    
    const response = await request.fetch(functionUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://app.emotionscare.ai',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type,authorization',
      },
    });

    // Preflight should return 204 No Content
    expect(response.status()).toBe(204);
    
    // Should include CORS headers
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBe('https://app.emotionscare.ai');
    expect(headers['access-control-allow-methods']).toContain('POST');
    expect(headers['access-control-allow-headers']).toMatch(/authorization.*content-type/i);
  });

  test('Plusieurs Edge Functions → toutes protégées par CORS liste blanche', async ({ request }) => {
    for (const functionName of testEdgeFunctions) {
      const functionUrl = `${SUPABASE_URL}/functions/v1/${functionName}`;
      
      const response = await request.post(functionUrl, {
        headers: {
          'Origin': 'https://malicious-domain.com',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        data: { test: 'data' },
        failOnStatusCode: false,
      });

      // All functions should reject unauthorized origins
      const allowOrigin = response.headers()['access-control-allow-origin'];
      expect(allowOrigin, `Function ${functionName} should not allow malicious-domain.com`).toBeUndefined();
      expect(response.status()).toBe(403);
    }
  });

  test('Edge Function → header Vary: Origin présent pour cache correct', async ({ request }) => {
    const functionUrl = `${SUPABASE_URL}/functions/v1/openai-emotion-analysis`;
    
    const response = await request.post(functionUrl, {
      headers: {
        'Origin': 'https://app.emotionscare.ai',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      data: { text: 'Test Vary header' },
      failOnStatusCode: false,
    });

    // Vary: Origin header should be present to ensure proper caching
    const varyHeader = response.headers()['vary'];
    expect(varyHeader).toContain('Origin');
  });
});
