/**
 * Hook pour récupérer les statistiques utilisateur depuis Supabase
 * Remplace les données mockées par de vraies données
 */

import { useState, useEffect } from 'react';
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

/**
 * Calcule le niveau basé sur les points
 */
function calculateLevel(points: number): number {
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

/**
 * Calcule le rang basé sur le niveau
 */
function calculateRank(level: number): string {
  if (level >= 20) return 'Maître Émotionnel';
  if (level >= 15) return 'Expert du Bien-être';
  if (level >= 10) return 'Explorateur Émotionnel';
  if (level >= 5) return 'Apprenti';
  return 'Débutant';
}

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setStats(DEFAULT_STATS);
      setLoading(false);
      return;
    }

    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      // Récupérer les points totaux et streak depuis user_stats
      const { data: userStatsData, error: statsError } = await supabase
        .from('user_stats')
        .select('total_points, streak_days')
        .eq('user_id', user.id)
        .maybeSingle();

      if (statsError) {
        logger.warn('Error loading user stats', statsError, 'DB');
      }

      // Récupérer le nombre de sessions complétées
      const { count: sessionsCount, error: sessionsError } = await supabase
        .from('scan_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (sessionsError) {
        logger.warn('Error loading sessions count', sessionsError, 'DB');
      }

      // Récupérer les objectifs hebdomadaires
      const { count: weeklyGoalsCount, error: goalsError } = await supabase
        .from('user_goals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (goalsError) {
        logger.warn('Error loading weekly goals', goalsError, 'DB');
      }

      const totalPoints = userStatsData?.total_points || 0;
      const level = calculateLevel(totalPoints);

      const newStats: UserStats = {
        totalPoints,
        currentStreak: userStatsData?.streak_days || 0,
        completedSessions: sessionsCount || 0,
        weeklyGoals: weeklyGoalsCount || 0,
        level,
        rank: calculateRank(level)
      };

      setStats(newStats);
      logger.debug('User stats loaded', newStats, 'ANALYTICS');
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Error loading user stats', error, 'DB');
      setError(error);
      setStats(DEFAULT_STATS);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    if (user) {
      loadUserStats();
    }
  };

  return {
    stats,
    loading,
    error,
    refreshStats
  };
}
