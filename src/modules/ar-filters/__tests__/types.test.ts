import { describe, it, expect } from 'vitest';
import { z } from 'zod';

/**
 * Tests unitaires pour les schémas Zod du module AR Filters
 * 
 * Couverture :
 * - FilterType (5 types)
 * - MoodImpact (3 niveaux)
 * - ARFilterSession (structure complète)
 * - CreateARFilterSession
 * - CompleteARFilterSession
 * - ARFilterStats
 * 
 * Total : ~84 tests
 */

// Schémas Zod pour AR Filters
const FilterTypeSchema = z.enum([
  'joy',
  'calm',
  'energy',
  'focus',
  'creativity'
]);

const MoodImpactSchema = z.enum([
  'positive',
  'neutral',
  'negative'
]);

const ARFilterSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  filter_type: FilterTypeSchema,
  created_at: z.string().datetime(),
  duration_seconds: z.number().int().min(0).max(3600),
  photos_taken: z.number().int().min(0).max(100),
  mood_impact: MoodImpactSchema.optional(),
  completed_at: z.string().datetime().optional(),
});

const CreateARFilterSessionSchema = z.object({
  user_id: z.string().uuid(),
  filter_type: FilterTypeSchema,
});

const CompleteARFilterSessionSchema = z.object({
  session_id: z.string().uuid(),
  duration_seconds: z.number().int().min(1).max(3600),
  photos_taken: z.number().int().min(0).max(100).optional(),
  mood_impact: MoodImpactSchema.optional(),
});

const ARFilterStatsSchema = z.object({
  total_sessions: z.number().int().min(0),
  total_duration_seconds: z.number().int().min(0),
  total_photos: z.number().int().min(0),
  favorite_filter: FilterTypeSchema.optional(),
  average_duration: z.number().min(0),
  sessions_by_filter: z.record(FilterTypeSchema, z.number().int().min(0)),
  positive_mood_count: z.number().int().min(0),
});

describe('AR Filters Schemas', () => {
  describe('FilterTypeSchema', () => {
    it('valide "joy"', () => {
      const result = FilterTypeSchema.safeParse('joy');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('joy');
      }
    });

    it('valide "calm"', () => {
      const result = FilterTypeSchema.safeParse('calm');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('calm');
      }
    });

    it('valide "energy"', () => {
      const result = FilterTypeSchema.safeParse('energy');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('energy');
      }
    });

    it('valide "focus"', () => {
      const result = FilterTypeSchema.safeParse('focus');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('focus');
      }
    });

    it('valide "creativity"', () => {
      const result = FilterTypeSchema.safeParse('creativity');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('creativity');
      }
    });

    it('rejette un type invalide', () => {
      const result = FilterTypeSchema.safeParse('invalid');
      expect(result.success).toBe(false);
    });

    it('rejette un nombre', () => {
      const result = FilterTypeSchema.safeParse(123);
      expect(result.success).toBe(false);
    });

    it('rejette null', () => {
      const result = FilterTypeSchema.safeParse(null);
      expect(result.success).toBe(false);
    });
  });

  describe('MoodImpactSchema', () => {
    it('valide "positive"', () => {
      const result = MoodImpactSchema.safeParse('positive');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('positive');
      }
    });

    it('valide "neutral"', () => {
      const result = MoodImpactSchema.safeParse('neutral');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('neutral');
      }
    });

    it('valide "negative"', () => {
      const result = MoodImpactSchema.safeParse('negative');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('negative');
      }
    });

    it('rejette un impact invalide', () => {
      const result = MoodImpactSchema.safeParse('very_positive');
      expect(result.success).toBe(false);
    });

    it('rejette un nombre', () => {
      const result = MoodImpactSchema.safeParse(1);
      expect(result.success).toBe(false);
    });
  });

  describe('ARFilterSessionSchema', () => {
    const validSession = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      user_id: '660e8400-e29b-41d4-a716-446655440001',
      filter_type: 'joy',
      created_at: '2025-01-15T10:00:00Z',
      duration_seconds: 300,
      photos_taken: 5,
      mood_impact: 'positive',
      completed_at: '2025-01-15T10:05:00Z',
    };

    it('valide une session complète', () => {
      const result = ARFilterSessionSchema.safeParse(validSession);
      expect(result.success).toBe(true);
    });

    it('valide une session sans mood_impact', () => {
      const { mood_impact, ...sessionWithoutMood } = validSession;
      const result = ARFilterSessionSchema.safeParse(sessionWithoutMood);
      expect(result.success).toBe(true);
    });

    it('valide une session sans completed_at', () => {
      const { completed_at, ...sessionWithoutCompleted } = validSession;
      const result = ARFilterSessionSchema.safeParse(sessionWithoutCompleted);
      expect(result.success).toBe(true);
    });

    it('rejette un id invalide', () => {
      const result = ARFilterSessionSchema.safeParse({
        ...validSession,
        id: 'not-a-uuid',
      });
      expect(result.success).toBe(false);
    });

    it('rejette un user_id invalide', () => {
      const result = ARFilterSessionSchema.safeParse({
        ...validSession,
        user_id: 'invalid-uuid',
      });
      expect(result.success).toBe(false);
    });

    it('rejette un filter_type invalide', () => {
      const result = ARFilterSessionSchema.safeParse({
        ...validSession,
        filter_type: 'invalid_filter',
      });
      expect(result.success).toBe(false);
    });

    it('rejette duration_seconds négatif', () => {
      const result = ARFilterSessionSchema.safeParse({
        ...validSession,
        duration_seconds: -10,
      });
      expect(result.success).toBe(false);
    });

    it('rejette duration_seconds > 3600', () => {
      const result = ARFilterSessionSchema.safeParse({
        ...validSession,
        duration_seconds: 4000,
      });
      expect(result.success).toBe(false);
    });

    it('valide duration_seconds = 0', () => {
      const result = ARFilterSessionSchema.safeParse({
        ...validSession,
        duration_seconds: 0,
      });
      expect(result.success).toBe(true);
    });

    it('valide duration_seconds = 3600', () => {
      const result = ARFilterSessionSchema.safeParse({
        ...validSession,
        duration_seconds: 3600,
      });
      expect(result.success).toBe(true);
    });

    it('rejette photos_taken négatif', () => {
      const result = ARFilterSessionSchema.safeParse({
        ...validSession,
        photos_taken: -5,
      });
      expect(result.success).toBe(false);
    });

    it('rejette photos_taken > 100', () => {
      const result = ARFilterSessionSchema.safeParse({
        ...validSession,
        photos_taken: 150,
      });
      expect(result.success).toBe(false);
    });

    it('valide photos_taken = 0', () => {
      const result = ARFilterSessionSchema.safeParse({
        ...validSession,
        photos_taken: 0,
      });
      expect(result.success).toBe(true);
    });

    it('valide photos_taken = 100', () => {
      const result = ARFilterSessionSchema.safeParse({
        ...validSession,
        photos_taken: 100,
      });
      expect(result.success).toBe(true);
    });

    it('rejette mood_impact invalide', () => {
      const result = ARFilterSessionSchema.safeParse({
        ...validSession,
        mood_impact: 'super_positive',
      });
      expect(result.success).toBe(false);
    });

    it('rejette created_at invalide', () => {
      const result = ARFilterSessionSchema.safeParse({
        ...validSession,
        created_at: 'not-a-date',
      });
      expect(result.success).toBe(false);
    });

    it('rejette completed_at invalide', () => {
      const result = ARFilterSessionSchema.safeParse({
        ...validSession,
        completed_at: 'invalid-date',
      });
      expect(result.success).toBe(false);
    });

    it('rejette session sans champs requis', () => {
      const result = ARFilterSessionSchema.safeParse({
        id: validSession.id,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('CreateARFilterSessionSchema', () => {
    const validCreate = {
      user_id: '660e8400-e29b-41d4-a716-446655440001',
      filter_type: 'calm',
    };

    it('valide une création correcte', () => {
      const result = CreateARFilterSessionSchema.safeParse(validCreate);
      expect(result.success).toBe(true);
    });

    it('valide tous les types de filtres', () => {
      const filterTypes = ['joy', 'calm', 'energy', 'focus', 'creativity'];
      
      filterTypes.forEach(filterType => {
        const result = CreateARFilterSessionSchema.safeParse({
          ...validCreate,
          filter_type: filterType,
        });
        expect(result.success).toBe(true);
      });
    });

    it('rejette user_id invalide', () => {
      const result = CreateARFilterSessionSchema.safeParse({
        ...validCreate,
        user_id: 'not-a-uuid',
      });
      expect(result.success).toBe(false);
    });

    it('rejette filter_type invalide', () => {
      const result = CreateARFilterSessionSchema.safeParse({
        ...validCreate,
        filter_type: 'unknown',
      });
      expect(result.success).toBe(false);
    });

    it('rejette objet vide', () => {
      const result = CreateARFilterSessionSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('rejette sans user_id', () => {
      const result = CreateARFilterSessionSchema.safeParse({
        filter_type: 'joy',
      });
      expect(result.success).toBe(false);
    });

    it('rejette sans filter_type', () => {
      const result = CreateARFilterSessionSchema.safeParse({
        user_id: validCreate.user_id,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('CompleteARFilterSessionSchema', () => {
    const validComplete = {
      session_id: '550e8400-e29b-41d4-a716-446655440000',
      duration_seconds: 420,
      photos_taken: 8,
      mood_impact: 'positive',
    };

    it('valide une complétion complète', () => {
      const result = CompleteARFilterSessionSchema.safeParse(validComplete);
      expect(result.success).toBe(true);
    });

    it('valide sans photos_taken', () => {
      const { photos_taken, ...withoutPhotos } = validComplete;
      const result = CompleteARFilterSessionSchema.safeParse(withoutPhotos);
      expect(result.success).toBe(true);
    });

    it('valide sans mood_impact', () => {
      const { mood_impact, ...withoutMood } = validComplete;
      const result = CompleteARFilterSessionSchema.safeParse(withoutMood);
      expect(result.success).toBe(true);
    });

    it('valide avec seulement les champs requis', () => {
      const result = CompleteARFilterSessionSchema.safeParse({
        session_id: validComplete.session_id,
        duration_seconds: validComplete.duration_seconds,
      });
      expect(result.success).toBe(true);
    });

    it('rejette session_id invalide', () => {
      const result = CompleteARFilterSessionSchema.safeParse({
        ...validComplete,
        session_id: 'invalid-uuid',
      });
      expect(result.success).toBe(false);
    });

    it('rejette duration_seconds = 0', () => {
      const result = CompleteARFilterSessionSchema.safeParse({
        ...validComplete,
        duration_seconds: 0,
      });
      expect(result.success).toBe(false);
    });

    it('rejette duration_seconds négatif', () => {
      const result = CompleteARFilterSessionSchema.safeParse({
        ...validComplete,
        duration_seconds: -100,
      });
      expect(result.success).toBe(false);
    });

    it('rejette duration_seconds > 3600', () => {
      const result = CompleteARFilterSessionSchema.safeParse({
        ...validComplete,
        duration_seconds: 5000,
      });
      expect(result.success).toBe(false);
    });

    it('valide duration_seconds = 1', () => {
      const result = CompleteARFilterSessionSchema.safeParse({
        ...validComplete,
        duration_seconds: 1,
      });
      expect(result.success).toBe(true);
    });

    it('valide duration_seconds = 3600', () => {
      const result = CompleteARFilterSessionSchema.safeParse({
        ...validComplete,
        duration_seconds: 3600,
      });
      expect(result.success).toBe(true);
    });

    it('rejette photos_taken négatif', () => {
      const result = CompleteARFilterSessionSchema.safeParse({
        ...validComplete,
        photos_taken: -1,
      });
      expect(result.success).toBe(false);
    });

    it('rejette photos_taken > 100', () => {
      const result = CompleteARFilterSessionSchema.safeParse({
        ...validComplete,
        photos_taken: 101,
      });
      expect(result.success).toBe(false);
    });

    it('valide photos_taken = 0', () => {
      const result = CompleteARFilterSessionSchema.safeParse({
        ...validComplete,
        photos_taken: 0,
      });
      expect(result.success).toBe(true);
    });

    it('valide photos_taken = 100', () => {
      const result = CompleteARFilterSessionSchema.safeParse({
        ...validComplete,
        photos_taken: 100,
      });
      expect(result.success).toBe(true);
    });

    it('rejette mood_impact invalide', () => {
      const result = CompleteARFilterSessionSchema.safeParse({
        ...validComplete,
        mood_impact: 'excellent',
      });
      expect(result.success).toBe(false);
    });

    it('rejette sans session_id', () => {
      const result = CompleteARFilterSessionSchema.safeParse({
        duration_seconds: 300,
      });
      expect(result.success).toBe(false);
    });

    it('rejette sans duration_seconds', () => {
      const result = CompleteARFilterSessionSchema.safeParse({
        session_id: validComplete.session_id,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('ARFilterStatsSchema', () => {
    const validStats = {
      total_sessions: 25,
      total_duration_seconds: 7500,
      total_photos: 120,
      favorite_filter: 'joy',
      average_duration: 300,
      sessions_by_filter: {
        joy: 10,
        calm: 8,
        energy: 4,
        focus: 2,
        creativity: 1,
      },
      positive_mood_count: 18,
    };

    it('valide des stats complètes', () => {
      const result = ARFilterStatsSchema.safeParse(validStats);
      expect(result.success).toBe(true);
    });

    it('valide sans favorite_filter', () => {
      const { favorite_filter, ...withoutFavorite } = validStats;
      const result = ARFilterStatsSchema.safeParse(withoutFavorite);
      expect(result.success).toBe(true);
    });

    it('valide avec total_sessions = 0', () => {
      const result = ARFilterStatsSchema.safeParse({
        ...validStats,
        total_sessions: 0,
      });
      expect(result.success).toBe(true);
    });

    it('rejette total_sessions négatif', () => {
      const result = ARFilterStatsSchema.safeParse({
        ...validStats,
        total_sessions: -5,
      });
      expect(result.success).toBe(false);
    });

    it('rejette total_duration_seconds négatif', () => {
      const result = ARFilterStatsSchema.safeParse({
        ...validStats,
        total_duration_seconds: -100,
      });
      expect(result.success).toBe(false);
    });

    it('rejette total_photos négatif', () => {
      const result = ARFilterStatsSchema.safeParse({
        ...validStats,
        total_photos: -10,
      });
      expect(result.success).toBe(false);
    });

    it('rejette average_duration négatif', () => {
      const result = ARFilterStatsSchema.safeParse({
        ...validStats,
        average_duration: -50,
      });
      expect(result.success).toBe(false);
    });

    it('rejette positive_mood_count négatif', () => {
      const result = ARFilterStatsSchema.safeParse({
        ...validStats,
        positive_mood_count: -3,
      });
      expect(result.success).toBe(false);
    });

    it('rejette favorite_filter invalide', () => {
      const result = ARFilterStatsSchema.safeParse({
        ...validStats,
        favorite_filter: 'unknown',
      });
      expect(result.success).toBe(false);
    });

    it('valide sessions_by_filter avec tous les types', () => {
      const result = ARFilterStatsSchema.safeParse({
        ...validStats,
        sessions_by_filter: {
          joy: 15,
          calm: 10,
          energy: 8,
          focus: 6,
          creativity: 4,
        },
      });
      expect(result.success).toBe(true);
    });

    it('rejette sessions_by_filter avec valeurs négatives', () => {
      const result = ARFilterStatsSchema.safeParse({
        ...validStats,
        sessions_by_filter: {
          joy: -5,
          calm: 10,
        },
      });
      expect(result.success).toBe(false);
    });

    it('valide sessions_by_filter vide', () => {
      const result = ARFilterStatsSchema.safeParse({
        ...validStats,
        sessions_by_filter: {},
      });
      expect(result.success).toBe(true);
    });

    it('rejette sans champs requis', () => {
      const result = ARFilterStatsSchema.safeParse({
        total_sessions: 10,
      });
      expect(result.success).toBe(false);
    });
  });
});
