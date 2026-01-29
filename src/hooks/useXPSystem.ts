/**
 * useXPSystem - Hook centralisé pour le système XP
 * Corrige: XP Triggers ne s'incrémente pas
 */

import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface XPEvent {
  source: string;
  amount: number;
  timestamp: Date;
}

export interface UserXPStats {
  total_xp: number;
  level: number;
  xp_to_next_level: number;
  current_level_progress: number;
  recent_events: XPEvent[];
}

// XP rewards configuration
const XP_REWARDS: Record<string, number> = {
  // Sessions
  breath_session: 15,
  meditation_session: 20,
  scan_completed: 10,
  journal_entry: 15,
  coach_session: 25,
  vr_session: 30,
  ar_filter_used: 5,
  music_session: 10,

  // Streaks
  streak_3_days: 50,
  streak_7_days: 100,
  streak_14_days: 200,
  streak_30_days: 500,

  // Achievements
  first_scan: 25,
  first_journal: 25,
  first_breath: 25,
  profile_complete: 50,

  // Community
  community_post: 10,
  community_reaction: 2,
  community_comment: 5,

  // Goals
  goal_created: 10,
  goal_completed: 100,
};

// Level thresholds
const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500,
  10000, 13000, 17000, 22000, 28000, 35000, 43000, 52000, 62000, 75000,
];

export function useXPSystem() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<UserXPStats>({
    total_xp: 0,
    level: 1,
    xp_to_next_level: 100,
    current_level_progress: 0,
    recent_events: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // Calculate level from XP
  const calculateLevel = useCallback((xp: number): { level: number; progress: number; toNext: number } => {
    let level = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (xp >= LEVEL_THRESHOLDS[i]) {
        level = i + 1;
      } else {
        break;
      }
    }

    const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const xpInLevel = xp - currentThreshold;
    const xpNeeded = nextThreshold - currentThreshold;
    const progress = Math.round((xpInLevel / xpNeeded) * 100);

    return { level, progress, toNext: xpNeeded - xpInLevel };
  }, []);

  // Fetch user XP stats
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('user_stats')
        .select('total_xp')
        .eq('user_id', user.id)
        .single();

      const totalXP = data?.total_xp || 0;
      const { level, progress, toNext } = calculateLevel(totalXP);

      setStats({
        total_xp: totalXP,
        level,
        xp_to_next_level: toNext,
        current_level_progress: progress,
        recent_events: [],
      });
    } catch (err) {
      logger.error(`Failed to fetch XP stats: ${err}`, 'XP');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, calculateLevel]);

  // Award XP for an action
  const awardXP = useCallback(async (
    source: string,
    customAmount?: number
  ): Promise<{ awarded: number; levelUp: boolean }> => {
    if (!isAuthenticated || !user?.id) {
      return { awarded: 0, levelUp: false };
    }

    const amount = customAmount || XP_REWARDS[source] || 0;
    if (amount <= 0) {
      logger.warn(`Unknown XP source: ${source}`, 'XP');
      return { awarded: 0, levelUp: false };
    }

    try {
      const previousLevel = stats.level;

      // Update user_stats
      const { error } = await supabase.rpc('increment_user_xp', {
        p_user_id: user.id,
        p_amount: amount,
        p_source: source,
      });

      if (error) {
        // Fallback: direct upsert
        await supabase
          .from('user_stats')
          .upsert({
            user_id: user.id,
            total_xp: stats.total_xp + amount,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
      }

      // Log XP event
      await supabase
        .from('xp_events')
        .insert({
          user_id: user.id,
          source,
          amount,
          created_at: new Date().toISOString(),
        });

      // Update local state
      const newTotalXP = stats.total_xp + amount;
      const { level, progress, toNext } = calculateLevel(newTotalXP);
      const levelUp = level > previousLevel;

      setStats(prev => ({
        ...prev,
        total_xp: newTotalXP,
        level,
        xp_to_next_level: toNext,
        current_level_progress: progress,
        recent_events: [
          { source, amount, timestamp: new Date() },
          ...prev.recent_events.slice(0, 9),
        ],
      }));

      // Show toast
      toast({
        title: `+${amount} XP`,
        description: levelUp ? `🎉 Niveau ${level} atteint !` : undefined,
      });

      if (levelUp) {
        logger.info(`User leveled up to ${level}`, 'XP');
      }

      logger.info(`Awarded ${amount} XP for ${source}`, 'XP');
      return { awarded: amount, levelUp };
    } catch (err) {
      logger.error(`Failed to award XP: ${err}`, 'XP');
      return { awarded: 0, levelUp: false };
    }
  }, [isAuthenticated, user?.id, stats, calculateLevel, toast]);

  // Get XP for a specific action type
  const getXPReward = useCallback((source: string): number => {
    return XP_REWARDS[source] || 0;
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    awardXP,
    getXPReward,
    refetch: fetchStats,
    // Convenience getters
    totalXP: stats.total_xp,
    level: stats.level,
    progress: stats.current_level_progress,
    xpToNextLevel: stats.xp_to_next_level,
  };
}

export default useXPSystem;
