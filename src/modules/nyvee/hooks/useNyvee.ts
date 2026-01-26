/**
 * useNyvee - Hook principal pour le module Nyvee
 * Respiration guidée avec bulle interactive
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { nyveeService } from '../nyveeServiceUnified';
import type { NyveeSession, BreathingIntensity, BadgeType } from '../types';

export function useNyvee() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentSession, setCurrentSession] = useState<NyveeSession | null>(null);

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['nyvee-stats', user?.id],
    queryFn: () => nyveeService.getStats(),
    enabled: !!user?.id,
    staleTime: 60000,
  });

  const { data: recentSessions = [], isLoading: isLoadingRecent } = useQuery({
    queryKey: ['nyvee-sessions', user?.id],
    queryFn: () => nyveeService.getRecentSessions(),
    enabled: !!user?.id,
  });

  const startMutation = useMutation({
    mutationFn: async (params: { intensity: BreathingIntensity; targetCycles: number }) => {
      return nyveeService.createSession(params);
    },
    onSuccess: (session) => {
      setCurrentSession(session);
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (params: { sessionId: string; cyclesCompleted: number; badgeEarned: BadgeType; moodAfter?: number }) => {
      return nyveeService.completeSession(params);
    },
    onSuccess: () => {
      setCurrentSession(null);
      queryClient.invalidateQueries({ queryKey: ['nyvee-stats'] });
      queryClient.invalidateQueries({ queryKey: ['nyvee-sessions'] });
    },
  });

  return {
    currentSession,
    isSessionActive: !!currentSession,
    stats: stats ?? null,
    recentSessions,
    isLoadingStats,
    isLoadingRecent,
    startSession: useCallback((intensity: BreathingIntensity, targetCycles: number) => startMutation.mutateAsync({ intensity, targetCycles }), [startMutation]),
    completeSession: useCallback((sessionId: string, cyclesCompleted: number, badgeEarned: BadgeType, moodAfter?: number) => completeMutation.mutateAsync({ sessionId, cyclesCompleted, badgeEarned, moodAfter }), [completeMutation]),
    cancelSession: useCallback(() => setCurrentSession(null), []),
    isStarting: startMutation.isPending,
    isCompleting: completeMutation.isPending,
  };
}
