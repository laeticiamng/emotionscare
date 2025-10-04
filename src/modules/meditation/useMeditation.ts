/**
 * useMeditation - Hook principal pour le module meditation
 */

import { useQuery } from '@tanstack/react-query';
import { meditationService } from './meditationService';
import { useMeditationMachine } from './useMeditationMachine';
import type { MeditationConfig } from './types';

export interface UseMeditationOptions {
  config?: MeditationConfig;
  autoLoadStats?: boolean;
  autoLoadRecent?: boolean;
}

export function useMeditation(options: UseMeditationOptions = {}) {
  const machine = useMeditationMachine();

  // Stats utilisateur
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['meditation', 'stats'],
    queryFn: () => meditationService.getStats(),
    enabled: options.autoLoadStats !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sessions récentes
  const {
    data: recentSessions,
    isLoading: sessionsLoading,
    refetch: refetchSessions,
  } = useQuery({
    queryKey: ['meditation', 'recent'],
    queryFn: () => meditationService.getRecentSessions(10),
    enabled: options.autoLoadRecent !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Appliquer la config initiale si fournie
  if (options.config && !machine.config) {
    machine.setConfig(options.config);
  }

  return {
    // State machine
    ...machine,
    
    // Données
    stats,
    recentSessions,
    
    // Loading states
    statsLoading,
    sessionsLoading,
    
    // Refetch
    refetchStats,
    refetchSessions,
    
    // Helper: rafraîchir toutes les données
    refresh: () => {
      refetchStats();
      refetchSessions();
    },
  };
}
