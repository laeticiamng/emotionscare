/**
 * Hook useLongTermPredictions - Phase 4.2
 * Gestion des prédictions long-terme avec cache et refresh automatique
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  longTermPredictionsService,
  EmotionalForecast,
  TimeframeType,
} from '@/services/longTermPredictionsService';
import { logger } from '@/lib/logger';

export interface PredictionState {
  forecast: EmotionalForecast | null;
  loading: boolean;
  error: string | null;
  timeframe: TimeframeType;
  lastRefresh: Date | null;
}

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 heures

export function useLongTermPredictions(
  userId: string | undefined,
  initialTimeframe: TimeframeType = '6months'
) {
  const [state, setState] = useState<PredictionState>({
    forecast: null,
    loading: false,
    error: null,
    timeframe: initialTimeframe,
    lastRefresh: null,
  });

  const cacheRef = useRef<{
    forecast: EmotionalForecast | null;
    timestamp: number;
  }>({ forecast: null, timestamp: 0 });

  /**
   * Charger les prédictions
   */
  const loadPredictions = useCallback(
    async (timeframe: TimeframeType = initialTimeframe, forceRefresh = false) => {
      if (!userId) {
        setState((prev) => ({
          ...prev,
          error: 'User ID required',
        }));
        return;
      }

      // Vérifier le cache
      if (
        !forceRefresh &&
        cacheRef.current.forecast &&
        Date.now() - cacheRef.current.timestamp < CACHE_DURATION_MS
      ) {
        logger.debug('Using cached predictions', { timeframe }, 'PREDICTIONS');
        setState((prev) => ({
          ...prev,
          forecast: cacheRef.current.forecast,
          timeframe,
          loading: false,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        logger.info(`Loading ${timeframe} predictions for user ${userId}`, {}, 'PREDICTIONS');

        // Essayer de récupérer les prédictions sauvegardées
        const saved = await longTermPredictionsService.getPredictions(userId, timeframe);

        if (saved) {
          const forecast = saved.forecast_data as EmotionalForecast;
          cacheRef.current = {
            forecast,
            timestamp: Date.now(),
          };

          setState((prev) => ({
            ...prev,
            forecast,
            timeframe,
            loading: false,
            lastRefresh: new Date(saved.created_at),
            error: null,
          }));

          logger.info('Predictions loaded from database', { timeframe }, 'PREDICTIONS');
          return;
        }

        // Sinon, générer de nouvelles prédictions
        logger.info(`Generating new ${timeframe} predictions`, {}, 'PREDICTIONS');
        const forecast = await longTermPredictionsService.generateLongTermPredictions(
          userId,
          timeframe
        );

        // Sauvegarder les prédictions
        await longTermPredictionsService.savePredictions(userId, forecast);

        cacheRef.current = {
          forecast,
          timestamp: Date.now(),
        };

        setState((prev) => ({
          ...prev,
          forecast,
          timeframe,
          loading: false,
          lastRefresh: new Date(),
          error: null,
        }));

        logger.info('New predictions generated and saved', { timeframe }, 'PREDICTIONS');
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.error('Failed to load predictions', error as Error, 'PREDICTIONS');

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
      }
    },
    [userId, initialTimeframe]
  );

  /**
   * Changer le timeframe
   */
  const changeTimeframe = useCallback(
    (timeframe: TimeframeType) => {
      setState((prev) => ({
        ...prev,
        timeframe,
      }));
      loadPredictions(timeframe);
    },
    [loadPredictions]
  );

  /**
   * Forcer le refresh
   */
  const refresh = useCallback(() => {
    loadPredictions(state.timeframe, true);
  }, [loadPredictions, state.timeframe]);

  /**
   * Charger les prédictions au montage
   */
  useEffect(() => {
    loadPredictions(initialTimeframe);
  }, [userId]);

  return {
    ...state,
    loadPredictions,
    changeTimeframe,
    refresh,
  };
}

/**
 * Hook pour récupérer les risques
 */
export function usePredictionRisks(forecast: EmotionalForecast | null) {
  return {
    hasRisks: (forecast?.riskIndicators.length ?? 0) > 0,
    risks: forecast?.riskIndicators ?? [],
    criticalRisks: forecast?.riskIndicators.filter((r) => r.severity === 'critical') ?? [],
    highRisks: forecast?.riskIndicators.filter((r) => r.severity === 'high') ?? [],
  };
}

/**
 * Hook pour récupérer les opportunités
 */
export function usePredictionOpportunities(forecast: EmotionalForecast | null) {
  return {
    hasOpportunities: (forecast?.wellnessOpportunities.length ?? 0) > 0,
    opportunities: forecast?.wellnessOpportunities ?? [],
    highPriorityOpportunities:
      forecast?.wellnessOpportunities.filter((o) => o.priority === 'high') ?? [],
  };
}

/**
 * Hook pour récupérer les patterns
 */
export function usePredictionPatterns(forecast: EmotionalForecast | null) {
  return {
    hasPatterns: (forecast?.patterns.length ?? 0) > 0,
    patterns: forecast?.patterns ?? [],
    positivePatterns: forecast?.patterns.filter((p) => p.emotionImpact > 0) ?? [],
    negativePatterns: forecast?.patterns.filter((p) => p.emotionImpact < 0) ?? [],
  };
}

/**
 * Hook pour récupérer les statistiques
 */
export function usePredictionStats(forecast: EmotionalForecast | null) {
  return {
    stats: forecast?.stats,
    isStable: forecast?.stats?.volatilityIndex ?? 0 < 0.4,
    isImproving: forecast?.stats?.improvementTrend ?? 0 > 0.1,
    isDecining: forecast?.stats?.improvementTrend ?? 0 < -0.1,
    dataQuality: forecast?.confidence ?? 0,
    dataMonthsAvailable: forecast?.stats?.dataMonthsAvailable ?? 0,
  };
}
