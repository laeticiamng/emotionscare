import { describe, it, expect, beforeAll } from 'vitest';

/**
 * Tests pour les Edge Functions de génération musicale Suno
 * Couvre: suno-music, emotion-music-ai
 */
describe('Suno Music Edge Functions', () => {
  const SUNO_MUSIC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/suno-music`;
  const EMOTION_MUSIC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/emotion-music-ai`;

  beforeAll(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      throw new Error('VITE_SUPABASE_URL not configured');
    }
  });

  describe('suno-music', () => {
    it('should handle OPTIONS request (CORS)', async () => {
      const response = await fetch(SUNO_MUSIC_URL, {
        method: 'OPTIONS',
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('should return fallback when no API key', async () => {
      const response = await fetch(SUNO_MUSIC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', mood: 'calm' }),
      });

      // Sans clé API, retourne un fallback avec success: true
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it('should handle health check', async () => {
      const response = await fetch(SUNO_MUSIC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'health-check' }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.status).toBe('ok');
    });

    it('should handle credits check', async () => {
      const response = await fetch(SUNO_MUSIC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'credits' }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('credits');
    });

    it('should return fallback for unknown action', async () => {
      const response = await fetch(SUNO_MUSIC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unknown-action' }),
      });

      // Retourne un fallback même pour action inconnue
      expect(response.status).toBe(200);
    });
  });

  describe('emotion-music-ai', () => {
    it('should handle OPTIONS request (CORS)', async () => {
      const response = await fetch(EMOTION_MUSIC_URL, {
        method: 'OPTIONS',
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('should require authentication for analyze-emotions', async () => {
      const response = await fetch(EMOTION_MUSIC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze-emotions' }),
      });

      expect([401, 403]).toContain(response.status);
    });

    it('should require authentication for generate-music', async () => {
      const response = await fetch(EMOTION_MUSIC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate-music', emotion: 'calm' }),
      });

      expect([401, 403]).toContain(response.status);
    });

    it('should require authentication for check-status', async () => {
      const response = await fetch(EMOTION_MUSIC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check-status', sunoTaskId: 'test-id' }),
      });

      expect([401, 403]).toContain(response.status);
    });
  });
});
