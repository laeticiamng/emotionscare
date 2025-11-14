/**
 * Tests unitaires pour EmotionAnalysisService
 *
 * @module EmotionAnalysisService.test
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EmotionAnalysisService, EmotionAnalysisResult } from './EmotionAnalysisService';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock ai-monitoring
vi.mock('@/lib/ai-monitoring', () => ({
  captureException: vi.fn(),
}));

import { supabase } from '@/integrations/supabase/client';

describe('EmotionAnalysisService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('analyzeText', () => {
    it('devrait analyser du texte avec succès', async () => {
      // Mock réponse
      const mockResponse = {
        data: {
          dominant_emotion: 'joy',
          emotions: [
            { emotion: 'joy', score: 0.9, confidence: 0.9 },
            { emotion: 'happiness', score: 0.7, confidence: 0.7 },
          ],
          confidence: 0.9,
          valence: 0.8,
          sentiment: 'positive',
        },
        error: null,
      };

      vi.mocked(supabase.functions.invoke).mockResolvedValue(mockResponse);

      const result = await EmotionAnalysisService.analyzeText({
        text: 'Je suis très heureux!',
        language: 'fr',
      });

      expect(result).toBeDefined();
      expect(result.dominant_emotion).toBe('joy');
      expect(result.emotions).toHaveLength(2);
      expect(result.confidence).toBe(0.9);
      expect(result.metadata?.source).toBe('text');
    });

    it('devrait gérer les erreurs correctement', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: null,
        error: { message: 'Network error' },
      });

      await expect(
        EmotionAnalysisService.analyzeText({ text: 'Test' })
      ).rejects.toThrow();
    });

    it('devrait normaliser les résultats Hume AI', async () => {
      const mockHumeResponse = {
        data: {
          predictions: [{
            models: {
              language: {
                emotions: [
                  { name: 'Joy', score: 0.85 },
                  { name: 'Excitement', score: 0.72 },
                ],
              },
            },
          }],
        },
        error: null,
      };

      vi.mocked(supabase.functions.invoke).mockResolvedValue(mockHumeResponse);

      const result = await EmotionAnalysisService.analyzeText({ text: 'Test' });

      expect(result.emotions).toBeDefined();
      expect(result.emotions.length).toBeGreaterThan(0);
      expect(result.dominant_emotion).toBeDefined();
    });
  });

  describe('analyzeVoice', () => {
    it('devrait analyser un audio avec succès', async () => {
      const mockAudioBlob = new Blob(['audio data'], { type: 'audio/wav' });

      const mockResponse = {
        data: {
          dominant_emotion: 'sadness',
          emotions: [
            { emotion: 'sadness', score: 0.75 },
          ],
          confidence: 0.75,
        },
        error: null,
      };

      vi.mocked(supabase.functions.invoke).mockResolvedValue(mockResponse);

      const result = await EmotionAnalysisService.analyzeVoice({
        audioBlob: mockAudioBlob,
        language: 'fr',
      });

      expect(result).toBeDefined();
      expect(result.dominant_emotion).toBe('sadness');
      expect(result.metadata?.source).toBe('voice');
    });
  });

  describe('analyzeCamera', () => {
    it('devrait analyser une image avec succès', async () => {
      const mockResponse = {
        data: {
          dominant_emotion: 'surprise',
          emotions: [
            { emotion: 'surprise', score: 0.8 },
          ],
          confidence: 0.8,
        },
        error: null,
      };

      vi.mocked(supabase.functions.invoke).mockResolvedValue(mockResponse);

      const result = await EmotionAnalysisService.analyzeCamera({
        imageData: 'data:image/png;base64,iVBORw0KGgo...',
        mode: 'sam-camera',
      });

      expect(result).toBeDefined();
      expect(result.dominant_emotion).toBe('surprise');
      expect(result.metadata?.source).toBe('camera');
    });
  });

  describe('analyzeMultiModal', () => {
    it('devrait analyser plusieurs sources', async () => {
      const mockResponse = {
        data: {
          dominant_emotion: 'joy',
          emotions: [{ emotion: 'joy', score: 0.9 }],
          confidence: 0.9,
        },
        error: null,
      };

      vi.mocked(supabase.functions.invoke).mockResolvedValue(mockResponse);

      const result = await EmotionAnalysisService.analyzeMultiModal({
        text: 'Super!',
        emojis: ['😊', '🎉'],
      });

      expect(result).toBeDefined();
      expect(result.dominant_emotion).toBe('joy');
    });
  });

  describe('analyzeEmoji', () => {
    it('devrait analyser des emojis', async () => {
      const mockResponse = {
        data: {
          dominant_emotion: 'joy',
          emotions: [{ emotion: 'joy', score: 0.95 }],
          confidence: 0.95,
        },
        error: null,
      };

      vi.mocked(supabase.functions.invoke).mockResolvedValue(mockResponse);

      const result = await EmotionAnalysisService.analyzeEmoji({
        emojis: ['😊', '❤️', '🎉'],
        context: 'Célébration',
      });

      expect(result).toBeDefined();
      expect(result.dominant_emotion).toBe('joy');
    });
  });

  describe('formatForDisplay', () => {
    it('devrait formater un résultat pour l\'affichage', () => {
      const mockResult: EmotionAnalysisResult = {
        dominant_emotion: 'joy',
        emotions: [
          { emotion: 'joy', score: 0.9 },
          { emotion: 'happiness', score: 0.7 },
          { emotion: 'excitement', score: 0.6 },
        ],
        confidence: 0.9,
        sentiment: 'positive',
        summary: 'Analyse positive',
        metadata: {
          source: 'text',
          timestamp: new Date().toISOString(),
        },
      };

      const display = EmotionAnalysisService.formatForDisplay(mockResult);

      expect(display.title).toContain('joy');
      expect(display.emotionsList).toContain('joy');
      expect(display.color).toBeDefined();
      expect(display.description).toBeDefined();
    });
  });

  describe('calculateEmotionalScore', () => {
    it('devrait calculer le score émotionnel avec valence', () => {
      const mockResult: EmotionAnalysisResult = {
        dominant_emotion: 'joy',
        emotions: [],
        confidence: 0.9,
        valence: 0.8, // Valence positive
        metadata: {
          source: 'text',
          timestamp: new Date().toISOString(),
        },
      };

      const score = EmotionAnalysisService.calculateEmotionalScore(mockResult);

      expect(score).toBeGreaterThan(50); // Score positif
      expect(score).toBeLessThanOrEqual(100);
    });

    it('devrait calculer le score émotionnel avec sentiment', () => {
      const mockResult: EmotionAnalysisResult = {
        dominant_emotion: 'sadness',
        emotions: [],
        confidence: 0.7,
        sentiment: 'negative',
        metadata: {
          source: 'text',
          timestamp: new Date().toISOString(),
        },
      };

      const score = EmotionAnalysisService.calculateEmotionalScore(mockResult);

      expect(score).toBeLessThanOrEqual(50); // Score négatif
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('devrait gérer un score neutre', () => {
      const mockResult: EmotionAnalysisResult = {
        dominant_emotion: 'neutral',
        emotions: [],
        confidence: 0.5,
        sentiment: 'neutral',
        metadata: {
          source: 'text',
          timestamp: new Date().toISOString(),
        },
      };

      const score = EmotionAnalysisService.calculateEmotionalScore(mockResult);

      expect(score).toBeCloseTo(50, 10); // Proche de 50 pour neutre
    });
  });

  describe('Retry Logic', () => {
    it('devrait réessayer en cas d\'erreur', async () => {
      vi.mocked(supabase.functions.invoke)
        .mockResolvedValueOnce({ data: null, error: { message: 'Temporary error' } })
        .mockResolvedValueOnce({ data: null, error: { message: 'Temporary error' } })
        .mockResolvedValueOnce({
          data: {
            dominant_emotion: 'joy',
            emotions: [{ emotion: 'joy', score: 0.9 }],
            confidence: 0.9,
          },
          error: null,
        });

      const result = await EmotionAnalysisService.analyzeText({ text: 'Test' });

      expect(result).toBeDefined();
      expect(supabase.functions.invoke).toHaveBeenCalledTimes(3);
    });

    it('devrait abandonner après le nombre max de retries', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: null,
        error: { message: 'Persistent error' },
      });

      await expect(
        EmotionAnalysisService.analyzeText({ text: 'Test' })
      ).rejects.toThrow();

      // MAX_RETRIES = 2, donc 1 tentative initiale + 2 retries = 3 appels
      expect(supabase.functions.invoke).toHaveBeenCalledTimes(3);
    });
  });

  describe('Error Handling', () => {
    it('devrait gérer les timeouts', async () => {
      vi.mocked(supabase.functions.invoke).mockImplementation(() => {
        return new Promise((_, reject) => {
          const error: any = new Error('Timeout');
          error.name = 'AbortError';
          reject(error);
        });
      });

      await expect(
        EmotionAnalysisService.analyzeText({ text: 'Test' })
      ).rejects.toThrow(/Timeout/);
    });

    it('devrait gérer les rate limits', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: null,
        error: { status: 429, message: 'Rate limit exceeded' },
      });

      await expect(
        EmotionAnalysisService.analyzeText({ text: 'Test' })
      ).rejects.toThrow(/Rate limit/);
    });

    it('devrait gérer les erreurs serveur', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: null,
        error: { status: 500, message: 'Internal server error' },
      });

      await expect(
        EmotionAnalysisService.analyzeText({ text: 'Test' })
      ).rejects.toThrow(/serveur/);
    });
  });

  describe('Normalisation', () => {
    it('devrait normaliser un résultat déjà au bon format', async () => {
      const validResult = {
        dominant_emotion: 'joy',
        emotions: [{ emotion: 'joy', score: 0.9, confidence: 0.9 }],
        confidence: 0.9,
        valence: 0.8,
        sentiment: 'positive' as const,
        metadata: {
          source: 'text' as const,
          timestamp: new Date().toISOString(),
        },
      };

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: validResult,
        error: null,
      });

      const result = await EmotionAnalysisService.analyzeText({ text: 'Test' });

      expect(result.dominant_emotion).toBe('joy');
      expect(result.emotions).toHaveLength(1);
    });

    it('devrait inférer le sentiment depuis l\'émotion', async () => {
      const mockResult = {
        emotion: 'sadness',
        emotions: [],
        confidence: 0.7,
      };

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: mockResult,
        error: null,
      });

      const result = await EmotionAnalysisService.analyzeText({ text: 'Test' });

      expect(result.sentiment).toBe('negative');
    });
  });
});
