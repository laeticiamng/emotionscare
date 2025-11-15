/**
 * Module Breath Unified - Hook React
 * Hook pour utiliser le service de respiration unifié
 *
 * @module breath-unified/useBreathUnified
 */

import { useState, useCallback, useRef } from 'react';
import { breathUnifiedService } from './breathUnifiedService';
import type {
  BreathSession,
  BreathSessionType,
  ProtocolConfig,
  GameDifficulty,
  GameMood,
  GameStats,
  VisualConfig,
  ImmersiveConfig,
  BiofeedbackData,
  BreathCycle,
  SessionStatistics,
  ProtocolRecommendation,
} from './types';

interface UseBreathUnifiedReturn {
  // État
  currentSession: BreathSession | null;
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  breathCycles: BreathCycle[];
  biofeedbackData: BiofeedbackData[];

  // Session management
  createSession: (sessionType: BreathSessionType, config?: any) => Promise<BreathSession | null>;
  startSession: (sessionId: string) => Promise<void>;
  completeSession: (completion: any) => Promise<BreathSession | null>;

  // Protocol
  generateProtocol: (config: ProtocolConfig) => any[];
  getRecommendation: (
    currentStress: number,
    targetStress: number,
    context?: any
  ) => Promise<ProtocolRecommendation | null>;

  // Tracking
  recordBreath: (cycle: BreathCycle) => void;
  recordBiofeedback: (data: BiofeedbackData) => void;

  // Stats
  getStatistics: (startDate: Date, endDate: Date) => Promise<SessionStatistics | null>;
  getHistory: (limit?: number, type?: BreathSessionType) => Promise<BreathSession[]>;

  // Utilities
  clearError: () => void;
  reset: () => void;
}

export function useBreathUnified(userId: string): UseBreathUnifiedReturn {
  const [currentSession, setCurrentSession] = useState<BreathSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [breathCycles, setBreathCycles] = useState<BreathCycle[]>([]);
  const [biofeedbackData, setBiofeedbackData] = useState<BiofeedbackData[]>([]);

  const sessionStartTimeRef = useRef<number | null>(null);

  // ==========================================================================
  // SESSION MANAGEMENT
  // ==========================================================================

  const createSession = useCallback(
    async (sessionType: BreathSessionType, config?: any): Promise<BreathSession | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const session = await breathUnifiedService.createSession(userId, sessionType, config);
        setCurrentSession(session);
        setBreathCycles([]);
        setBiofeedbackData([]);
        return session;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur lors de la création de la session';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const startSession = useCallback(async (sessionId: string): Promise<void> => {
    try {
      await breathUnifiedService.startSession(sessionId);
      sessionStartTimeRef.current = Date.now();
      setIsActive(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur lors du démarrage de la session';
      setError(errorMessage);
    }
  }, []);

  const completeSession = useCallback(
    async (completion: any): Promise<BreathSession | null> => {
      if (!currentSession) {
        setError('Aucune session active');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const completedSession = await breathUnifiedService.completeSession(currentSession.id, {
          ...completion,
          biofeedbackData,
        });

        setCurrentSession(null);
        setIsActive(false);
        sessionStartTimeRef.current = null;
        return completedSession;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur lors de la complétion de la session';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [currentSession, biofeedbackData]
  );

  // ==========================================================================
  // PROTOCOL
  // ==========================================================================

  const generateProtocol = useCallback((config: ProtocolConfig) => {
    return breathUnifiedService.generateProtocol(config);
  }, []);

  const getRecommendation = useCallback(
    async (
      currentStress: number,
      targetStress: number,
      context?: any
    ): Promise<ProtocolRecommendation | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const recommendation = await breathUnifiedService.getRecommendation(
          userId,
          currentStress,
          targetStress,
          context
        );
        return recommendation;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur lors de la génération de recommandation';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // ==========================================================================
  // TRACKING
  // ==========================================================================

  const recordBreath = useCallback((cycle: BreathCycle) => {
    setBreathCycles((prev) => [...prev, cycle]);
  }, []);

  const recordBiofeedback = useCallback((data: BiofeedbackData) => {
    setBiofeedbackData((prev) => [...prev, data]);
  }, []);

  // ==========================================================================
  // STATS
  // ==========================================================================

  const getStatistics = useCallback(
    async (startDate: Date, endDate: Date): Promise<SessionStatistics | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const stats = await breathUnifiedService.getStatistics(userId, startDate, endDate);
        return stats;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur lors de la récupération des statistiques';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const getHistory = useCallback(
    async (limit = 20, type?: BreathSessionType): Promise<BreathSession[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const history = await breathUnifiedService.getSessionHistory(userId, limit, type);
        return history;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur lors de la récupération de l\'historique';
        setError(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // ==========================================================================
  // UTILITIES
  // ==========================================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setCurrentSession(null);
    setIsActive(false);
    setBreathCycles([]);
    setBiofeedbackData([]);
    setError(null);
    sessionStartTimeRef.current = null;
  }, []);

  return {
    // État
    currentSession,
    isActive,
    isLoading,
    error,
    breathCycles,
    biofeedbackData,

    // Session management
    createSession,
    startSession,
    completeSession,

    // Protocol
    generateProtocol,
    getRecommendation,

    // Tracking
    recordBreath,
    recordBiofeedback,

    // Stats
    getStatistics,
    getHistory,

    // Utilities
    clearError,
    reset,
  };
}
