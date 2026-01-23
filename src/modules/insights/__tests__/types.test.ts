/**
 * Insights Module - Types Tests
 * Tests unitaires pour les schemas Zod du module Insights
 */

import { describe, it, expect } from 'vitest';
import {
  InsightType,
  InsightPriority,
  InsightStatus,
  InsightCategory,
  ActionItem,
  Insight,
} from '../types';
import type {
  CreateInsight,
  InsightStats,
  InsightFilters,
  InsightPaginationOptions,
  InsightGenerationContext,
  InsightFeedback,
  InsightExportOptions,
} from '../types';

describe('Insights Module - Zod Schemas', () => {
  describe('InsightType', () => {
    it('valide tous les types d\'insights', () => {
      const types = ['trend', 'suggestion', 'pattern', 'goal', 'warning', 'achievement', 'reminder'];
      types.forEach((type) => {
        expect(() => InsightType.parse(type)).not.toThrow();
      });
    });

    it('rejette un type invalide', () => {
      expect(() => InsightType.parse('unknown')).toThrow();
      expect(() => InsightType.parse('tip')).toThrow();
    });
  });

  describe('InsightPriority', () => {
    it('valide toutes les priorités', () => {
      const priorities = ['high', 'medium', 'low'];
      priorities.forEach((priority) => {
        expect(() => InsightPriority.parse(priority)).not.toThrow();
      });
    });

    it('rejette une priorité invalide', () => {
      expect(() => InsightPriority.parse('urgent')).toThrow();
      expect(() => InsightPriority.parse('critical')).toThrow();
    });
  });

  describe('InsightStatus', () => {
    it('valide tous les statuts', () => {
      const statuses = ['new', 'read', 'applied', 'dismissed', 'reminded', 'expired'];
      statuses.forEach((status) => {
        expect(() => InsightStatus.parse(status)).not.toThrow();
      });
    });

    it('rejette un statut invalide', () => {
      expect(() => InsightStatus.parse('pending')).toThrow();
    });
  });

  describe('InsightCategory', () => {
    it('valide toutes les catégories', () => {
      const categories = ['emotional', 'behavioral', 'therapeutic', 'social', 'progress', 'health'];
      categories.forEach((category) => {
        expect(() => InsightCategory.parse(category)).not.toThrow();
      });
    });

    it('rejette une catégorie invalide', () => {
      expect(() => InsightCategory.parse('personal')).toThrow();
    });
  });

  describe('ActionItem', () => {
    it('valide une action complète', () => {
      const action = {
        id: 'action1',
        label: 'Commencer une méditation',
        type: 'navigate',
        target: '/meditation',
        completed: false,
      };
      expect(() => ActionItem.parse(action)).not.toThrow();
    });

    it('valide une action minimale', () => {
      const action = {
        id: 'action2',
        label: 'Définir un objectif',
        type: 'goal',
      };
      const parsed = ActionItem.parse(action);
      expect(parsed.completed).toBe(false);
    });

    it('valide tous les types d\'actions', () => {
      const types = ['navigate', 'schedule', 'goal', 'custom'] as const;
      types.forEach((type) => {
        const action = {
          id: 'test',
          label: 'Test action',
          type,
        };
        expect(() => ActionItem.parse(action)).not.toThrow();
      });
    });

    it('rejette un type d\'action invalide', () => {
      const action = {
        id: 'test',
        label: 'Test',
        type: 'invalid',
      };
      expect(() => ActionItem.parse(action)).toThrow();
    });
  });

  describe('Insight', () => {
    it('valide un insight complet', () => {
      const insight = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        insight_type: 'suggestion',
        title: 'Essayez la méditation matinale',
        description: 'Vos données montrent que vous êtes plus calme le matin',
        priority: 'medium',
        category: 'therapeutic',
        action_items: [
          {
            id: 'a1',
            label: 'Méditer 10 min',
            type: 'navigate',
            target: '/meditation',
            completed: false,
          },
        ],
        is_read: false,
        status: 'new',
        impact_score: 75,
        confidence: 0.85,
        source_data: { analysis_type: 'time_pattern' },
        expires_at: '2025-01-20T00:00:00Z',
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => Insight.parse(insight)).not.toThrow();
    });

    it('valide un insight minimal', () => {
      const insight = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        insight_type: 'trend',
        title: 'Votre humeur s\'améliore',
        description: 'Tendance positive sur 7 jours',
        priority: 'low',
        created_at: '2025-01-15T10:00:00Z',
      };
      const parsed = Insight.parse(insight);
      expect(parsed.is_read).toBe(false);
      expect(parsed.status).toBe('new');
    });

    it('valide un insight avec feedback', () => {
      const insight = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        insight_type: 'warning',
        title: 'Attention au stress',
        description: 'Niveaux de stress élevés détectés',
        priority: 'high',
        is_read: true,
        status: 'applied',
        applied_at: '2025-01-15T12:00:00Z',
        feedback_rating: 4,
        feedback_text: 'Conseil utile',
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => Insight.parse(insight)).not.toThrow();
    });

    it('rejette un impact_score hors limites', () => {
      const insight = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        insight_type: 'trend',
        title: 'Test',
        description: 'Test',
        priority: 'low',
        impact_score: 150,
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => Insight.parse(insight)).toThrow();
    });

    it('rejette une confidence hors limites', () => {
      const insight = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        insight_type: 'pattern',
        title: 'Test',
        description: 'Test',
        priority: 'medium',
        confidence: 1.5,
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => Insight.parse(insight)).toThrow();
    });

    it('rejette un feedback_rating invalide', () => {
      const insight = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        insight_type: 'goal',
        title: 'Test',
        description: 'Test',
        priority: 'high',
        feedback_rating: 6,
        created_at: '2025-01-15T10:00:00Z',
      };
      expect(() => Insight.parse(insight)).toThrow();
    });
  });
});

describe('Insights Module - TypeScript Types', () => {
  describe('CreateInsight interface', () => {
    it('accepte un payload de création valide', () => {
      const payload: CreateInsight = {
        user_id: 'user123',
        insight_type: 'suggestion',
        title: 'Nouvelle suggestion',
        description: 'Description de la suggestion',
        priority: 'medium',
        category: 'therapeutic',
        action_items: [
          {
            id: 'a1',
            label: 'Action',
            type: 'navigate',
            completed: false,
          },
        ],
        impact_score: 70,
        confidence: 0.8,
      };
      expect(payload.insight_type).toBe('suggestion');
    });
  });

  describe('InsightStats interface', () => {
    it('accepte des statistiques valides', () => {
      const stats: InsightStats = {
        total: 100,
        new: 15,
        applied: 50,
        dismissed: 20,
        applicationRate: 0.5,
        averageImpact: 65,
        averageFeedback: 4.2,
        byType: {
          trend: 20,
          suggestion: 40,
          pattern: 15,
          goal: 10,
          warning: 10,
          achievement: 3,
          reminder: 2,
        },
        byPriority: {
          high: 25,
          medium: 50,
          low: 25,
        },
        byCategory: {
          emotional: 30,
          behavioral: 25,
          therapeutic: 20,
          social: 10,
          progress: 10,
          health: 5,
        },
      };
      expect(stats.applicationRate).toBe(0.5);
      expect(stats.byType.suggestion).toBe(40);
    });
  });

  describe('InsightFilters interface', () => {
    it('accepte des filtres valides', () => {
      const filters: InsightFilters = {
        status: ['new', 'read'],
        type: ['suggestion', 'warning'],
        priority: ['high', 'medium'],
        category: ['emotional', 'therapeutic'],
        dateFrom: '2025-01-01',
        dateTo: '2025-01-31',
      };
      expect(filters.status?.length).toBe(2);
    });

    it('accepte des filtres partiels', () => {
      const filters: InsightFilters = {
        priority: ['high'],
      };
      expect(filters.status).toBeUndefined();
    });
  });

  describe('InsightPaginationOptions interface', () => {
    it('accepte des options de pagination valides', () => {
      const options: InsightPaginationOptions = {
        page: 1,
        limit: 20,
        sortBy: 'created_at',
        sortOrder: 'desc',
      };
      expect(options.sortBy).toBe('created_at');
    });
  });

  describe('InsightGenerationContext interface', () => {
    it('accepte un contexte de génération complet', () => {
      const context: InsightGenerationContext = {
        userId: 'user123',
        recentEmotions: [
          { emotion: 'joy', score: 80, date: '2025-01-15' },
          { emotion: 'calm', score: 70, date: '2025-01-14' },
        ],
        journalSummary: {
          count: 15,
          avgMood: 7.5,
          themes: ['gratitude', 'growth'],
        },
        sessionData: {
          breathingMinutes: 60,
          meditationMinutes: 120,
          musicSessions: 5,
        },
        streakDays: 14,
        goals: [
          { id: 'g1', title: 'Méditer quotidiennement', progress: 0.8 },
        ],
      };
      expect(context.streakDays).toBe(14);
    });
  });

  describe('InsightFeedback interface', () => {
    it('accepte un feedback valide', () => {
      const feedback: InsightFeedback = {
        user_id: 'user123',
        insight_id: 'insight456',
        rating: 4,
        feedback_text: 'Très utile',
        was_helpful: true,
        action_taken: 'started_meditation',
      };
      expect(feedback.rating).toBe(4);
      expect(feedback.was_helpful).toBe(true);
    });
  });

  describe('InsightExportOptions interface', () => {
    it('accepte des options d\'export valides', () => {
      const options: InsightExportOptions = {
        format: 'json',
        filters: {
          status: ['applied'],
        },
        includeArchived: false,
      };
      expect(options.format).toBe('json');
    });

    it('accepte le format CSV', () => {
      const options: InsightExportOptions = {
        format: 'csv',
      };
      expect(options.format).toBe('csv');
    });
  });
});
