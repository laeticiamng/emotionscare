/**
 * Emotion Orchestrator Module - Types Tests
 * Tests unitaires pour les schemas Zod du module Emotion Orchestrator
 */

import { describe, it, expect } from 'vitest';
import {
  EmotionalState,
  UserContext,
  ModuleType,
  RecommendationReason,
  ModuleRecommendation,
  OrchestrationResponse,
  RecommendationFeedback,
  RecommendationStats,
} from '../types';

describe('Emotion Orchestrator Module - Zod Schemas', () => {
  describe('EmotionalState', () => {
    it('valide un état émotionnel complet', () => {
      const state = {
        dominant: {
          emotion: 'joy',
          intensity: 0.8,
          confidence: 0.95,
        },
        emotions: [
          { emotion: 'joy', probability: 0.6, intensity: 0.8 },
          { emotion: 'calm', probability: 0.3, intensity: 0.5 },
        ],
        sentiment: 'positive',
        intensityScore: 0.75,
        timestamp: '2025-01-15T10:00:00Z',
        source: 'facial',
      };
      expect(() => EmotionalState.parse(state)).not.toThrow();
    });

    it('valide un état minimal', () => {
      const state = {
        dominant: {
          emotion: 'neutral',
          intensity: 0.5,
          confidence: 0.7,
        },
        emotions: [],
        sentiment: 'neutral',
        intensityScore: 0.5,
        timestamp: '2025-01-15T10:00:00Z',
      };
      expect(() => EmotionalState.parse(state)).not.toThrow();
    });

    it('rejette une intensité hors limites', () => {
      const state = {
        dominant: {
          emotion: 'anger',
          intensity: 1.5,
          confidence: 0.9,
        },
        emotions: [],
        sentiment: 'negative',
        intensityScore: 0.9,
        timestamp: '2025-01-15T10:00:00Z',
      };
      expect(() => EmotionalState.parse(state)).toThrow();
    });

    it('rejette un sentiment invalide', () => {
      const state = {
        dominant: {
          emotion: 'joy',
          intensity: 0.8,
          confidence: 0.9,
        },
        emotions: [],
        sentiment: 'happy',
        intensityScore: 0.8,
        timestamp: '2025-01-15T10:00:00Z',
      };
      expect(() => EmotionalState.parse(state)).toThrow();
    });

    it('valide toutes les sources', () => {
      const sources = ['text', 'voice', 'facial', 'combined'] as const;
      sources.forEach((source) => {
        const state = {
          dominant: { emotion: 'joy', intensity: 0.8, confidence: 0.9 },
          emotions: [],
          sentiment: 'positive',
          intensityScore: 0.8,
          timestamp: '2025-01-15T10:00:00Z',
          source,
        };
        expect(() => EmotionalState.parse(state)).not.toThrow();
      });
    });
  });

  describe('UserContext', () => {
    it('valide un contexte complet', () => {
      const context = {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        time_of_day: 'morning',
        day_of_week: 'monday',
        recent_activities: ['meditation', 'breathing'],
        recent_modules_used: ['breath', 'mood-mixer'],
        preferences: {
          preferred_modules: ['breath', 'meditation'],
          avoided_modules: ['community'],
          difficulty_level: 'intermediate',
          session_duration_preference: 'medium',
        },
        current_goals: ['reduce_anxiety', 'improve_sleep'],
      };
      expect(() => UserContext.parse(context)).not.toThrow();
    });

    it('valide un contexte minimal', () => {
      const context = {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
      };
      expect(() => UserContext.parse(context)).not.toThrow();
    });

    it('rejette un UUID invalide', () => {
      const context = {
        user_id: 'invalid-uuid',
      };
      expect(() => UserContext.parse(context)).toThrow();
    });
  });

  describe('ModuleType', () => {
    it('valide tous les types de modules', () => {
      const modules = [
        'breath',
        'breath-constellation',
        'breathing-vr',
        'bubble-beat',
        'adaptive-music',
        'music-therapy',
        'mood-mixer',
        'audio-studio',
        'ai-coach',
        'coach',
        'screen-silk',
        'flash-glow',
        'ar-filters',
        'ambition',
        'ambition-arcade',
        'boss-grit',
        'bounce-back',
        'community',
        'journal',
        'dashboard',
        'activities',
        'achievements',
      ];
      modules.forEach((module) => {
        expect(() => ModuleType.parse(module)).not.toThrow();
      });
    });

    it('rejette un module invalide', () => {
      expect(() => ModuleType.parse('unknown-module')).toThrow();
    });
  });

  describe('RecommendationReason', () => {
    it('valide une raison complète', () => {
      const reason = {
        type: 'emotional_match',
        explanation: 'Ce module correspond à votre état émotionnel actuel',
        confidence: 0.85,
      };
      expect(() => RecommendationReason.parse(reason)).not.toThrow();
    });

    it('valide tous les types de raisons', () => {
      const types = [
        'emotional_match',
        'therapeutic_benefit',
        'user_preference',
        'contextual_fit',
        'goal_alignment',
        'pattern_based',
        'diversity',
      ];
      types.forEach((type) => {
        const reason = {
          type,
          explanation: 'Test explanation',
          confidence: 0.7,
        };
        expect(() => RecommendationReason.parse(reason)).not.toThrow();
      });
    });

    it('rejette une confiance hors limites', () => {
      const reason = {
        type: 'emotional_match',
        explanation: 'Test',
        confidence: 1.5,
      };
      expect(() => RecommendationReason.parse(reason)).toThrow();
    });
  });

  describe('ModuleRecommendation', () => {
    it('valide une recommandation complète', () => {
      const recommendation = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        module: 'breath',
        priority: 0,
        relevance_score: 0.95,
        reasons: [
          {
            type: 'emotional_match',
            explanation: 'Respiration calme l\'anxiété',
            confidence: 0.9,
          },
        ],
        suggested_duration: 10,
        suggested_config: { pattern: '4-7-8' },
        expected_benefits: ['Réduction du stress', 'Calme mental'],
        timestamp: '2025-01-15T10:00:00Z',
      };
      expect(() => ModuleRecommendation.parse(recommendation)).not.toThrow();
    });

    it('valide une recommandation minimale', () => {
      const recommendation = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        module: 'mood-mixer',
        priority: 1,
        relevance_score: 0.7,
        reasons: [],
        timestamp: '2025-01-15T10:00:00Z',
      };
      expect(() => ModuleRecommendation.parse(recommendation)).not.toThrow();
    });

    it('rejette une priorité négative', () => {
      const recommendation = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        module: 'breath',
        priority: -1,
        relevance_score: 0.8,
        reasons: [],
        timestamp: '2025-01-15T10:00:00Z',
      };
      expect(() => ModuleRecommendation.parse(recommendation)).toThrow();
    });
  });

  describe('OrchestrationResponse', () => {
    it('valide une réponse complète', () => {
      const response = {
        emotional_state: {
          dominant: { emotion: 'anxiety', intensity: 0.7, confidence: 0.9 },
          emotions: [{ emotion: 'anxiety', probability: 0.7, intensity: 0.7 }],
          sentiment: 'negative',
          intensityScore: 0.7,
          timestamp: '2025-01-15T10:00:00Z',
        },
        user_context: {
          user_id: '550e8400-e29b-41d4-a716-446655440000',
        },
        recommendations: [
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            module: 'breath',
            priority: 0,
            relevance_score: 0.95,
            reasons: [],
            timestamp: '2025-01-15T10:00:00Z',
          },
        ],
        immediate_actions: ['Prendre 3 respirations profondes'],
        long_term_strategies: ['Pratiquer la méditation quotidienne'],
        insights: {
          emotional_pattern: 'Anxiété matinale',
          trend: 'stable',
          risk_level: 'medium',
          notes: ['Observer patterns de sommeil'],
        },
        timestamp: '2025-01-15T10:00:00Z',
      };
      expect(() => OrchestrationResponse.parse(response)).not.toThrow();
    });

    it('valide les différents trends', () => {
      const trends = ['improving', 'stable', 'declining'] as const;
      trends.forEach((trend) => {
        const response = {
          emotional_state: {
            dominant: { emotion: 'joy', intensity: 0.8, confidence: 0.9 },
            emotions: [],
            sentiment: 'positive',
            intensityScore: 0.8,
            timestamp: '2025-01-15T10:00:00Z',
          },
          user_context: {
            user_id: '550e8400-e29b-41d4-a716-446655440000',
          },
          recommendations: [],
          insights: { trend },
          timestamp: '2025-01-15T10:00:00Z',
        };
        expect(() => OrchestrationResponse.parse(response)).not.toThrow();
      });
    });
  });

  describe('RecommendationFeedback', () => {
    it('valide un feedback complet', () => {
      const feedback = {
        recommendation_id: '550e8400-e29b-41d4-a716-446655440001',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        was_followed: true,
        satisfaction_rating: 4,
        perceived_benefit: 'moderate',
        actual_duration: 12,
        comments: 'Très relaxant',
        timestamp: '2025-01-15T10:30:00Z',
      };
      expect(() => RecommendationFeedback.parse(feedback)).not.toThrow();
    });

    it('valide un feedback minimal', () => {
      const feedback = {
        recommendation_id: '550e8400-e29b-41d4-a716-446655440001',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        was_followed: false,
        timestamp: '2025-01-15T10:30:00Z',
      };
      expect(() => RecommendationFeedback.parse(feedback)).not.toThrow();
    });

    it('rejette une note de satisfaction invalide', () => {
      const feedback = {
        recommendation_id: '550e8400-e29b-41d4-a716-446655440001',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        was_followed: true,
        satisfaction_rating: 6,
        timestamp: '2025-01-15T10:30:00Z',
      };
      expect(() => RecommendationFeedback.parse(feedback)).toThrow();
    });

    it('valide tous les niveaux de bénéfice', () => {
      const levels = ['none', 'slight', 'moderate', 'significant', 'excellent'] as const;
      levels.forEach((level) => {
        const feedback = {
          recommendation_id: '550e8400-e29b-41d4-a716-446655440001',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          was_followed: true,
          perceived_benefit: level,
          timestamp: '2025-01-15T10:30:00Z',
        };
        expect(() => RecommendationFeedback.parse(feedback)).not.toThrow();
      });
    });
  });

  describe('RecommendationStats', () => {
    it('valide des statistiques complètes', () => {
      const stats = {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        module: 'breath',
        total_recommendations: 50,
        follow_through_rate: 0.75,
        average_satisfaction: 4.2,
        average_benefit: 0.65,
        effectiveness_by_emotion: {
          anxiety: 0.85,
          stress: 0.8,
          anger: 0.6,
        },
        effectiveness_by_time: {
          morning: 0.9,
          evening: 0.7,
        },
        period_start: '2025-01-01T00:00:00Z',
        period_end: '2025-01-15T23:59:59Z',
      };
      expect(() => RecommendationStats.parse(stats)).not.toThrow();
    });

    it('rejette un follow_through_rate hors limites', () => {
      const stats = {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        module: 'breath',
        total_recommendations: 10,
        follow_through_rate: 1.5,
        period_start: '2025-01-01T00:00:00Z',
        period_end: '2025-01-15T23:59:59Z',
      };
      expect(() => RecommendationStats.parse(stats)).toThrow();
    });
  });
});
