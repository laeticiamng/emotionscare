/**
 * Module EmotionOrchestrator - Hook React
 * Hook pour utiliser l'orchestrateur d'émotions dans les composants
 *
 * @module emotion-orchestrator/useEmotionOrchestrator
 */

import { useState, useCallback } from 'react';
import { emotionOrchestrator } from './emotionOrchestrator';
import type {
  EmotionalState,
  UserContext,
  OrchestrationResponse,
  RecommendationFeedback,
} from './types';

interface UseEmotionOrchestratorReturn {
  // État
  isLoading: boolean;
  error: string | null;
  currentResponse: OrchestrationResponse | null;

  // Actions
  getRecommendations: (
    emotionalState: EmotionalState,
    context: UserContext
  ) => Promise<OrchestrationResponse | null>;
  submitFeedback: (feedback: RecommendationFeedback) => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

/**
 * Hook pour utiliser l'orchestrateur d'émotions
 *
 * @example
 * ```tsx
 * const { getRecommendations, currentResponse, isLoading } = useEmotionOrchestrator();
 *
 * const handleEmotionScan = async (emotionalState: EmotionalState) => {
 *   const response = await getRecommendations(emotionalState, {
 *     user_id: currentUser.id,
 *     time_of_day: 'morning',
 *   });
 *
 *   if (response) {
 *     logger.debug('Top recommendation:', response.recommendations[0], 'MODULE');
 *   }
 * };
 * ```
 */
export function useEmotionOrchestrator(): UseEmotionOrchestratorReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResponse, setCurrentResponse] = useState<OrchestrationResponse | null>(null);

  /**
   * Obtient les recommandations basées sur l'état émotionnel
   */
  const getRecommendations = useCallback(
    async (
      emotionalState: EmotionalState,
      context: UserContext
    ): Promise<OrchestrationResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await emotionOrchestrator.generateRecommendations(
          emotionalState,
          context
        );
        setCurrentResponse(response);
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération des recommandations';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Soumet le feedback sur une recommandation
   */
  const submitFeedback = useCallback(
    async (feedback: RecommendationFeedback): Promise<boolean> => {
      setError(null);

      try {
        const success = await emotionOrchestrator.submitFeedback(feedback);
        return success;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la soumission du feedback';
        setError(errorMessage);
        return false;
      }
    },
    []
  );

  /**
   * Efface l'erreur
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Réinitialise l'état
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setCurrentResponse(null);
  }, []);

  return {
    isLoading,
    error,
    currentResponse,
    getRecommendations,
    submitFeedback,
    clearError,
    reset,
  };
}
