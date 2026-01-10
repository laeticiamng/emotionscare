/**
 * Hook pour gérer l'entrée utilisateur dans le leaderboard
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  total_xp: number;
  level: number;
  weekly_xp: number;
  monthly_xp: number;
  streak_days: number;
  activities_completed: number;
  rank?: number;
  last_activity_at: string;
  updated_at: string;
  created_at: string;
}

export interface LeaderboardStats {
  globalRank: number | null;
  weeklyRank: number | null;
  percentile: number;
  totalParticipants: number;
}

export function useLeaderboardEntry() {
  const { user } = useAuth();
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);
  const [topEntries, setTopEntries] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    globalRank: null,
    weeklyRank: null,
    percentile: 0,
    totalParticipants: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);

    try {
      // Fetch top 100 entries
      const { data: topData, error: topError } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(100);

      if (topError) throw topError;

      // Add rank
      const rankedEntries = (topData || []).map((entry, index) => ({
        ...entry,
        rank: index + 1
      })) as LeaderboardEntry[];

      setTopEntries(rankedEntries);

      // Fetch my entry if logged in
      if (user) {
        const { data: myData, error: myError } = await supabase
          .from('leaderboard_entries')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (myError && myError.code !== 'PGRST116') throw myError;

        if (myData) {
          const myRank = rankedEntries.findIndex(e => e.user_id === user.id) + 1;
          setMyEntry({ ...myData, rank: myRank || null } as LeaderboardEntry);

          // Calculate stats
          const totalParticipants = rankedEntries.length;
          const percentile = myRank > 0 
            ? Math.round(((totalParticipants - myRank + 1) / totalParticipants) * 100)
            : 0;

          setStats({
            globalRank: myRank || null,
            weeklyRank: null, // TODO: implement weekly ranking
            percentile,
            totalParticipants
          });
        }
      }
    } catch (error) {
      logger.error('Failed to fetch leaderboard', error as Error, 'LEADERBOARD');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateMyEntry = useCallback(async (updates: Partial<Pick<
    LeaderboardEntry, 
    'display_name' | 'avatar_url' | 'total_xp' | 'weekly_xp' | 'monthly_xp' | 'streak_days' | 'activities_completed' | 'level'
  >>) => {
    if (!user) return null;

    try {
      const updateData = {
        ...updates,
        user_id: user.id,
        updated_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      };

      // Upsert the entry
      const { data, error } = await supabase
        .from('leaderboard_entries')
        .upsert(updateData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;

      setMyEntry(data as LeaderboardEntry);
      return data as LeaderboardEntry;
    } catch (error) {
      logger.error('Failed to update leaderboard entry', error as Error, 'LEADERBOARD');
      return null;
    }
  }, [user]);

  const addXP = useCallback(async (xpAmount: number) => {
    if (!user || !myEntry) return null;

    const newTotalXP = (myEntry.total_xp || 0) + xpAmount;
    const newWeeklyXP = (myEntry.weekly_xp || 0) + xpAmount;
    const newMonthlyXP = (myEntry.monthly_xp || 0) + xpAmount;
    const newLevel = Math.floor(newTotalXP / 500) + 1;

    return updateMyEntry({
      total_xp: newTotalXP,
      weekly_xp: newWeeklyXP,
      monthly_xp: newMonthlyXP,
      level: newLevel,
      activities_completed: (myEntry.activities_completed || 0) + 1
    });
  }, [user, myEntry, updateMyEntry]);

  const initializeEntry = useCallback(async (displayName: string, avatarUrl?: string) => {
    if (!user) return null;

    return updateMyEntry({
      display_name: displayName,
      avatar_url: avatarUrl,
      total_xp: 0,
      weekly_xp: 0,
      monthly_xp: 0,
      streak_days: 0,
      activities_completed: 0,
      level: 1
    });
  }, [user, updateMyEntry]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    myEntry,
    topEntries,
    stats,
    isLoading,
    fetchLeaderboard,
    updateMyEntry,
    addXP,
    initializeEntry
  };
}
