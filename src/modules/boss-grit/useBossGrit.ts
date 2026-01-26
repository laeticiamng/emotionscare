/**
 * Hook useBossGrit
 * Gestion des Bounce Battles avec React Query
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { BossGritService } from './bossGritService';
import type {
  BounceBattle,
  BattleMode,
  BounceEventType,
  BounceEventData,
  BattleStats,
} from './types';

// ============================================================================
// TYPES
// ============================================================================

export interface UseBossGritReturn {
  // Data
  currentBattle: BounceBattle | null;
  history: BounceBattle[];
  stats: BattleStats | null;
  
  // State
  isInBattle: boolean;
  battleProgress: number;
  
  // Loading states
  isLoading: boolean;
  isStarting: boolean;
  
  // Actions
  startBattle: (mode?: BattleMode) => Promise<BounceBattle>;
  submitResponse: (questionId: string, responseValue: number) => Promise<void>;
  logEvent: (eventType: BounceEventType, eventData?: BounceEventData) => Promise<void>;
  completeBattle: () => Promise<void>;
  cancelBattle: () => void;
  refreshHistory: () => Promise<void>;
}

// ============================================================================
// QUERY KEYS
// ============================================================================

const QUERY_KEYS = {
  history: (userId: string) => ['boss-grit', 'history', userId],
  stats: (userId: string) => ['boss-grit', 'stats', userId],
  responses: (battleId: string) => ['boss-grit', 'responses', battleId],
};

// ============================================================================
// HOOK
// ============================================================================

export function useBossGrit(): UseBossGritReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id || '';

  // Local state
  const [currentBattle, setCurrentBattle] = useState<BounceBattle | null>(null);
  const [battleProgress, setBattleProgress] = useState(0);
  const [battleStartTime, setBattleStartTime] = useState<number | null>(null);

  // Fetch history
  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: QUERY_KEYS.history(userId),
    queryFn: () => BossGritService.fetchHistory(userId, 50),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  // Calculate stats from history
  const completedBattles = history.filter(b => b.status === 'completed');
  const stats: BattleStats | null = history.length > 0 ? {
    user_id: userId,
    total_battles: history.length,
    completed_battles: completedBattles.length,
    completion_rate: (completedBattles.length / history.length) * 100,
    average_duration_seconds: history.reduce((sum, b) => sum + (b.duration_seconds || 0), 0) / history.length,
    best_time_seconds: Math.min(...completedBattles.map(b => b.duration_seconds || Infinity)),
    total_questions_answered: 0, // Would need separate query
    average_response_value: 0, // Would need separate query
    modes_played: history.reduce((acc, b) => {
      acc[b.mode] = (acc[b.mode] || 0) + 1;
      return acc;
    }, {} as Record<BattleMode, number>),
    milestones_reached: 0,
    last_battle_date: history[0]?.created_at || '',
  } : null;

  // Start battle mutation
  const startMutation = useMutation({
    mutationFn: async (mode: BattleMode = 'standard') => {
      const battle = await BossGritService.createBattle(userId, mode);
      await BossGritService.startBattle(battle.id);
      return { ...battle, status: 'in_progress' as const };
    },
    onSuccess: (battle) => {
      setCurrentBattle(battle);
      setBattleStartTime(Date.now());
      setBattleProgress(0);
    },
  });

  // Submit response mutation
  const responseMutation = useMutation({
    mutationFn: async ({ questionId, responseValue }: { questionId: string; responseValue: number }) => {
      if (!currentBattle) throw new Error('No active battle');
      await BossGritService.saveCopingResponse(currentBattle.id, questionId, responseValue);
    },
    onSuccess: () => {
      // Update progress (assuming 10 questions per battle)
      setBattleProgress(prev => Math.min(prev + 10, 100));
    },
  });

  // Log event mutation
  const eventMutation = useMutation({
    mutationFn: async ({ eventType, eventData }: { eventType: BounceEventType; eventData?: BounceEventData }) => {
      if (!currentBattle) throw new Error('No active battle');
      await BossGritService.logEvent(currentBattle.id, eventType, eventData);
    },
  });

  // Complete battle mutation
  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!currentBattle || !battleStartTime) throw new Error('No active battle');
      const duration = Math.floor((Date.now() - battleStartTime) / 1000);
      await BossGritService.completeBattle(currentBattle.id, duration);
    },
    onSuccess: () => {
      setCurrentBattle(null);
      setBattleStartTime(null);
      setBattleProgress(0);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(userId) });
    },
  });

  // Actions
  const startBattle = useCallback(async (mode: BattleMode = 'standard'): Promise<BounceBattle> => {
    return startMutation.mutateAsync(mode);
  }, [startMutation]);

  const submitResponse = useCallback(async (questionId: string, responseValue: number): Promise<void> => {
    await responseMutation.mutateAsync({ questionId, responseValue });
  }, [responseMutation]);

  const logEvent = useCallback(async (eventType: BounceEventType, eventData?: BounceEventData): Promise<void> => {
    await eventMutation.mutateAsync({ eventType, eventData });
  }, [eventMutation]);

  const completeBattle = useCallback(async (): Promise<void> => {
    await completeMutation.mutateAsync();
  }, [completeMutation]);

  const cancelBattle = useCallback(() => {
    setCurrentBattle(null);
    setBattleStartTime(null);
    setBattleProgress(0);
  }, []);

  const refreshHistory = useCallback(async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(userId) });
  }, [queryClient, userId]);

  return {
    currentBattle,
    history,
    stats,
    isInBattle: !!currentBattle,
    battleProgress,
    isLoading: isLoadingHistory,
    isStarting: startMutation.isPending,
    startBattle,
    submitResponse,
    logEvent,
    completeBattle,
    cancelBattle,
    refreshHistory,
  };
}

export default useBossGrit;
