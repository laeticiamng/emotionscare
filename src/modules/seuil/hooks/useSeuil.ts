/**
 * useSeuil - Hook principal pour le module SEUIL
 * Régulation émotionnelle proactive
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { SeuilService } from '../seuilService';
import type { SeuilSession, SeuilStats, SeuilPrediction } from '../seuilService';

export function useSeuil() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentSession, setCurrentSession] = useState<SeuilSession | null>(null);

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['seuil-stats', user?.id],
    queryFn: () => SeuilService.getStats(user!.id),
    enabled: !!user?.id,
    staleTime: 60000,
  });

  const { data: recentSessions = [], isLoading: isLoadingRecent } = useQuery({
    queryKey: ['seuil-sessions', user?.id],
    queryFn: () => SeuilService.getSessions(user!.id, 10),
    enabled: !!user?.id,
  });

  const startMutation = useMutation({
    mutationFn: async (params: { eventId?: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return SeuilService.startSession(user.id, params.eventId);
    },
    onSuccess: (session) => {
      setCurrentSession(session);
      queryClient.invalidateQueries({ queryKey: ['seuil-stats'] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (params: { strategies_used: string[]; effectiveness: number; mood_after: number; notes?: string }) => {
      if (!currentSession) throw new Error('No active session');
      return SeuilService.completeSession(currentSession.id, params);
    },
    onSuccess: () => {
      setCurrentSession(null);
      queryClient.invalidateQueries({ queryKey: ['seuil-stats'] });
      queryClient.invalidateQueries({ queryKey: ['seuil-sessions'] });
    },
  });

  return {
    currentSession,
    isSessionActive: !!currentSession,
    stats: stats ?? null,
    recentSessions,
    isLoadingStats,
    isLoadingRecent,
    startSession: useCallback((eventId?: string) => startMutation.mutateAsync({ eventId }), [startMutation]),
    completeSession: useCallback(
      (strategiesUsed: string[], effectiveness: number, moodAfter: number, notes?: string) =>
        completeMutation.mutateAsync({ strategies_used: strategiesUsed, effectiveness, mood_after: moodAfter, notes }),
      [completeMutation]
    ),
    cancelSession: useCallback(() => setCurrentSession(null), []),
    isStarting: startMutation.isPending,
    isCompleting: completeMutation.isPending,
  };
}
