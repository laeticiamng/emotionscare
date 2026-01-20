/**
 * Hook useSessions
 * Gestion des sessions utilisateur avec React Query
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { SessionsService } from './sessionsService';
import type {
  Session,
  CreateSession,
  CompleteSession,
  SessionStats,
  SessionType,
} from './types';
import { toast } from 'sonner';

const QUERY_KEYS = {
  all: ['sessions'],
  history: (userId: string) => [...QUERY_KEYS.all, 'history', userId],
  stats: (userId: string) => [...QUERY_KEYS.all, 'stats', userId],
  active: (userId: string) => [...QUERY_KEYS.all, 'active', userId],
};

export interface UseSessionsOptions {
  type?: SessionType;
  limit?: number;
  autoRefresh?: boolean;
}

export interface UseSessionsReturn {
  // Data
  sessions: Session[];
  stats: SessionStats | null;
  activeSession: Session | null;
  
  // State
  isLoading: boolean;
  isStarting: boolean;
  isCompleting: boolean;
  
  // Actions
  startSession: (data: CreateSession) => Promise<Session>;
  completeSession: (sessionId: string, data: CompleteSession) => Promise<Session>;
  refreshSessions: () => Promise<void>;
  
  // Helpers
  hasActiveSession: boolean;
}

export function useSessions(options: UseSessionsOptions = {}): UseSessionsReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id || '';

  // Query: Session history
  const {
    data: sessions = [],
    isLoading: isLoadingSessions,
  } = useQuery({
    queryKey: QUERY_KEYS.history(userId),
    queryFn: () => SessionsService.getSessionHistory(userId, {
      type: options.type,
      limit: options.limit || 50,
    }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });

  // Query: Stats
  const {
    data: stats,
    isLoading: isLoadingStats,
  } = useQuery({
    queryKey: QUERY_KEYS.stats(userId),
    queryFn: () => SessionsService.getStats(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  // Query: Active session
  const {
    data: activeSession,
    isLoading: isLoadingActive,
  } = useQuery({
    queryKey: QUERY_KEYS.active(userId),
    queryFn: () => SessionsService.getActiveSession(userId),
    enabled: !!userId,
    staleTime: 1000 * 30,
    refetchInterval: options.autoRefresh ? 1000 * 60 : false,
  });

  // Mutation: Start session
  const startMutation = useMutation({
    mutationFn: (data: CreateSession) => SessionsService.startSession(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.active(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(userId) });
    },
    onError: () => {
      toast.error('Erreur lors du démarrage de la session');
    },
  });

  // Mutation: Complete session
  const completeMutation = useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: CompleteSession }) => 
      SessionsService.completeSession(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.active(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats(userId) });
      toast.success('Session terminée !');
    },
    onError: () => {
      toast.error('Erreur lors de la fin de session');
    },
  });

  // Actions
  const startSession = useCallback(
    (data: CreateSession) => startMutation.mutateAsync(data),
    [startMutation]
  );

  const completeSession = useCallback(
    (sessionId: string, data: CompleteSession) => 
      completeMutation.mutateAsync({ sessionId, data }),
    [completeMutation]
  );

  const refreshSessions = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
  }, [queryClient]);

  return {
    sessions,
    stats: stats || null,
    activeSession: activeSession || null,
    isLoading: isLoadingSessions || isLoadingStats || isLoadingActive,
    isStarting: startMutation.isPending,
    isCompleting: completeMutation.isPending,
    startSession,
    completeSession,
    refreshSessions,
    hasActiveSession: !!activeSession,
  };
}

export default useSessions;
