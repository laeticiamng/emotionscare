/**
 * Hook pour le leaderboard global persisté
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
  rank_position?: number;
  updated_at: string;
}

export interface LeaderboardData {
  topPlayers: LeaderboardEntry[];
  userRank?: LeaderboardEntry;
  userPosition: number;
  totalPlayers: number;
}

export function useGlobalLeaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardData>({
    topPlayers: [],
    userPosition: 0,
    totalPlayers: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeaderboard = useCallback(async (limit: number = 10) => {
    setIsLoading(true);

    try {
      // Fetch top players
      const { data: topPlayers, error: topError } = await supabase
        .from('global_leaderboard')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(limit);

      if (topError) throw topError;

      // Get total count
      const { count, error: countError } = await supabase
        .from('global_leaderboard')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Get user's rank if logged in
      let userRank: LeaderboardEntry | undefined;
      let userPosition = 0;

      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('global_leaderboard')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!userError && userData) {
          userRank = userData as LeaderboardEntry;
          
          // Calculate position
          const { count: aboveCount } = await supabase
            .from('global_leaderboard')
            .select('*', { count: 'exact', head: true })
            .gt('total_score', userData.total_score);

          userPosition = (aboveCount || 0) + 1;
        }
      }

      setLeaderboard({
        topPlayers: (topPlayers || []) as LeaderboardEntry[],
        userRank,
        userPosition,
        totalPlayers: count || 0
      });
    } catch (error) {
      logger.error('Failed to fetch leaderboard', error as Error, 'LEADERBOARD');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateUserScore = useCallback(async (scoreToAdd: number, options?: {
    displayName?: string;
    avatarEmoji?: string;
  }) => {
    if (!user) return null;

    try {
      // Check if user exists in leaderboard
      const { data: existing } = await supabase
        .from('global_leaderboard')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Update existing entry
        const newScore = existing.total_score + scoreToAdd;
        const newWeeklyScore = existing.weekly_score + scoreToAdd;
        const newLevel = Math.floor(newScore / 500) + 1;

        const { data, error } = await supabase
          .from('global_leaderboard')
          .update({
            total_score: newScore,
            weekly_score: newWeeklyScore,
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
        // Create new entry
        const { data, error } = await supabase
          .from('global_leaderboard')
          .insert({
            user_id: user.id,
            display_name: options?.displayName || `Player ${user.id.slice(0, 4)}`,
            avatar_emoji: options?.avatarEmoji || '✨',
            total_score: scoreToAdd,
            weekly_score: scoreToAdd,
            level: 1
          })
          .select()
          .single();

        if (error) throw error;
        return data as LeaderboardEntry;
      }
    } catch (error) {
      logger.error('Failed to update user score', error as Error, 'LEADERBOARD');
      return null;
    }
  }, [user]);

  const updateStreak = useCallback(async (streakDays: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('global_leaderboard')
        .update({ streak_days: streakDays })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      logger.error('Failed to update streak', error as Error, 'LEADERBOARD');
    }
  }, [user]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    isLoading,
    fetchLeaderboard,
    updateUserScore,
    updateStreak
  };
}
