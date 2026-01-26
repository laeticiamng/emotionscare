/**
 * Contexte Prédictions - Phase 4.2
 * Partage des prédictions long-terme à travers l'application
 */

import { createContext, useContext, ReactNode } from 'react';
import { useLongTermPredictions } from '@/hooks/useLongTermPredictions';
import { EmotionalForecast } from '@/services/longTermPredictionsService';

interface PredictionsContextValue extends ReturnType<typeof useLongTermPredictions> {}

const PredictionsContext = createContext<PredictionsContextValue | undefined>(undefined);

export function PredictionsProvider({
  children,
  userId,
}: {
  children: ReactNode;
  userId: string | undefined;
}) {
  const predictionsState = useLongTermPredictions(userId);

  return (
    <PredictionsContext.Provider value={predictionsState}>
      {children}
    </PredictionsContext.Provider>
  );
}

/**
 * Hook principal pour accéder aux prédictions
 */
export function usePredictions() {
  const context = useContext(PredictionsContext);
  if (!context) {
    throw new Error('usePredictions must be used within PredictionsProvider');
  }
  return context;
}

/**
 * Hook pour accéder seulement aux données (read-only)
 */
export function usePredictionsForecast(): EmotionalForecast | null {
  const context = useContext(PredictionsContext);
  if (!context) {
    throw new Error('usePredictionsForecast must be used within PredictionsProvider');
  }
  return context.forecast;
}

/**
 * Hook pour les actions
 */
export function usePredictionsActions() {
  const context = useContext(PredictionsContext);
  if (!context) {
    throw new Error('usePredictionsActions must be used within PredictionsProvider');
  }
  return {
    changeTimeframe: context.changeTimeframe,
    refresh: context.refresh,
  };
}

/**
 * Hook pour vérifier le statut de chargement
 */
export function usePredictionsLoading() {
  const context = useContext(PredictionsContext);
  if (!context) {
    throw new Error('usePredictionsLoading must be used within PredictionsProvider');
  }
  return {
    loading: context.loading,
    error: context.error,
    lastRefresh: context.lastRefresh,
  };
}
