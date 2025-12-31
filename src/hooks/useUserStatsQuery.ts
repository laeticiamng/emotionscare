/**
 * Hook React Query pour les statistiques utilisateur avec cache optimisé
 * Inclut revalidation intelligente et invalidation sur actions
 */

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface UserStats {
  weeklyGoals: number;
  completedSessions: number;
  totalPoints: number;
  currentStreak: number;
  level: number;
  rank: string;
}

const DEFAULT_STATS: UserStats = {
  weeklyGoals: 0,
  completedSessions: 0,
  totalPoints: 0,
  currentStreak: 0,
  level: 1,
  rank: 'Débutant'
};

function calculateLevel(points: number): number {
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

function calculateRank(level: number): string {
  if (level >= 20) return 'Maître Émotionnel';
  if (level >= 15) return 'Expert du Bien-être';
  if (level >= 10) return 'Explorateur Émotionnel';
  if (level >= 5) return 'Apprenti';
  return 'Débutant';
}

async function fetchUserStats(userId: string): Promise<UserStats> {
  try {
    // Paralléliser les requêtes pour optimiser les performances
    const [userStatsData, sessionsCount, weeklyGoalsCount] = await Promise.all([
      supabase
        .from('user_stats')
        .select('total_points, streak_days')
        .eq('user_id', userId)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) logger.warn('Error loading user stats', error, 'DB');
          return data;
        }),
      
      supabase
        .from('clinical_signals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .then(({ count, error }) => {
          if (error) logger.warn('Error loading sessions count', error, 'DB');
          return count || 0;
        }),
      
      supabase
        .from('user_goals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .then(({ count, error }) => {
          if (error) logger.warn('Error loading weekly goals', error, 'DB');
          return count || 0;
        })
    ]);

    const totalPoints = userStatsData?.total_points || 0;
    const level = calculateLevel(totalPoints);

    return {
      totalPoints,
      currentStreak: userStatsData?.streak_days || 0,
      completedSessions: sessionsCount,
      weeklyGoals: weeklyGoalsCount,
      level,
      rank: calculateRank(level)
    };
  } catch (error) {
    logger.error('Error fetching user stats', error as Error, 'DB');
    return DEFAULT_STATS;
  }
}

export function useUserStatsQuery() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: () => fetchUserStats(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes - données fraîches
    gcTime: 5 * 60 * 1000, // 5 minutes - garde en cache
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fonction pour invalider et refetch les stats après une action
  const invalidateStats = async () => {
    await queryClient.invalidateQueries({ queryKey: ['userStats', user?.id] });
    logger.debug('User stats invalidated and refetching', {}, 'CACHE');
  };

  // Fonction pour mettre à jour optimistiquement les stats
  const updateStatsOptimistically = (updater: (old: UserStats) => UserStats) => {
    queryClient.setQueryData(['userStats', user?.id], updater);
    logger.debug('User stats updated optimistically', {}, 'CACHE');
  };

  return {
    stats: query.data || DEFAULT_STATS,
    loading: query.isLoading,
    error: query.error,
    isRefetching: query.isRefetching,
    invalidateStats,
    updateStatsOptimistically,
    refetch: query.refetch
  };
}

// Hook pour écouter les changements en temps réel et invalider le cache
export function useUserStatsRealtime() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Écouter les changements sur user_stats, clinical_signals, et user_goals
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('user-stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_stats',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          logger.debug('User stats changed, invalidating cache', {}, 'REALTIME');
          queryClient.invalidateQueries({ queryKey: ['userStats', user.id] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'clinical_signals',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          logger.debug('New scan added, invalidating stats cache', {}, 'REALTIME');
          queryClient.invalidateQueries({ queryKey: ['userStats', user.id] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_goals',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          logger.debug('Goal changed, invalidating stats cache', {}, 'REALTIME');
          queryClient.invalidateQueries({ queryKey: ['userStats', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);
}
