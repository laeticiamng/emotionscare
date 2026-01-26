import { describe, it, expect } from 'vitest';
import {
  CreateNyveeSessionSchema,
  CompleteNyveeSessionSchema,
  NyveeStatsSchema,
} from '../types';

describe('Nyvee schemas', () => {
  describe('CreateNyveeSessionSchema', () => {
    it('valide une config correcte', () => {
      const result = CreateNyveeSessionSchema.safeParse({
        intensity: 'calm',
        targetCycles: 6,
        moodBefore: 50,
      });

      expect(result.success).toBe(true);
    });

    it('rejette une intensité invalide', () => {
      const result = CreateNyveeSessionSchema.safeParse({
        intensity: 'invalid',
        targetCycles: 6,
      });

      expect(result.success).toBe(false);
    });

    it('applique les valeurs par défaut', () => {
      const result = CreateNyveeSessionSchema.safeParse({
        intensity: 'moderate',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.targetCycles).toBe(6);
      }
    });
  });

  describe('CompleteNyveeSessionSchema', () => {
    it('valide une complétion correcte', () => {
      const result = CompleteNyveeSessionSchema.safeParse({
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
        cyclesCompleted: 6,
        badgeEarned: 'calm',
        moodAfter: 70,
      });

      expect(result.success).toBe(true);
    });

    it('rejette un UUID invalide', () => {
      const result = CompleteNyveeSessionSchema.safeParse({
        sessionId: 'invalid-uuid',
        cyclesCompleted: 6,
        badgeEarned: 'calm',
      });

      expect(result.success).toBe(false);
    });

    it('accepte un cocoon débloqué', () => {
      const result = CompleteNyveeSessionSchema.safeParse({
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
        cyclesCompleted: 6,
        badgeEarned: 'calm',
        cocoonUnlocked: 'cosmos',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('NyveeStatsSchema', () => {
    it('valide des stats complètes', () => {
      const result = NyveeStatsSchema.safeParse({
        totalSessions: 10,
        totalCycles: 60,
        averageCyclesPerSession: 6,
        completionRate: 95,
        currentStreak: 5,
        longestStreak: 12,
        favoriteIntensity: 'calm',
        cocoonsUnlocked: ['crystal', 'cosmos', 'water'],
        avgMoodDelta: 15,
        badgesEarned: {
          calm: 8,
          partial: 2,
          tense: 0,
        },
      });

      expect(result.success).toBe(true);
    });

    it('accepte favoriteIntensity null', () => {
      const result = NyveeStatsSchema.safeParse({
        totalSessions: 0,
        totalCycles: 0,
        averageCyclesPerSession: 0,
        completionRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        favoriteIntensity: null,
        cocoonsUnlocked: [],
        avgMoodDelta: null,
        badgesEarned: {
          calm: 0,
          partial: 0,
          tense: 0,
        },
      });

      expect(result.success).toBe(true);
    });
  });
});
