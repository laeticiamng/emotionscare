/**
 * Hook pour le leaderboard en temps réel avec subscriptions Supabase
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  display_name: string;
  avatar_emoji: string;
  total_score: number;
  weekly_score: number;
  streak_days: number;
  level: number;
  updated_at: string;
}

export interface RealtimeLeaderboardData {
  globalTop: LeaderboardEntry[];
  weeklyTop: LeaderboardEntry[];
  userEntry: LeaderboardEntry | null;
  userGlobalRank: number;
  userWeeklyRank: number;
  totalPlayers: number;
  isLive: boolean;
}

export function useRealtimeLeaderboard(limit: number = 10) {
  const { user } = useAuth();
  const [data, setData] = useState<RealtimeLeaderboardData>({
    globalTop: [],
    weeklyTop: [],
    userEntry: null,
    userGlobalRank: 0,
    userWeeklyRank: 0,
    totalPlayers: 0,
    isLive: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);

    try {
      // Fetch global top
      const { data: globalTop, error: globalError } = await supabase
        .from('global_leaderboard')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(limit);

      if (globalError) throw globalError;

      // Fetch weekly top
      const { data: weeklyTop, error: weeklyError } = await supabase
        .from('global_leaderboard')
        .select('*')
        .order('weekly_score', { ascending: false })
        .limit(limit);

      if (weeklyError) throw weeklyError;

      // Get total count
      const { count } = await supabase
        .from('global_leaderboard')
        .select('*', { count: 'exact', head: true });

      // Get user entry and ranks
      let userEntry: LeaderboardEntry | null = null;
      let userGlobalRank = 0;
      let userWeeklyRank = 0;

      if (user) {
        const { data: userData } = await supabase
          .from('global_leaderboard')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (userData) {
          userEntry = userData as LeaderboardEntry;

          // Get global rank
          const { count: aboveGlobal } = await supabase
            .from('global_leaderboard')
            .select('*', { count: 'exact', head: true })
            .gt('total_score', userData.total_score);
          userGlobalRank = (aboveGlobal || 0) + 1;

          // Get weekly rank
          const { count: aboveWeekly } = await supabase
            .from('global_leaderboard')
            .select('*', { count: 'exact', head: true })
            .gt('weekly_score', userData.weekly_score);
          userWeeklyRank = (aboveWeekly || 0) + 1;
        }
      }

      setData({
        globalTop: (globalTop || []) as LeaderboardEntry[],
        weeklyTop: (weeklyTop || []) as LeaderboardEntry[],
        userEntry,
        userGlobalRank,
        userWeeklyRank,
        totalPlayers: count || 0,
        isLive: true
      });
    } catch (error) {
      logger.error('Failed to fetch realtime leaderboard', error as Error, 'LEADERBOARD');
    } finally {
      setIsLoading(false);
    }
  }, [user, limit]);

  const addScore = useCallback(async (points: number, options?: {
    displayName?: string;
    avatarEmoji?: string;
  }) => {
    if (!user) return null;

    try {
      const { data: existing } = await supabase
        .from('global_leaderboard')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existing) {
        const newTotal = (existing.total_score || 0) + points;
        const newWeekly = (existing.weekly_score || 0) + points;
        const newLevel = Math.floor(newTotal / 500) + 1;

        const { data, error } = await supabase
          .from('global_leaderboard')
          .update({
            total_score: newTotal,
            weekly_score: newWeekly,
            level: newLevel,
            display_name: options?.displayName || existing.display_name,
            avatar_emoji: options?.avatarEmoji || existing.avatar_emoji,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        return data as LeaderboardEntry;
      } else {
        const { data, error } = await supabase
          .from('global_leaderboard')
          .insert({
            user_id: user.id,
            display_name: options?.displayName || `Joueur`,
            avatar_emoji: options?.avatarEmoji || '✨',
            total_score: points,
            weekly_score: points,
            level: 1,
            streak_days: 0
          })
          .select()
          .single();

        if (error) throw error;
        return data as LeaderboardEntry;
      }
    } catch (error) {
      logger.error('Failed to add score', error as Error, 'LEADERBOARD');
      return null;
    }
  }, [user]);

  // Subscribe to realtime updates
  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'global_leaderboard'
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard]);

  return {
    ...data,
    isLoading,
    refresh: fetchLeaderboard,
    addScore
  };
}
