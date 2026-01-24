/**
 * Tests complets pour useEmotionOrchestrator hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEmotionOrchestrator } from '../useEmotionOrchestrator';
import type {
  EmotionalState,
  UserContext,
  OrchestrationResponse,
  RecommendationFeedback,
} from '../types';

// Mock emotionOrchestrator service
const mockGenerateRecommendations = vi.fn();
const mockSubmitFeedback = vi.fn();

vi.mock('../emotionOrchestrator', () => ({
  emotionOrchestrator: {
    generateRecommendations: (...args: any[]) => mockGenerateRecommendations(...args),
    submitFeedback: (...args: any[]) => mockSubmitFeedback(...args),
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

describe('useEmotionOrchestrator', () => {
  const mockEmotionalState: EmotionalState = {
    dominant: {
      emotion: 'anxious',
      confidence: 0.85,
    },
    secondary: [],
    sentiment: 'negative',
    intensityScore: 0.7,
    timestamp: '2024-01-15T10:00:00Z',
  };

  const mockUserContext: UserContext = {
    user_id: 'user-123',
    time_of_day: 'morning',
  };

  const mockResponse: OrchestrationResponse = {
    emotional_state: mockEmotionalState,
    user_context: mockUserContext,
    recommendations: [
      {
        id: 'rec-1',
        module: 'breath',
        priority: 0,
        relevance_score: 0.9,
        reasons: [
          {
            type: 'emotional_match',
            explanation: 'Ce module aide à gérer l\'anxiété',
            confidence: 0.85,
          },
        ],
        suggested_duration: 10,
        suggested_config: { breathing_pattern: 'deep' },
        expected_benefits: ['Réduction du stress'],
        timestamp: '2024-01-15T10:00:00Z',
      },
    ],
    immediate_actions: ['Prendre 5 respirations profondes'],
    long_term_strategies: ['Établir une routine de respiration'],
    insights: {
      notes: ['Intensité émotionnelle élevée détectée'],
    },
    timestamp: '2024-01-15T10:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================================
  // INITIAL STATE
  // ============================================================================

  describe('initial state', () => {
    it('should return initial state correctly', () => {
      const { result } = renderHook(() => useEmotionOrchestrator());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.currentResponse).toBeNull();
    });

    it('should provide all expected functions', () => {
      const { result } = renderHook(() => useEmotionOrchestrator());

      expect(typeof result.current.getRecommendations).toBe('function');
      expect(typeof result.current.submitFeedback).toBe('function');
      expect(typeof result.current.clearError).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  // ============================================================================
  // GET RECOMMENDATIONS
  // ============================================================================

  describe('getRecommendations', () => {
    it('should fetch recommendations successfully', async () => {
      mockGenerateRecommendations.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useEmotionOrchestrator());

      let response: OrchestrationResponse | null = null;
      await act(async () => {
        response = await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      expect(response).toEqual(mockResponse);
      expect(result.current.currentResponse).toEqual(mockResponse);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set loading state during fetch', async () => {
      let resolvePromise: (value: OrchestrationResponse) => void;
      const promise = new Promise<OrchestrationResponse>((resolve) => {
        resolvePromise = resolve;
      });
      mockGenerateRecommendations.mockReturnValueOnce(promise);

      const { result } = renderHook(() => useEmotionOrchestrator());

      act(() => {
        result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      // Check loading state is true during fetch
      expect(result.current.isLoading).toBe(true);

      // Resolve the promise
      await act(async () => {
        resolvePromise!(mockResponse);
        await promise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should handle error during fetch', async () => {
      const errorMessage = 'Network error';
      mockGenerateRecommendations.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useEmotionOrchestrator());

      let response: OrchestrationResponse | null = null;
      await act(async () => {
        response = await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      expect(response).toBeNull();
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle non-Error exceptions', async () => {
      mockGenerateRecommendations.mockRejectedValueOnce('String error');

      const { result } = renderHook(() => useEmotionOrchestrator());

      await act(async () => {
        await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      expect(result.current.error).toBe('Erreur lors de la génération des recommandations');
    });

    it('should clear previous error on new fetch', async () => {
      mockGenerateRecommendations.mockRejectedValueOnce(new Error('First error'));

      const { result } = renderHook(() => useEmotionOrchestrator());

      // First call - should error
      await act(async () => {
        await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      expect(result.current.error).toBe('First error');

      // Second call - should clear error even if successful
      mockGenerateRecommendations.mockResolvedValueOnce(mockResponse);

      await act(async () => {
        await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      expect(result.current.error).toBeNull();
    });

    it('should pass correct parameters to service', async () => {
      mockGenerateRecommendations.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useEmotionOrchestrator());

      await act(async () => {
        await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      expect(mockGenerateRecommendations).toHaveBeenCalledWith(
        mockEmotionalState,
        mockUserContext
      );
    });

    it('should update currentResponse on each successful call', async () => {
      const firstResponse = { ...mockResponse, timestamp: '2024-01-15T09:00:00Z' };
      const secondResponse = { ...mockResponse, timestamp: '2024-01-15T10:00:00Z' };

      mockGenerateRecommendations.mockResolvedValueOnce(firstResponse);

      const { result } = renderHook(() => useEmotionOrchestrator());

      await act(async () => {
        await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      expect(result.current.currentResponse?.timestamp).toBe('2024-01-15T09:00:00Z');

      mockGenerateRecommendations.mockResolvedValueOnce(secondResponse);

      await act(async () => {
        await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      expect(result.current.currentResponse?.timestamp).toBe('2024-01-15T10:00:00Z');
    });
  });

  // ============================================================================
  // SUBMIT FEEDBACK
  // ============================================================================

  describe('submitFeedback', () => {
    const mockFeedback: RecommendationFeedback = {
      user_id: 'user-123',
      recommendation_id: 'rec-1',
      was_followed: true,
      satisfaction_rating: 4,
      perceived_benefit: 3,
      actual_duration: 10,
      timestamp: '2024-01-15T10:30:00Z',
    };

    it('should submit feedback successfully', async () => {
      mockSubmitFeedback.mockResolvedValueOnce(true);

      const { result } = renderHook(() => useEmotionOrchestrator());

      let success = false;
      await act(async () => {
        success = await result.current.submitFeedback(mockFeedback);
      });

      expect(success).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should return false on feedback error', async () => {
      mockSubmitFeedback.mockResolvedValueOnce(false);

      const { result } = renderHook(() => useEmotionOrchestrator());

      let success = true;
      await act(async () => {
        success = await result.current.submitFeedback(mockFeedback);
      });

      expect(success).toBe(false);
    });

    it('should handle exception during feedback submission', async () => {
      mockSubmitFeedback.mockRejectedValueOnce(new Error('Feedback failed'));

      const { result } = renderHook(() => useEmotionOrchestrator());

      let success = true;
      await act(async () => {
        success = await result.current.submitFeedback(mockFeedback);
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('Feedback failed');
    });

    it('should clear previous error before submitting', async () => {
      // First, create an error state
      mockGenerateRecommendations.mockRejectedValueOnce(new Error('Previous error'));

      const { result } = renderHook(() => useEmotionOrchestrator());

      await act(async () => {
        await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      expect(result.current.error).toBe('Previous error');

      // Now submit feedback - should clear the error
      mockSubmitFeedback.mockResolvedValueOnce(true);

      await act(async () => {
        await result.current.submitFeedback(mockFeedback);
      });

      expect(result.current.error).toBeNull();
    });

    it('should pass correct feedback to service', async () => {
      mockSubmitFeedback.mockResolvedValueOnce(true);

      const { result } = renderHook(() => useEmotionOrchestrator());

      await act(async () => {
        await result.current.submitFeedback(mockFeedback);
      });

      expect(mockSubmitFeedback).toHaveBeenCalledWith(mockFeedback);
    });
  });

  // ============================================================================
  // CLEAR ERROR
  // ============================================================================

  describe('clearError', () => {
    it('should clear error state', async () => {
      mockGenerateRecommendations.mockRejectedValueOnce(new Error('Test error'));

      const { result } = renderHook(() => useEmotionOrchestrator());

      await act(async () => {
        await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should not affect other state when clearing error', async () => {
      mockGenerateRecommendations.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useEmotionOrchestrator());

      await act(async () => {
        await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      // Manually set an error scenario after success
      mockGenerateRecommendations.mockRejectedValueOnce(new Error('Later error'));

      await act(async () => {
        await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      act(() => {
        result.current.clearError();
      });

      // Current response should still be from the first successful call
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  // ============================================================================
  // RESET
  // ============================================================================

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      mockGenerateRecommendations.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useEmotionOrchestrator());

      await act(async () => {
        await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      expect(result.current.currentResponse).not.toBeNull();

      act(() => {
        result.current.reset();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.currentResponse).toBeNull();
    });

    it('should reset error state', async () => {
      mockGenerateRecommendations.mockRejectedValueOnce(new Error('Test error'));

      const { result } = renderHook(() => useEmotionOrchestrator());

      await act(async () => {
        await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBeNull();
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('edge cases', () => {
    it('should handle multiple concurrent requests', async () => {
      let resolveFirst: (value: OrchestrationResponse) => void;
      let resolveSecond: (value: OrchestrationResponse) => void;

      const firstPromise = new Promise<OrchestrationResponse>((resolve) => {
        resolveFirst = resolve;
      });
      const secondPromise = new Promise<OrchestrationResponse>((resolve) => {
        resolveSecond = resolve;
      });

      mockGenerateRecommendations
        .mockReturnValueOnce(firstPromise)
        .mockReturnValueOnce(secondPromise);

      const { result } = renderHook(() => useEmotionOrchestrator());

      const firstResponse = { ...mockResponse, timestamp: 'first' };
      const secondResponse = { ...mockResponse, timestamp: 'second' };

      // Start both requests
      act(() => {
        result.current.getRecommendations(mockEmotionalState, mockUserContext);
        result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      // Resolve second first
      await act(async () => {
        resolveSecond!(secondResponse);
        await secondPromise;
      });

      // Resolve first after
      await act(async () => {
        resolveFirst!(firstResponse);
        await firstPromise;
      });

      // The last to complete should be in currentResponse
      expect(result.current.currentResponse?.timestamp).toBe('first');
    });

    it('should handle empty recommendations response', async () => {
      const emptyResponse: OrchestrationResponse = {
        ...mockResponse,
        recommendations: [],
        immediate_actions: [],
        long_term_strategies: [],
      };

      mockGenerateRecommendations.mockResolvedValueOnce(emptyResponse);

      const { result } = renderHook(() => useEmotionOrchestrator());

      await act(async () => {
        await result.current.getRecommendations(mockEmotionalState, mockUserContext);
      });

      expect(result.current.currentResponse?.recommendations).toEqual([]);
    });

    it('should handle context with all optional fields', async () => {
      const fullContext: UserContext = {
        user_id: 'user-123',
        time_of_day: 'evening',
        preferences: {
          preferred_modules: ['breath', 'journal'],
          avoided_modules: ['community'],
          difficulty_level: 'beginner',
        },
        recent_modules_used: ['music-therapy'],
        current_goals: ['Réduire le stress'],
        emotion_history: [
          { emotion: 'calm', sentiment: 'neutral', timestamp: '2024-01-15T09:00:00Z' },
        ],
      };

      mockGenerateRecommendations.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useEmotionOrchestrator());

      await act(async () => {
        await result.current.getRecommendations(mockEmotionalState, fullContext);
      });

      expect(mockGenerateRecommendations).toHaveBeenCalledWith(mockEmotionalState, fullContext);
    });

    it('should handle emotional state with secondary emotions', async () => {
      const stateWithSecondary: EmotionalState = {
        dominant: {
          emotion: 'anxious',
          confidence: 0.85,
        },
        secondary: [
          { emotion: 'stressed', confidence: 0.6 },
          { emotion: 'sad', confidence: 0.4 },
        ],
        sentiment: 'negative',
        intensityScore: 0.7,
        timestamp: '2024-01-15T10:00:00Z',
      };

      mockGenerateRecommendations.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useEmotionOrchestrator());

      await act(async () => {
        await result.current.getRecommendations(stateWithSecondary, mockUserContext);
      });

      expect(mockGenerateRecommendations).toHaveBeenCalledWith(stateWithSecondary, mockUserContext);
    });
  });

  // ============================================================================
  // STABILITY
  // ============================================================================

  describe('function stability', () => {
    it('should have stable function references', () => {
      const { result, rerender } = renderHook(() => useEmotionOrchestrator());

      const firstRender = {
        getRecommendations: result.current.getRecommendations,
        submitFeedback: result.current.submitFeedback,
        clearError: result.current.clearError,
        reset: result.current.reset,
      };

      rerender();

      expect(result.current.getRecommendations).toBe(firstRender.getRecommendations);
      expect(result.current.submitFeedback).toBe(firstRender.submitFeedback);
      expect(result.current.clearError).toBe(firstRender.clearError);
      expect(result.current.reset).toBe(firstRender.reset);
    });
  });
});
