import { describe, expect, it } from 'vitest';

import {
  emotionInputSchema,
  emotionAnalysisSchema,
  emotionPlanSchema,
} from '@/features/emotion-sessions/emotionSessionSchema';

describe('emotionSession schemas', () => {
  describe('emotionInputSchema - happy path', () => {
    it('validates text input', () => {
      const result = emotionInputSchema.parse({
        inputType: 'text',
        text: 'Je me sens stressé mais motivé pour avancer.',
        intensity: 7,
        contextTags: ['travail'],
      });

      expect(result.inputType).toBe('text');
      expect(result.intensity).toBe(7);
    });

    it('validates choice input', () => {
      const result = emotionInputSchema.parse({
        inputType: 'choice',
        selectedEmotion: 'joie',
        intensity: 8,
        contextTags: ['famille'],
      });

      expect(result.inputType).toBe('choice');
      expect(result.selectedEmotion).toBe('joie');
      expect(result.intensity).toBe(8);
    });
  });

  describe('emotionInputSchema - validation failures', () => {
    it('fails when text input is too short (< 10 characters)', () => {
      expect(() =>
        emotionInputSchema.parse({
          inputType: 'text',
          text: 'trop',
          intensity: 5,
        })
      ).toThrow('Décrivez votre ressenti (10 caractères minimum).');
    });

    it('fails when text input is missing for text inputType', () => {
      expect(() =>
        emotionInputSchema.parse({
          inputType: 'text',
          intensity: 5,
        })
      ).toThrow('Décrivez votre ressenti (10 caractères minimum).');
    });

    it('fails when text is too long (> 500 characters)', () => {
      const longText = 'a'.repeat(501);
      expect(() =>
        emotionInputSchema.parse({
          inputType: 'text',
          text: longText,
          intensity: 5,
        })
      ).toThrow('500 caractères maximum');
    });

    it('fails when selectedEmotion is missing for choice inputType', () => {
      expect(() =>
        emotionInputSchema.parse({
          inputType: 'choice',
          intensity: 5,
        })
      ).toThrow('Sélectionnez une émotion dans la roue.');
    });

    it('fails when intensity is 0', () => {
      expect(() =>
        emotionInputSchema.parse({
          inputType: 'text',
          text: 'Je me sens bien aujourd\'hui',
          intensity: 0,
        })
      ).toThrow();
    });

    it('fails when intensity is 11', () => {
      expect(() =>
        emotionInputSchema.parse({
          inputType: 'text',
          text: 'Je me sens bien aujourd\'hui',
          intensity: 11,
        })
      ).toThrow();
    });

    it('fails when intensity is negative', () => {
      expect(() =>
        emotionInputSchema.parse({
          inputType: 'text',
          text: 'Je me sens bien aujourd\'hui',
          intensity: -5,
        })
      ).toThrow();
    });

    it('fails when intensity is not an integer', () => {
      expect(() =>
        emotionInputSchema.parse({
          inputType: 'text',
          text: 'Je me sens bien aujourd\'hui',
          intensity: 5.5,
        })
      ).toThrow();
    });
  });

  describe('emotionAnalysisSchema - happy path', () => {
    it('validates analysis response', () => {
      const parsed = emotionAnalysisSchema.parse({
        sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        detectedEmotions: [
          { label: 'stress', intensity: 0.7, confidence: 0.9, valence: -0.4 },
        ],
        primaryEmotion: 'stress',
        valence: -0.4,
        arousal: 0.7,
        summary: 'Je détecte une tension élevée avec une motivation sous-jacente.',
        modelVersion: 'gpt-4.1',
      });

      expect(parsed.detectedEmotions[0].label).toBe('stress');
    });
  });

  describe('emotionAnalysisSchema - validation failures', () => {
    it('fails with invalid UUID for sessionId', () => {
      expect(() =>
        emotionAnalysisSchema.parse({
          sessionId: 'not-a-valid-uuid',
          detectedEmotions: [
            { label: 'stress', intensity: 0.7 },
          ],
          primaryEmotion: 'stress',
          valence: -0.4,
          arousal: 0.7,
          summary: 'Test summary',
        })
      ).toThrow();
    });

    it('accepts empty detectedEmotions array (schema does not enforce minimum)', () => {
      const parsed = emotionAnalysisSchema.parse({
        sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        detectedEmotions: [],
        primaryEmotion: 'stress',
        valence: -0.4,
        arousal: 0.7,
        summary: 'Test summary',
      });

      expect(parsed.detectedEmotions).toHaveLength(0);
    });

    it('fails when detected emotion intensity is out of range (> 1)', () => {
      expect(() =>
        emotionAnalysisSchema.parse({
          sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          detectedEmotions: [
            { label: 'stress', intensity: 1.5 },
          ],
          primaryEmotion: 'stress',
          valence: -0.4,
          arousal: 0.7,
          summary: 'Test summary',
        })
      ).toThrow();
    });

    it('fails when detected emotion intensity is negative', () => {
      expect(() =>
        emotionAnalysisSchema.parse({
          sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          detectedEmotions: [
            { label: 'stress', intensity: -0.1 },
          ],
          primaryEmotion: 'stress',
          valence: -0.4,
          arousal: 0.7,
          summary: 'Test summary',
        })
      ).toThrow();
    });

    it('fails when valence is out of range (< -1)', () => {
      expect(() =>
        emotionAnalysisSchema.parse({
          sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          detectedEmotions: [
            { label: 'stress', intensity: 0.7 },
          ],
          primaryEmotion: 'stress',
          valence: -1.5,
          arousal: 0.7,
          summary: 'Test summary',
        })
      ).toThrow();
    });

    it('fails when valence is out of range (> 1)', () => {
      expect(() =>
        emotionAnalysisSchema.parse({
          sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          detectedEmotions: [
            { label: 'stress', intensity: 0.7 },
          ],
          primaryEmotion: 'stress',
          valence: 1.5,
          arousal: 0.7,
          summary: 'Test summary',
        })
      ).toThrow();
    });

    it('fails when arousal is out of range (< 0)', () => {
      expect(() =>
        emotionAnalysisSchema.parse({
          sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          detectedEmotions: [
            { label: 'stress', intensity: 0.7 },
          ],
          primaryEmotion: 'stress',
          valence: -0.4,
          arousal: -0.1,
          summary: 'Test summary',
        })
      ).toThrow();
    });

    it('fails when arousal is out of range (> 1)', () => {
      expect(() =>
        emotionAnalysisSchema.parse({
          sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          detectedEmotions: [
            { label: 'stress', intensity: 0.7 },
          ],
          primaryEmotion: 'stress',
          valence: -0.4,
          arousal: 1.1,
          summary: 'Test summary',
        })
      ).toThrow();
    });

    it('fails when summary is empty', () => {
      expect(() =>
        emotionAnalysisSchema.parse({
          sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          detectedEmotions: [
            { label: 'stress', intensity: 0.7 },
          ],
          primaryEmotion: 'stress',
          valence: -0.4,
          arousal: 0.7,
          summary: '',
        })
      ).toThrow();
    });
  });

  describe('emotionAnalysisSchema - edge cases and optional fields', () => {
    it('accepts analysis without optional modelVersion', () => {
      const parsed = emotionAnalysisSchema.parse({
        sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        detectedEmotions: [
          { label: 'stress', intensity: 0.7 },
        ],
        primaryEmotion: 'stress',
        valence: -0.4,
        arousal: 0.7,
        summary: 'Test summary',
      });

      expect(parsed.modelVersion).toBeUndefined();
    });

    it('accepts detected emotions without optional confidence', () => {
      const parsed = emotionAnalysisSchema.parse({
        sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        detectedEmotions: [
          { label: 'stress', intensity: 0.7 },
        ],
        primaryEmotion: 'stress',
        valence: -0.4,
        arousal: 0.7,
        summary: 'Test summary',
      });

      expect(parsed.detectedEmotions[0].confidence).toBeUndefined();
    });

    it('accepts detected emotions without optional valence', () => {
      const parsed = emotionAnalysisSchema.parse({
        sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        detectedEmotions: [
          { label: 'stress', intensity: 0.7 },
        ],
        primaryEmotion: 'stress',
        valence: -0.4,
        arousal: 0.7,
        summary: 'Test summary',
      });

      expect(parsed.detectedEmotions[0].valence).toBeUndefined();
    });

    it('accepts valence at exact lower bound (-1)', () => {
      const parsed = emotionAnalysisSchema.parse({
        sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        detectedEmotions: [
          { label: 'stress', intensity: 0.7 },
        ],
        primaryEmotion: 'stress',
        valence: -1,
        arousal: 0.7,
        summary: 'Test summary',
      });

      expect(parsed.valence).toBe(-1);
    });

    it('accepts valence at exact upper bound (1)', () => {
      const parsed = emotionAnalysisSchema.parse({
        sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        detectedEmotions: [
          { label: 'stress', intensity: 0.7 },
        ],
        primaryEmotion: 'stress',
        valence: 1,
        arousal: 0.7,
        summary: 'Test summary',
      });

      expect(parsed.valence).toBe(1);
    });

    it('accepts arousal at exact lower bound (0)', () => {
      const parsed = emotionAnalysisSchema.parse({
        sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        detectedEmotions: [
          { label: 'stress', intensity: 0.7 },
        ],
        primaryEmotion: 'stress',
        valence: -0.4,
        arousal: 0,
        summary: 'Test summary',
      });

      expect(parsed.arousal).toBe(0);
    });

    it('accepts arousal at exact upper bound (1)', () => {
      const parsed = emotionAnalysisSchema.parse({
        sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        detectedEmotions: [
          { label: 'stress', intensity: 0.7 },
        ],
        primaryEmotion: 'stress',
        valence: -0.4,
        arousal: 1,
        summary: 'Test summary',
      });

      expect(parsed.arousal).toBe(1);
    });
  });

  describe('emotionPlanSchema - happy path', () => {
    it('validates plan response', () => {
      const parsed = emotionPlanSchema.parse({
        planId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        estimatedDurationMin: 12,
        recommendations: [
          { type: 'breathing', title: 'Respiration carrée', description: '4 cycles lents', priority: 1 },
          { type: 'music', title: 'Ambiance apaisante', description: 'Musique douce', priority: 2 },
          { type: 'light', title: 'Lumière chaude', description: 'Intensité douce', priority: 3 },
        ],
      });

      expect(parsed.recommendations).toHaveLength(3);
    });
  });

  describe('emotionPlanSchema - validation failures', () => {
    it('fails with invalid UUID for planId', () => {
      expect(() =>
        emotionPlanSchema.parse({
          planId: 'invalid-uuid',
          sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          estimatedDurationMin: 12,
          recommendations: [
            { type: 'breathing', title: 'Test', description: 'Test', priority: 1 },
            { type: 'music', title: 'Test', description: 'Test', priority: 2 },
            { type: 'light', title: 'Test', description: 'Test', priority: 3 },
          ],
        })
      ).toThrow();
    });

    it('fails with invalid UUID for sessionId', () => {
      expect(() =>
        emotionPlanSchema.parse({
          planId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
          sessionId: 'not-a-uuid',
          estimatedDurationMin: 12,
          recommendations: [
            { type: 'breathing', title: 'Test', description: 'Test', priority: 1 },
            { type: 'music', title: 'Test', description: 'Test', priority: 2 },
            { type: 'light', title: 'Test', description: 'Test', priority: 3 },
          ],
        })
      ).toThrow();
    });

    it('fails with fewer than 3 recommendations', () => {
      expect(() =>
        emotionPlanSchema.parse({
          planId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
          sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          estimatedDurationMin: 12,
          recommendations: [
            { type: 'breathing', title: 'Test', description: 'Test', priority: 1 },
            { type: 'music', title: 'Test', description: 'Test', priority: 2 },
          ],
        })
      ).toThrow();
    });

    it('fails when estimatedDurationMin is 0', () => {
      expect(() =>
        emotionPlanSchema.parse({
          planId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
          sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          estimatedDurationMin: 0,
          recommendations: [
            { type: 'breathing', title: 'Test', description: 'Test', priority: 1 },
            { type: 'music', title: 'Test', description: 'Test', priority: 2 },
            { type: 'light', title: 'Test', description: 'Test', priority: 3 },
          ],
        })
      ).toThrow();
    });

    it('fails when recommendation priority is 0', () => {
      expect(() =>
        emotionPlanSchema.parse({
          planId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
          sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          estimatedDurationMin: 12,
          recommendations: [
            { type: 'breathing', title: 'Test', description: 'Test', priority: 0 },
            { type: 'music', title: 'Test', description: 'Test', priority: 2 },
            { type: 'light', title: 'Test', description: 'Test', priority: 3 },
          ],
        })
      ).toThrow();
    });
  });

  describe('emotionPlanSchema - edge cases and optional fields', () => {
    it('accepts plan with optional durationMin in recommendations', () => {
      const parsed = emotionPlanSchema.parse({
        planId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        estimatedDurationMin: 12,
        recommendations: [
          { type: 'breathing', title: 'Test', description: 'Test', priority: 1, durationMin: 5 },
          { type: 'music', title: 'Test', description: 'Test', priority: 2 },
          { type: 'light', title: 'Test', description: 'Test', priority: 3 },
        ],
      });

      expect(parsed.recommendations[0].durationMin).toBe(5);
      expect(parsed.recommendations[1].durationMin).toBeUndefined();
    });

    it('accepts plan with exactly 3 recommendations', () => {
      const parsed = emotionPlanSchema.parse({
        planId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        estimatedDurationMin: 12,
        recommendations: [
          { type: 'breathing', title: 'Test', description: 'Test', priority: 1 },
          { type: 'music', title: 'Test', description: 'Test', priority: 2 },
          { type: 'light', title: 'Test', description: 'Test', priority: 3 },
        ],
      });

      expect(parsed.recommendations).toHaveLength(3);
    });

    it('accepts plan with more than 3 recommendations', () => {
      const parsed = emotionPlanSchema.parse({
        planId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        sessionId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        estimatedDurationMin: 12,
        recommendations: [
          { type: 'breathing', title: 'Test', description: 'Test', priority: 1 },
          { type: 'music', title: 'Test', description: 'Test', priority: 2 },
          { type: 'light', title: 'Test', description: 'Test', priority: 3 },
          { type: 'journaling', title: 'Test', description: 'Test', priority: 4 },
          { type: 'grounding', title: 'Test', description: 'Test', priority: 5 },
        ],
      });

      expect(parsed.recommendations).toHaveLength(5);
    });
  });
});
