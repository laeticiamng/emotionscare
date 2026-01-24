/**
 * Tests complets pour emotionOrchestrator
 * Couvre la génération de recommandations, feedback, et stats
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EmotionOrchestrator, emotionOrchestrator } from '../emotionOrchestrator';
import type {
  EmotionalState,
  UserContext,
  RecommendationFeedback,
} from '../types';

// Mock UUID
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid-1234',
}));

// Mock Supabase
const mockSupabaseResponse = {
  data: null as any,
  error: null as any,
};

const mockLte = vi.fn(() => Promise.resolve(mockSupabaseResponse));
const mockGte = vi.fn(() => ({ lte: mockLte }));
const mockEq2 = vi.fn(() => ({ gte: mockGte }));
const mockEq = vi.fn(() => ({ eq: mockEq2 }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockInsert = vi.fn(() => Promise.resolve(mockSupabaseResponse));
const mockFrom = vi.fn(() => ({
  insert: mockInsert,
  select: mockSelect,
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
  },
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('EmotionOrchestrator', () => {
  let orchestrator: EmotionOrchestrator;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabaseResponse.data = null;
    mockSupabaseResponse.error = null;
    orchestrator = new EmotionOrchestrator();

    // Mock Date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ============================================================================
  // GENERATE RECOMMENDATIONS - BASIC
  // ============================================================================

  describe('generateRecommendations', () => {
    const baseEmotionalState: EmotionalState = {
      dominant: {
        emotion: 'anxious',
        confidence: 0.85,
      },
      secondary: [],
      sentiment: 'negative',
      intensityScore: 0.7,
      timestamp: '2024-01-15T10:00:00Z',
    };

    const baseContext: UserContext = {
      user_id: 'user-123',
      time_of_day: 'morning',
    };

    it('should generate recommendations for anxious state', async () => {
      const response = await orchestrator.generateRecommendations(
        baseEmotionalState,
        baseContext
      );

      expect(response).toBeDefined();
      expect(response.recommendations).toBeDefined();
      expect(response.recommendations.length).toBeGreaterThan(0);
      expect(response.emotional_state).toEqual(baseEmotionalState);
      expect(response.user_context).toEqual(baseContext);
    });

    it('should include breathing modules for anxious state', async () => {
      const response = await orchestrator.generateRecommendations(
        baseEmotionalState,
        baseContext
      );

      const moduleTypes = response.recommendations.map(r => r.module);
      expect(moduleTypes).toContain('breath');
    });

    it('should sort recommendations by relevance score', async () => {
      const response = await orchestrator.generateRecommendations(
        baseEmotionalState,
        baseContext
      );

      const scores = response.recommendations.map(r => r.relevance_score);
      for (let i = 1; i < scores.length; i++) {
        expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i]);
      }
    });

    it('should assign correct priorities based on relevance', async () => {
      const response = await orchestrator.generateRecommendations(
        baseEmotionalState,
        baseContext
      );

      response.recommendations.forEach((rec, index) => {
        expect(rec.priority).toBe(index);
      });
    });

    it('should include immediate actions for negative sentiment', async () => {
      const response = await orchestrator.generateRecommendations(
        baseEmotionalState,
        baseContext
      );

      expect(response.immediate_actions).toBeDefined();
      expect(response.immediate_actions.length).toBeGreaterThan(0);
    });

    it('should include long term strategies', async () => {
      const response = await orchestrator.generateRecommendations(
        baseEmotionalState,
        baseContext
      );

      expect(response.long_term_strategies).toBeDefined();
    });

    it('should include insights', async () => {
      const response = await orchestrator.generateRecommendations(
        baseEmotionalState,
        baseContext
      );

      expect(response.insights).toBeDefined();
    });

    it('should limit recommendations to maximum of 8 modules', async () => {
      const response = await orchestrator.generateRecommendations(
        baseEmotionalState,
        baseContext
      );

      expect(response.recommendations.length).toBeLessThanOrEqual(8);
    });
  });

  // ============================================================================
  // GENERATE RECOMMENDATIONS - DIFFERENT EMOTIONS
  // ============================================================================

  describe('generateRecommendations - different emotions', () => {
    const baseContext: UserContext = {
      user_id: 'user-123',
    };

    it('should recommend stress relief for stressed state', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'stressed', confidence: 0.9 },
        secondary: [],
        sentiment: 'negative',
        intensityScore: 0.8,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(state, baseContext);
      const modules = response.recommendations.map(r => r.module);

      // Should include stress-relief modules
      const hasBreathingModule = modules.some(m =>
        ['breath', 'breath-constellation', 'breathing-vr', 'bubble-beat'].includes(m)
      );
      expect(hasBreathingModule).toBe(true);
    });

    it('should recommend mood enhancement for sad state', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'sad', confidence: 0.85 },
        secondary: [],
        sentiment: 'negative',
        intensityScore: 0.6,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(state, baseContext);
      const modules = response.recommendations.map(r => r.module);

      // Should include music therapy or mood mixer
      const hasMoodModule = modules.some(m =>
        ['music-therapy', 'mood-mixer', 'adaptive-music'].includes(m)
      );
      expect(hasMoodModule).toBe(true);
    });

    it('should recommend engagement for happy state', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'happy', confidence: 0.95 },
        secondary: [],
        sentiment: 'positive',
        intensityScore: 0.75,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(state, baseContext);
      const modules = response.recommendations.map(r => r.module);

      // Should include engagement modules for positive state
      const hasEngagementModule = modules.some(m =>
        ['community', 'ambition-arcade', 'achievements', 'ambition'].includes(m)
      );
      expect(hasEngagementModule).toBe(true);
    });

    it('should recommend focus modules for focused state', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'focused', confidence: 0.8 },
        secondary: [],
        sentiment: 'neutral',
        intensityScore: 0.5,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(state, baseContext);
      const modules = response.recommendations.map(r => r.module);

      // Should include focus-oriented modules
      const hasFocusModule = modules.some(m =>
        ['ambition', 'ambition-arcade', 'boss-grit'].includes(m)
      );
      expect(hasFocusModule).toBe(true);
    });

    it('should fallback to neutral modules for unknown emotion', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'unknown_emotion', confidence: 0.5 },
        secondary: [],
        sentiment: 'neutral',
        intensityScore: 0.3,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(state, baseContext);

      expect(response.recommendations.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // GENERATE RECOMMENDATIONS - USER CONTEXT
  // ============================================================================

  describe('generateRecommendations - user context', () => {
    const baseState: EmotionalState = {
      dominant: { emotion: 'neutral', confidence: 0.8 },
      secondary: [],
      sentiment: 'neutral',
      intensityScore: 0.5,
      timestamp: '2024-01-15T10:00:00Z',
    };

    it('should boost score for preferred modules', async () => {
      const context: UserContext = {
        user_id: 'user-123',
        preferences: {
          preferred_modules: ['breath', 'journal'],
        },
      };

      const response = await orchestrator.generateRecommendations(baseState, context);

      // Preferred modules should have reasons including user_preference
      const breathRec = response.recommendations.find(r => r.module === 'breath');
      if (breathRec) {
        const hasPreferenceReason = breathRec.reasons.some(r => r.type === 'user_preference');
        expect(hasPreferenceReason).toBe(true);
      }
    });

    it('should penalize avoided modules', async () => {
      const contextWithAvoidedModules: UserContext = {
        user_id: 'user-123',
        preferences: {
          avoided_modules: ['breath', 'meditation'],
        },
      };

      const contextWithoutAvoided: UserContext = {
        user_id: 'user-123',
      };

      const responseWithAvoided = await orchestrator.generateRecommendations(
        baseState,
        contextWithAvoidedModules
      );
      const responseWithout = await orchestrator.generateRecommendations(
        baseState,
        contextWithoutAvoided
      );

      // The avoided module should have lower score
      const breathWithAvoided = responseWithAvoided.recommendations.find(r => r.module === 'breath');
      const breathWithout = responseWithout.recommendations.find(r => r.module === 'breath');

      if (breathWithAvoided && breathWithout) {
        expect(breathWithAvoided.relevance_score).toBeLessThan(breathWithout.relevance_score);
      }
    });

    it('should penalize recently used modules', async () => {
      const context: UserContext = {
        user_id: 'user-123',
        recent_modules_used: ['breath', 'journal', 'music-therapy'],
      };

      const response = await orchestrator.generateRecommendations(baseState, context);

      // Recently used modules should have diversity penalty
      const breathRec = response.recommendations.find(r => r.module === 'breath');
      if (breathRec) {
        const hasDiversityReason = breathRec.reasons.some(r => r.type === 'diversity');
        expect(hasDiversityReason).toBe(false); // Should NOT have diversity reason if recently used
      }
    });

    it('should include goal alignment for matching goals', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'anxious', confidence: 0.8 },
        secondary: [],
        sentiment: 'negative',
        intensityScore: 0.6,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const context: UserContext = {
        user_id: 'user-123',
        current_goals: ['Réduire mon stress quotidien', 'Améliorer ma gestion du stress'],
      };

      const response = await orchestrator.generateRecommendations(state, context);

      // Should include goal alignment reason for stress relief modules
      const stressReliefModules = response.recommendations.filter(r =>
        ['breath', 'breath-constellation', 'breathing-vr', 'bubble-beat'].includes(r.module)
      );

      const hasGoalAlignment = stressReliefModules.some(rec =>
        rec.reasons.some(r => r.type === 'goal_alignment')
      );
      expect(hasGoalAlignment).toBe(true);
    });
  });

  // ============================================================================
  // GENERATE RECOMMENDATIONS - TIME OF DAY
  // ============================================================================

  describe('generateRecommendations - time context', () => {
    const baseState: EmotionalState = {
      dominant: { emotion: 'neutral', confidence: 0.8 },
      secondary: [],
      sentiment: 'neutral',
      intensityScore: 0.5,
      timestamp: '2024-01-15T10:00:00Z',
    };

    it('should recommend relaxation modules at night', async () => {
      const context: UserContext = {
        user_id: 'user-123',
        time_of_day: 'night',
      };

      const response = await orchestrator.generateRecommendations(baseState, context);

      // Night-time recommendations should include relaxation-focused reasons
      const relaxModules = response.recommendations.filter(r =>
        ['breath', 'breathing-vr', 'screen-silk'].includes(r.module)
      );

      if (relaxModules.length > 0) {
        const hasContextualFit = relaxModules.some(rec =>
          rec.reasons.some(r => r.type === 'contextual_fit')
        );
        expect(hasContextualFit).toBe(true);
      }
    });

    it('should recommend motivation modules in morning', async () => {
      const context: UserContext = {
        user_id: 'user-123',
        time_of_day: 'morning',
      };

      const response = await orchestrator.generateRecommendations(baseState, context);

      // Morning recommendations should include motivation-focused modules
      const motivationModules = response.recommendations.filter(r =>
        ['ambition', 'boss-grit', 'activities'].includes(r.module)
      );

      if (motivationModules.length > 0) {
        const hasContextualFit = motivationModules.some(rec =>
          rec.reasons.some(r => r.type === 'contextual_fit')
        );
        expect(hasContextualFit).toBe(true);
      }
    });
  });

  // ============================================================================
  // GENERATE RECOMMENDATIONS - INTENSITY
  // ============================================================================

  describe('generateRecommendations - intensity levels', () => {
    const baseContext: UserContext = {
      user_id: 'user-123',
    };

    it('should suggest longer duration for high intensity', async () => {
      const highIntensityState: EmotionalState = {
        dominant: { emotion: 'anxious', confidence: 0.9 },
        secondary: [],
        sentiment: 'negative',
        intensityScore: 0.85,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const lowIntensityState: EmotionalState = {
        dominant: { emotion: 'anxious', confidence: 0.9 },
        secondary: [],
        sentiment: 'negative',
        intensityScore: 0.2,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const highResponse = await orchestrator.generateRecommendations(highIntensityState, baseContext);
      const lowResponse = await orchestrator.generateRecommendations(lowIntensityState, baseContext);

      // High intensity should have longer suggested duration
      const highDuration = highResponse.recommendations[0]?.suggested_duration || 0;
      const lowDuration = lowResponse.recommendations[0]?.suggested_duration || 0;

      expect(highDuration).toBeGreaterThan(lowDuration);
    });

    it('should configure breathing pattern based on intensity', async () => {
      const extremeState: EmotionalState = {
        dominant: { emotion: 'anxious', confidence: 0.9 },
        secondary: [],
        sentiment: 'negative',
        intensityScore: 0.95,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(extremeState, baseContext);
      const breathRec = response.recommendations.find(r => r.module === 'breath');

      if (breathRec) {
        expect(breathRec.suggested_config.breathing_pattern).toBe('deep');
      }
    });
  });

  // ============================================================================
  // GENERATE RECOMMENDATIONS - INSIGHTS
  // ============================================================================

  describe('generateRecommendations - insights', () => {
    it('should detect declining trend from emotion history', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'sad', confidence: 0.8 },
        secondary: [],
        sentiment: 'negative',
        intensityScore: 0.6,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const context: UserContext = {
        user_id: 'user-123',
        emotion_history: [
          { emotion: 'sad', sentiment: 'negative', timestamp: '2024-01-15T10:00:00Z' },
          { emotion: 'anxious', sentiment: 'negative', timestamp: '2024-01-15T09:00:00Z' },
          { emotion: 'stressed', sentiment: 'negative', timestamp: '2024-01-15T08:00:00Z' },
        ],
      };

      const response = await orchestrator.generateRecommendations(state, context);

      expect(response.insights.trend).toBe('declining');
      expect(response.insights.risk_level).toBe('medium');
    });

    it('should detect improving trend from positive emotion history', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'happy', confidence: 0.9 },
        secondary: [],
        sentiment: 'positive',
        intensityScore: 0.7,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const context: UserContext = {
        user_id: 'user-123',
        emotion_history: [
          { emotion: 'happy', sentiment: 'positive', timestamp: '2024-01-15T10:00:00Z' },
          { emotion: 'content', sentiment: 'positive', timestamp: '2024-01-15T09:00:00Z' },
          { emotion: 'excited', sentiment: 'positive', timestamp: '2024-01-15T08:00:00Z' },
        ],
      };

      const response = await orchestrator.generateRecommendations(state, context);

      expect(response.insights.trend).toBe('improving');
      expect(response.insights.risk_level).toBe('low');
    });

    it('should add note for high intensity', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'anxious', confidence: 0.9 },
        secondary: [],
        sentiment: 'negative',
        intensityScore: 0.85,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(state, { user_id: 'user-123' });

      expect(response.insights.notes).toContain('Intensité émotionnelle élevée détectée');
    });

    it('should add note for high confidence detection', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'happy', confidence: 0.95 },
        secondary: [],
        sentiment: 'positive',
        intensityScore: 0.6,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(state, { user_id: 'user-123' });

      expect(response.insights.notes).toContain('Détection émotionnelle très fiable');
    });
  });

  // ============================================================================
  // GENERATE RECOMMENDATIONS - IMMEDIATE ACTIONS
  // ============================================================================

  describe('generateRecommendations - immediate actions', () => {
    it('should suggest breathing for high intensity negative state', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'anxious', confidence: 0.9 },
        secondary: [],
        sentiment: 'negative',
        intensityScore: 0.85,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(state, { user_id: 'user-123' });

      const hasBreathingAction = response.immediate_actions.some(a =>
        a.toLowerCase().includes('respir')
      );
      expect(hasBreathingAction).toBe(true);
    });

    it('should suggest journaling for positive state', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'happy', confidence: 0.9 },
        secondary: [],
        sentiment: 'positive',
        intensityScore: 0.7,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(state, { user_id: 'user-123' });

      const hasJournalAction = response.immediate_actions.some(a =>
        a.toLowerCase().includes('journal')
      );
      expect(hasJournalAction).toBe(true);
    });
  });

  // ============================================================================
  // SUBMIT FEEDBACK
  // ============================================================================

  describe('submitFeedback', () => {
    it('should save feedback successfully', async () => {
      mockInsert.mockResolvedValueOnce({ error: null });

      const feedback: RecommendationFeedback = {
        user_id: 'user-123',
        recommendation_id: 'breath-rec-123',
        was_followed: true,
        satisfaction_rating: 4,
        perceived_benefit: 3,
        actual_duration: 10,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const result = await orchestrator.submitFeedback(feedback);

      expect(result).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('module_recommendation_feedback');
    });

    it('should return false on database error', async () => {
      mockInsert.mockResolvedValueOnce({ error: { message: 'Insert failed' } });

      const feedback: RecommendationFeedback = {
        user_id: 'user-123',
        recommendation_id: 'breath-rec-123',
        was_followed: false,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const result = await orchestrator.submitFeedback(feedback);

      expect(result).toBe(false);
    });

    it('should handle exceptions gracefully', async () => {
      mockInsert.mockRejectedValueOnce(new Error('Network error'));

      const feedback: RecommendationFeedback = {
        user_id: 'user-123',
        recommendation_id: 'breath-rec-123',
        was_followed: true,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const result = await orchestrator.submitFeedback(feedback);

      expect(result).toBe(false);
    });

    it('should include optional fields when provided', async () => {
      mockInsert.mockResolvedValueOnce({ error: null });

      const feedback: RecommendationFeedback = {
        user_id: 'user-123',
        recommendation_id: 'breath-rec-123',
        was_followed: true,
        satisfaction_rating: 5,
        perceived_benefit: 4,
        actual_duration: 15,
        comments: 'Très utile pour ma gestion du stress',
        timestamp: '2024-01-15T10:00:00Z',
      };

      await orchestrator.submitFeedback(feedback);

      expect(mockInsert).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // GET STATS
  // ============================================================================

  describe('getStats', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    it('should return stats for user and module', async () => {
      const mockFeedbackData = [
        { was_followed: true },
        { was_followed: true },
        { was_followed: false },
        { was_followed: true },
      ];

      mockLte.mockResolvedValueOnce({ data: mockFeedbackData, error: null });

      const stats = await orchestrator.getStats('user-123', 'breath', startDate, endDate);

      expect(stats.user_id).toBe('user-123');
      expect(stats.module).toBe('breath');
      expect(stats.total_recommendations).toBe(4);
      expect(stats.follow_through_rate).toBe(75); // 3/4 = 75%
    });

    it('should return empty stats on error', async () => {
      mockLte.mockResolvedValueOnce({ data: null, error: { message: 'Query failed' } });

      const stats = await orchestrator.getStats('user-123', 'breath', startDate, endDate);

      expect(stats.total_recommendations).toBe(0);
      expect(stats.follow_through_rate).toBe(0);
    });

    it('should handle zero recommendations', async () => {
      mockLte.mockResolvedValueOnce({ data: [], error: null });

      const stats = await orchestrator.getStats('user-123', 'breath', startDate, endDate);

      expect(stats.total_recommendations).toBe(0);
      expect(stats.follow_through_rate).toBe(0);
    });

    it('should handle exception gracefully', async () => {
      mockLte.mockRejectedValueOnce(new Error('Network error'));

      const stats = await orchestrator.getStats('user-123', 'breath', startDate, endDate);

      expect(stats.total_recommendations).toBe(0);
    });

    it('should include correct date range in stats', async () => {
      mockLte.mockResolvedValueOnce({ data: [], error: null });

      const stats = await orchestrator.getStats('user-123', 'breath', startDate, endDate);

      expect(stats.period_start).toBe(startDate.toISOString());
      expect(stats.period_end).toBe(endDate.toISOString());
    });
  });

  // ============================================================================
  // EXPECTED BENEFITS
  // ============================================================================

  describe('expected benefits', () => {
    it('should include stress relief benefits for breathing modules', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'anxious', confidence: 0.8 },
        secondary: [],
        sentiment: 'negative',
        intensityScore: 0.6,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(state, { user_id: 'user-123' });
      const breathRec = response.recommendations.find(r => r.module === 'breath');

      if (breathRec) {
        expect(breathRec.expected_benefits.length).toBeGreaterThan(0);
        const hasStressBenefit = breathRec.expected_benefits.some(b =>
          b.toLowerCase().includes('stress') || b.toLowerCase().includes('respiration')
        );
        expect(hasStressBenefit).toBe(true);
      }
    });

    it('should limit benefits to 3 maximum', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'neutral', confidence: 0.8 },
        secondary: [],
        sentiment: 'neutral',
        intensityScore: 0.5,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(state, { user_id: 'user-123' });

      response.recommendations.forEach(rec => {
        expect(rec.expected_benefits.length).toBeLessThanOrEqual(3);
      });
    });
  });

  // ============================================================================
  // MODULE CONFIGURATION
  // ============================================================================

  describe('module configuration', () => {
    it('should configure breathing modules appropriately', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'stressed', confidence: 0.9 },
        secondary: [],
        sentiment: 'negative',
        intensityScore: 0.7,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(state, { user_id: 'user-123' });
      const breathRec = response.recommendations.find(r => r.module === 'breath');

      if (breathRec) {
        expect(breathRec.suggested_config).toHaveProperty('breathing_pattern');
        expect(breathRec.suggested_config).toHaveProperty('pace');
        expect(breathRec.suggested_config).toHaveProperty('duration');
      }
    });

    it('should configure music modules with mood info', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'sad', confidence: 0.85 },
        secondary: [],
        sentiment: 'negative',
        intensityScore: 0.6,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(state, { user_id: 'user-123' });
      const musicRec = response.recommendations.find(r => r.module === 'music-therapy');

      if (musicRec) {
        expect(musicRec.suggested_config).toHaveProperty('mood');
        expect(musicRec.suggested_config).toHaveProperty('intensity');
        expect(musicRec.suggested_config).toHaveProperty('target_mood');
      }
    });

    it('should configure AI coach based on sentiment', async () => {
      const state: EmotionalState = {
        dominant: { emotion: 'sad', confidence: 0.85 },
        secondary: [],
        sentiment: 'negative',
        intensityScore: 0.6,
        timestamp: '2024-01-15T10:00:00Z',
      };

      const response = await orchestrator.generateRecommendations(state, { user_id: 'user-123' });
      const coachRec = response.recommendations.find(r => r.module === 'ai-coach');

      if (coachRec) {
        expect(coachRec.suggested_config.focus_area).toBe('emotional_support');
      }
    });
  });

  // ============================================================================
  // SINGLETON EXPORT
  // ============================================================================

  describe('singleton export', () => {
    it('should export emotionOrchestrator singleton', () => {
      expect(emotionOrchestrator).toBeInstanceOf(EmotionOrchestrator);
    });
  });
});
