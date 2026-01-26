import { describe, it, expect } from 'vitest';
import {
  MeditationConfigSchema,
  CompleteMeditationSessionSchema,
} from '../types';

describe('Meditation schemas', () => {
  describe('MeditationConfigSchema', () => {
    it('valide une config correcte', () => {
      const result = MeditationConfigSchema.safeParse({
        technique: 'mindfulness',
        duration: 10,
        withGuidance: true,
        withMusic: true,
        volume: 50,
      });

      expect(result.success).toBe(true);
    });

    it('rejette une technique invalide', () => {
      const result = MeditationConfigSchema.safeParse({
        technique: 'invalid',
        duration: 10,
        withGuidance: true,
        withMusic: true,
        volume: 50,
      });

      expect(result.success).toBe(false);
    });

    it('rejette une durée hors limites', () => {
      const result = MeditationConfigSchema.safeParse({
        technique: 'mindfulness',
        duration: 100,
        withGuidance: true,
        withMusic: true,
        volume: 50,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('CompleteMeditationSessionSchema', () => {
    it('valide une complétion correcte', () => {
      const result = CompleteMeditationSessionSchema.safeParse({
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
        completedDuration: 580,
        moodAfter: 70,
      });

      expect(result.success).toBe(true);
    });

    it('rejette un UUID invalide', () => {
      const result = CompleteMeditationSessionSchema.safeParse({
        sessionId: 'invalid-uuid',
        completedDuration: 580,
      });

      expect(result.success).toBe(false);
    });
  });
});
