/**
 * Hook principal pour le module VR Nebula
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import * as vrNebulaService from './vrNebulaService';
import type { VRNebulaSession, NebulaScene, BreathingPattern } from './types';

export function useVRNebula() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentSession, setCurrentSession] = useState<VRNebulaSession | null>(null);

  // Stats query
  const statsQuery = useQuery({
    queryKey: ['vr-nebula-stats', user?.id],
    queryFn: () => vrNebulaService.getStats(),
    enabled: !!user?.id,
    staleTime: 60000,
  });

  // Recent sessions query
  const recentQuery = useQuery({
    queryKey: ['vr-nebula-recent', user?.id],
    queryFn: () => vrNebulaService.getRecentSessions(10),
    enabled: !!user?.id,
  });

  // Start session mutation
  const startMutation = useMutation({
    mutationFn: async (params: { scene: NebulaScene; breathing_pattern: BreathingPattern; vr_mode: boolean }) => {
      return vrNebulaService.createSession(params);
    },
    onSuccess: (session) => {
      setCurrentSession(session);
    },
  });

  // Complete session mutation
  const completeMutation = useMutation({
    mutationFn: async (params: {
      duration_s: number;
      cycles_completed: number;
      resp_rate_avg?: number;
      hrv_pre?: number;
      hrv_post?: number;
    }) => {
      if (!currentSession) throw new Error('No active session');
      return vrNebulaService.completeSession({
        session_id: currentSession.id,
        ...params,
      });
    },
    onSuccess: () => {
      setCurrentSession(null);
      queryClient.invalidateQueries({ queryKey: ['vr-nebula-stats'] });
      queryClient.invalidateQueries({ queryKey: ['vr-nebula-recent'] });
    },
  });

  // Helper functions
  const startSession = useCallback(
    (scene: NebulaScene, breathingPattern: BreathingPattern, vrMode: boolean = false) => {
      return startMutation.mutateAsync({ scene, breathing_pattern: breathingPattern, vr_mode: vrMode });
    },
    [startMutation]
  );

  const endSession = useCallback(
    (durationSeconds: number, cyclesCompleted: number, respRateAvg?: number, hrvPre?: number, hrvPost?: number) => {
      return completeMutation.mutateAsync({
        duration_s: durationSeconds,
        cycles_completed: cyclesCompleted,
        resp_rate_avg: respRateAvg,
        hrv_pre: hrvPre,
        hrv_post: hrvPost,
      });
    },
    [completeMutation]
  );

  const cancelSession = useCallback(() => {
    setCurrentSession(null);
  }, []);

  return {
    // State
    currentSession,
    isSessionActive: !!currentSession,

    // Data
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
    recentSessions: recentQuery.data ?? [],
    isLoadingRecent: recentQuery.isLoading,

    // Actions
    startSession,
    endSession,
    cancelSession,

    // Loading states
    isStartingSession: startMutation.isPending,
    isEndingSession: completeMutation.isPending,
  };
}
