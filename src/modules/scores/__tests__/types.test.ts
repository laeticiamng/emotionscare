/**
 * Scores Module - Types Tests
 * Tests unitaires pour les schemas Zod du module Scores
 */

import { describe, it, expect } from 'vitest';
import {
  UserScore,
  ScoreHistory,
  VibeType,
  VibeMetrics,
  LeaderboardPeriod,
} from '../types';
import type {
  ScoreComponents,
  CurrentVibe,
  WeeklyMetrics,
  ScoreCalculationInput,
  ScoreCalculationResult,
  ScoreInsight,
  ScoreInsights,
  LeaderboardEntry,
  ScoreStatistics,
} from '../types';

describe('Scores Module - Zod Schemas', () => {
  describe('UserScore', () => {
    it('valide un score utilisateur complet', () => {
      const score = {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        emotional_score: 75,
        wellbeing_score: 80,
        engagement_score: 65,
        resilience_score: 70,
        week_number: 3,
        year: 2025,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };
      expect(() => UserScore.parse(score)).not.toThrow();
    });

    it('valide un score sans resilience_score', () => {
      const score = {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        emotional_score: 75,
        wellbeing_score: 80,
        engagement_score: 65,
        week_number: 3,
        year: 2025,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };
      expect(() => UserScore.parse(score)).not.toThrow();
    });

    it('rejette un score hors limites (> 100)', () => {
      const score = {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        emotional_score: 110,
        wellbeing_score: 80,
        engagement_score: 65,
        week_number: 3,
        year: 2025,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };
      expect(() => UserScore.parse(score)).toThrow();
    });

    it('rejette un score négatif', () => {
      const score = {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        emotional_score: -5,
        wellbeing_score: 80,
        engagement_score: 65,
        week_number: 3,
        year: 2025,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };
      expect(() => UserScore.parse(score)).toThrow();
    });

    it('rejette un numéro de semaine invalide (0)', () => {
      const score = {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        emotional_score: 75,
        wellbeing_score: 80,
        engagement_score: 65,
        week_number: 0,
        year: 2025,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };
      expect(() => UserScore.parse(score)).toThrow();
    });

    it('rejette un numéro de semaine invalide (> 53)', () => {
      const score = {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        emotional_score: 75,
        wellbeing_score: 80,
        engagement_score: 65,
        week_number: 54,
        year: 2025,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };
      expect(() => UserScore.parse(score)).toThrow();
    });
  });

  describe('ScoreHistory', () => {
    it('valide un historique complet', () => {
      const history = {
        scores: [
          {
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            emotional_score: 75,
            wellbeing_score: 80,
            engagement_score: 65,
            week_number: 1,
            year: 2025,
            created_at: '2025-01-05T10:00:00Z',
            updated_at: '2025-01-05T10:00:00Z',
          },
          {
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            emotional_score: 78,
            wellbeing_score: 82,
            engagement_score: 70,
            week_number: 2,
            year: 2025,
            created_at: '2025-01-12T10:00:00Z',
            updated_at: '2025-01-12T10:00:00Z',
          },
        ],
        trend: 'up',
        average: 76.5,
        change_percentage: 4,
        period_days: 14,
      };
      expect(() => ScoreHistory.parse(history)).not.toThrow();
    });

    it('valide tous les types de trends', () => {
      const trends = ['up', 'down', 'stable'] as const;
      trends.forEach((trend) => {
        const history = {
          scores: [],
          trend,
          average: 50,
          change_percentage: 0,
          period_days: 7,
        };
        expect(() => ScoreHistory.parse(history)).not.toThrow();
      });
    });

    it('rejette une moyenne hors limites', () => {
      const history = {
        scores: [],
        trend: 'stable',
        average: 150,
        change_percentage: 0,
        period_days: 7,
      };
      expect(() => ScoreHistory.parse(history)).toThrow();
    });
  });

  describe('VibeType', () => {
    it('valide tous les types de vibes', () => {
      const vibes = [
        'energized',
        'calm',
        'creative',
        'focused',
        'social',
        'reflective',
        'playful',
        'determined',
        'peaceful',
        'anxious',
        'tired',
        'overwhelmed',
        'neutral',
        'joyful',
        'melancholic',
      ];
      vibes.forEach((vibe) => {
        expect(() => VibeType.parse(vibe)).not.toThrow();
      });
    });

    it('rejette un vibe invalide', () => {
      expect(() => VibeType.parse('unknown')).toThrow();
      expect(() => VibeType.parse('happy')).toThrow();
    });
  });

  describe('VibeMetrics', () => {
    it('valide des métriques complètes', () => {
      const metrics = {
        current_vibe: 'energized',
        vibe_intensity: 80,
        vibe_duration_hours: 2.5,
        recent_activities: ['meditation', 'exercise', 'breathing'],
        contributing_factors: [
          { factor: 'sleep_quality', impact: 30 },
          { factor: 'exercise', impact: 25 },
          { factor: 'weather', impact: -10 },
        ],
        recommended_modules: ['mood-mixer', 'breath'],
      };
      expect(() => VibeMetrics.parse(metrics)).not.toThrow();
    });

    it('valide des métriques minimales', () => {
      const metrics = {
        current_vibe: 'neutral',
        vibe_intensity: 50,
        vibe_duration_hours: 0,
        recent_activities: [],
        contributing_factors: [],
      };
      expect(() => VibeMetrics.parse(metrics)).not.toThrow();
    });

    it('rejette une intensité hors limites', () => {
      const metrics = {
        current_vibe: 'calm',
        vibe_intensity: 150,
        vibe_duration_hours: 1,
        recent_activities: [],
        contributing_factors: [],
      };
      expect(() => VibeMetrics.parse(metrics)).toThrow();
    });

    it('rejette un impact hors limites', () => {
      const metrics = {
        current_vibe: 'calm',
        vibe_intensity: 50,
        vibe_duration_hours: 1,
        recent_activities: [],
        contributing_factors: [
          { factor: 'test', impact: 150 },
        ],
      };
      expect(() => VibeMetrics.parse(metrics)).toThrow();
    });

    it('valide un impact négatif', () => {
      const metrics = {
        current_vibe: 'tired',
        vibe_intensity: 60,
        vibe_duration_hours: 3,
        recent_activities: [],
        contributing_factors: [
          { factor: 'poor_sleep', impact: -50 },
        ],
      };
      expect(() => VibeMetrics.parse(metrics)).not.toThrow();
    });
  });

  describe('LeaderboardPeriod', () => {
    it('valide toutes les périodes', () => {
      const periods = ['daily', 'weekly', 'monthly', 'all_time'];
      periods.forEach((period) => {
        expect(() => LeaderboardPeriod.parse(period)).not.toThrow();
      });
    });

    it('rejette une période invalide', () => {
      expect(() => LeaderboardPeriod.parse('yearly')).toThrow();
    });
  });
});

describe('Scores Module - TypeScript Types', () => {
  describe('ScoreComponents interface', () => {
    it('accepte des composants valides', () => {
      const components: ScoreComponents = {
        emotional: {
          score: 75,
          trend: 'up',
          factors: {
            mood_consistency: 80,
            positive_emotions: 70,
            negative_emotions: 30,
            emotional_range: 50,
          },
        },
        wellbeing: {
          score: 80,
          trend: 'stable',
          factors: {
            activities_completed: 85,
            sleep_quality: 70,
            stress_level: 40,
            self_care: 75,
          },
        },
        engagement: {
          score: 65,
          trend: 'down',
          factors: {
            session_frequency: 60,
            module_diversity: 70,
            achievement_progress: 50,
            community_participation: 40,
          },
        },
      };
      expect(components.emotional.score).toBe(75);
      expect(components.wellbeing.trend).toBe('stable');
    });
  });

  describe('CurrentVibe interface', () => {
    it('accepte un vibe actuel valide', () => {
      const vibe: CurrentVibe = {
        vibe: 'energized',
        intensity: 85,
        emoji: '⚡',
        color: '#FFD700',
        description: 'Vous vous sentez plein d\'énergie',
      };
      expect(vibe.vibe).toBe('energized');
      expect(vibe.intensity).toBe(85);
    });
  });

  describe('WeeklyMetrics interface', () => {
    it('accepte des métriques hebdomadaires valides', () => {
      const metrics: WeeklyMetrics = {
        week_number: 3,
        year: 2025,
        emotional_score: 75,
        wellbeing_score: 80,
        engagement_score: 65,
        total_sessions: 12,
        total_minutes: 180,
        modules_used: ['breath', 'meditation', 'journal'],
        achievements_unlocked: 2,
        mood_range: {
          min: 40,
          max: 90,
          average: 65,
        },
        dominant_emotions: [
          { emotion: 'calm', percentage: 40 },
          { emotion: 'joy', percentage: 30 },
        ],
        best_day: {
          date: '2025-01-15',
          score: 90,
        },
        challenges_faced: 3,
      };
      expect(metrics.total_sessions).toBe(12);
      expect(metrics.modules_used.length).toBe(3);
    });
  });

  describe('ScoreInsight interface', () => {
    it('accepte un insight valide', () => {
      const insight: ScoreInsight = {
        type: 'positive',
        category: 'emotional',
        title: 'Amélioration de l\'humeur',
        message: 'Votre score émotionnel s\'améliore',
        score_impact: 10,
        recommendations: ['Continuer la méditation'],
        priority: 'medium',
      };
      expect(insight.type).toBe('positive');
      expect(insight.priority).toBe('medium');
    });
  });

  describe('LeaderboardEntry interface', () => {
    it('accepte une entrée de classement valide', () => {
      const entry: LeaderboardEntry = {
        user_id: 'user123',
        username: 'TopPlayer',
        avatar_url: 'https://example.com/avatar.png',
        total_score: 5000,
        rank: 1,
        badge_count: 10,
        achievement_count: 25,
        streak_days: 30,
      };
      expect(entry.rank).toBe(1);
      expect(entry.streak_days).toBe(30);
    });
  });

  describe('ScoreStatistics interface', () => {
    it('accepte des statistiques valides', () => {
      const stats: ScoreStatistics = {
        user_id: 'user123',
        total_score_entries: 52,
        highest_emotional_score: 95,
        highest_wellbeing_score: 90,
        highest_engagement_score: 85,
        average_emotional_score: 72,
        average_wellbeing_score: 75,
        average_engagement_score: 68,
        best_week: {
          week_number: 25,
          year: 2025,
          score: 92,
        },
        improvement_rate: 2.5,
        consistency_rating: 85,
        last_updated: '2025-01-15T10:00:00Z',
      };
      expect(stats.improvement_rate).toBe(2.5);
      expect(stats.best_week.score).toBe(92);
    });
  });
});
