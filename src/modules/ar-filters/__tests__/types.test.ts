/**
 * Tests unitaires pour les types et schémas Zod du module AR Filters
 * Day 37 - Module 20: AR Filters
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';

/**
 * Schémas Zod pour AR Filters
 */

// Types de filtres AR disponibles
export const ARFilterTypeSchema = z.enum([
  'joy',
  'calm',
  'energetic',
  'zen',
  'focus',
  'creative',
  'motivated',
  'peaceful'
]);

// Impact émotionnel du filtre
export const MoodImpactSchema = z.enum([
  'positive',
  'neutral',
  'negative',
  'very_positive'
]);

// Configuration d'un filtre AR
export const ARFilterConfigSchema = z.object({
  name: z.string().min(1).max(50),
  emoji: z.string().min(1).max(10),
  type: ARFilterTypeSchema,
  description: z.string().max(200).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  effects: z.array(z.string()).optional()
});

// Session de filtre AR
export const ARFilterSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  filter_type: ARFilterTypeSchema,
  duration_seconds: z.number().int().min(0),
  photos_taken: z.number().int().min(0).default(0),
  mood_impact: MoodImpactSchema.optional(),
  created_at: z.string().datetime(),
  completed_at: z.string().datetime().optional()
});

// Création d'une session
export const CreateARFilterSessionSchema = z.object({
  filterType: ARFilterTypeSchema
});

// Mise à jour d'une session
export const UpdateARFilterSessionSchema = z.object({
  sessionId: z.string().uuid(),
  duration: z.number().int().min(0).optional(),
  photosTaken: z.number().int().min(0).optional(),
  moodImpact: MoodImpactSchema.optional()
});

// Statistiques AR Filters
export const ARFilterStatsSchema = z.object({
  totalSessions: z.number().int().min(0),
  totalPhotosTaken: z.number().int().min(0),
  favoriteFilter: ARFilterTypeSchema,
  averageDuration: z.number().min(0),
  moodImprovementRate: z.number().min(0).max(100).optional()
});

// Historique utilisateur
export const ARFilterHistorySchema = z.object({
  sessions: z.array(ARFilterSessionSchema),
  stats: ARFilterStatsSchema,
  recentFilters: z.array(ARFilterTypeSchema)
});

// Export des types TypeScript
export type ARFilterType = z.infer<typeof ARFilterTypeSchema>;
export type MoodImpact = z.infer<typeof MoodImpactSchema>;
export type ARFilterConfig = z.infer<typeof ARFilterConfigSchema>;
export type ARFilterSession = z.infer<typeof ARFilterSessionSchema>;
export type CreateARFilterSession = z.infer<typeof CreateARFilterSessionSchema>;
export type UpdateARFilterSession = z.infer<typeof UpdateARFilterSessionSchema>;
export type ARFilterStats = z.infer<typeof ARFilterStatsSchema>;
export type ARFilterHistory = z.infer<typeof ARFilterHistorySchema>;

/**
 * Tests pour ARFilterTypeSchema
 */
describe('ARFilterTypeSchema', () => {
  it('valide les types de filtres valides', () => {
    expect(ARFilterTypeSchema.parse('joy')).toBe('joy');
    expect(ARFilterTypeSchema.parse('calm')).toBe('calm');
    expect(ARFilterTypeSchema.parse('energetic')).toBe('energetic');
    expect(ARFilterTypeSchema.parse('zen')).toBe('zen');
    expect(ARFilterTypeSchema.parse('focus')).toBe('focus');
    expect(ARFilterTypeSchema.parse('creative')).toBe('creative');
    expect(ARFilterTypeSchema.parse('motivated')).toBe('motivated');
    expect(ARFilterTypeSchema.parse('peaceful')).toBe('peaceful');
  });

  it('rejette les types de filtres invalides', () => {
    expect(() => ARFilterTypeSchema.parse('invalid')).toThrow();
    expect(() => ARFilterTypeSchema.parse('')).toThrow();
    expect(() => ARFilterTypeSchema.parse(123)).toThrow();
  });
});

/**
 * Tests pour MoodImpactSchema
 */
describe('MoodImpactSchema', () => {
  it('valide les impacts émotionnels valides', () => {
    expect(MoodImpactSchema.parse('positive')).toBe('positive');
    expect(MoodImpactSchema.parse('neutral')).toBe('neutral');
    expect(MoodImpactSchema.parse('negative')).toBe('negative');
    expect(MoodImpactSchema.parse('very_positive')).toBe('very_positive');
  });

  it('rejette les impacts invalides', () => {
    expect(() => MoodImpactSchema.parse('invalid')).toThrow();
    expect(() => MoodImpactSchema.parse('very_negative')).toThrow();
  });
});

/**
 * Tests pour ARFilterConfigSchema
 */
describe('ARFilterConfigSchema', () => {
  const validConfig: ARFilterConfig = {
    name: 'Joyeux',
    emoji: '😊',
    type: 'joy',
    description: 'Un filtre joyeux pour améliorer l\'humeur',
    color: '#FFD700',
    effects: ['brightness', 'saturation']
  };

  it('valide une configuration complète', () => {
    expect(ARFilterConfigSchema.parse(validConfig)).toEqual(validConfig);
  });

  it('valide une configuration minimale', () => {
    const minimal = {
      name: 'Calme',
      emoji: '😌',
      type: 'calm'
    };
    expect(ARFilterConfigSchema.parse(minimal)).toEqual(minimal);
  });

  it('rejette un nom vide', () => {
    expect(() => ARFilterConfigSchema.parse({ ...validConfig, name: '' })).toThrow();
  });

  it('rejette un nom trop long', () => {
    expect(() => ARFilterConfigSchema.parse({ 
      ...validConfig, 
      name: 'a'.repeat(51) 
    })).toThrow();
  });

  it('rejette une couleur invalide', () => {
    expect(() => ARFilterConfigSchema.parse({ 
      ...validConfig, 
      color: 'invalid' 
    })).toThrow();
  });
});

/**
 * Tests pour ARFilterSessionSchema
 */
describe('ARFilterSessionSchema', () => {
  const validSession: ARFilterSession = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    user_id: '123e4567-e89b-12d3-a456-426614174001',
    filter_type: 'joy',
    duration_seconds: 300,
    photos_taken: 5,
    mood_impact: 'positive',
    created_at: '2024-01-01T10:00:00Z',
    completed_at: '2024-01-01T10:05:00Z'
  };

  it('valide une session complète', () => {
    expect(ARFilterSessionSchema.parse(validSession)).toEqual(validSession);
  });

  it('valide une session sans completion', () => {
    const { completed_at, ...incomplete } = validSession;
    expect(ARFilterSessionSchema.parse(incomplete)).toEqual(incomplete);
  });

  it('rejette une durée négative', () => {
    expect(() => ARFilterSessionSchema.parse({ 
      ...validSession, 
      duration_seconds: -1 
    })).toThrow();
  });

  it('rejette un nombre de photos négatif', () => {
    expect(() => ARFilterSessionSchema.parse({ 
      ...validSession, 
      photos_taken: -1 
    })).toThrow();
  });

  it('rejette un UUID invalide', () => {
    expect(() => ARFilterSessionSchema.parse({ 
      ...validSession, 
      id: 'invalid-uuid' 
    })).toThrow();
  });
});

/**
 * Tests pour CreateARFilterSessionSchema
 */
describe('CreateARFilterSessionSchema', () => {
  it('valide une création valide', () => {
    const create: CreateARFilterSession = { filterType: 'joy' };
    expect(CreateARFilterSessionSchema.parse(create)).toEqual(create);
  });

  it('rejette un type de filtre invalide', () => {
    expect(() => CreateARFilterSessionSchema.parse({ 
      filterType: 'invalid' 
    })).toThrow();
  });

  it('rejette un objet vide', () => {
    expect(() => CreateARFilterSessionSchema.parse({})).toThrow();
  });
});

/**
 * Tests pour UpdateARFilterSessionSchema
 */
describe('UpdateARFilterSessionSchema', () => {
  const validUpdate: UpdateARFilterSession = {
    sessionId: '123e4567-e89b-12d3-a456-426614174000',
    duration: 300,
    photosTaken: 5,
    moodImpact: 'positive'
  };

  it('valide une mise à jour complète', () => {
    expect(UpdateARFilterSessionSchema.parse(validUpdate)).toEqual(validUpdate);
  });

  it('valide une mise à jour partielle', () => {
    const partial = { sessionId: validUpdate.sessionId, duration: 100 };
    expect(UpdateARFilterSessionSchema.parse(partial)).toEqual(partial);
  });

  it('rejette un sessionId invalide', () => {
    expect(() => UpdateARFilterSessionSchema.parse({ 
      ...validUpdate, 
      sessionId: 'invalid' 
    })).toThrow();
  });

  it('rejette une durée négative', () => {
    expect(() => UpdateARFilterSessionSchema.parse({ 
      ...validUpdate, 
      duration: -1 
    })).toThrow();
  });
});

/**
 * Tests pour ARFilterStatsSchema
 */
describe('ARFilterStatsSchema', () => {
  const validStats: ARFilterStats = {
    totalSessions: 42,
    totalPhotosTaken: 156,
    favoriteFilter: 'joy',
    averageDuration: 285.5,
    moodImprovementRate: 87.5
  };

  it('valide des statistiques complètes', () => {
    expect(ARFilterStatsSchema.parse(validStats)).toEqual(validStats);
  });

  it('valide des statistiques sans taux d\'amélioration', () => {
    const { moodImprovementRate, ...withoutRate } = validStats;
    expect(ARFilterStatsSchema.parse(withoutRate)).toEqual(withoutRate);
  });

  it('rejette un nombre de sessions négatif', () => {
    expect(() => ARFilterStatsSchema.parse({ 
      ...validStats, 
      totalSessions: -1 
    })).toThrow();
  });

  it('rejette un taux d\'amélioration > 100', () => {
    expect(() => ARFilterStatsSchema.parse({ 
      ...validStats, 
      moodImprovementRate: 101 
    })).toThrow();
  });

  it('rejette un taux d\'amélioration négatif', () => {
    expect(() => ARFilterStatsSchema.parse({ 
      ...validStats, 
      moodImprovementRate: -5 
    })).toThrow();
  });
});

/**
 * Tests pour ARFilterHistorySchema
 */
describe('ARFilterHistorySchema', () => {
  const validHistory: ARFilterHistory = {
    sessions: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        filter_type: 'joy',
        duration_seconds: 300,
        photos_taken: 5,
        created_at: '2024-01-01T10:00:00Z'
      }
    ],
    stats: {
      totalSessions: 1,
      totalPhotosTaken: 5,
      favoriteFilter: 'joy',
      averageDuration: 300
    },
    recentFilters: ['joy', 'calm', 'zen']
  };

  it('valide un historique complet', () => {
    expect(ARFilterHistorySchema.parse(validHistory)).toEqual(validHistory);
  });

  it('valide un historique vide', () => {
    const empty: ARFilterHistory = {
      sessions: [],
      stats: {
        totalSessions: 0,
        totalPhotosTaken: 0,
        favoriteFilter: 'joy',
        averageDuration: 0
      },
      recentFilters: []
    };
    expect(ARFilterHistorySchema.parse(empty)).toEqual(empty);
  });

  it('rejette un historique avec sessions invalides', () => {
    expect(() => ARFilterHistorySchema.parse({
      ...validHistory,
      sessions: [{ invalid: 'session' }]
    })).toThrow();
  });
});
