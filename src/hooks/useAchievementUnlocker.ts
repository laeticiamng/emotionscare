/**
 * useAchievementUnlocker - Hook pour débloquer automatiquement les badges
 * Corrige le problème de user_achievements: 0 badges
 */

import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  conditions: {
    type: string;
    value: number;
    category?: string;
  };
  rewards: {
    xp: number;
    badge?: string;
  };
}

interface UserStats {
  total_sessions: number;
  total_minutes: number;
  current_streak: number;
  longest_streak: number;
  total_xp: number;
  breath_sessions: number;
  meditation_sessions: number;
  scan_count: number;
  journal_entries: number;
}

export function useAchievementUnlocker() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const checkedRef = useRef(false);

  /**
   * Vérifie et débloque les achievements éligibles
   */
  const checkAndUnlockAchievements = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      // Get user stats
      const stats = await getUserStats(user.id);
      
      // Get all achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*');

      if (!achievements) return;

      // Get already unlocked achievements
      const { data: unlocked } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id);

      const unlockedIds = new Set(unlocked?.map(u => u.achievement_id) || []);

      // Check each achievement
      for (const achievement of achievements) {
        if (unlockedIds.has(achievement.id)) continue;

        const isEligible = checkAchievementCondition(achievement as Achievement, stats);
        
        if (isEligible) {
          await unlockAchievement(user.id, achievement as Achievement);
        }
      }
    } catch (err) {
      logger.error(`Achievement check failed: ${err}`, 'ACHIEVEMENTS');
    }
  }, [isAuthenticated, user?.id]);

  /**
   * Débloque un achievement spécifique
   */
  const unlockAchievement = useCallback(async (
    userId: string,
    achievement: Achievement
  ) => {
    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievement.id,
          unlocked_at: new Date().toISOString(),
          notified: false,
        });

      if (error) {
        if (error.code === '23505') return; // Already exists
        throw error;
      }

      // Award XP
      if (achievement.rewards?.xp) {
        await supabase.rpc('increment_user_xp', {
          p_user_id: userId,
          p_amount: achievement.rewards.xp,
          p_source: `achievement_${achievement.id}`,
        });
      }

      // Show toast notification
      toast({
        title: '🏆 Badge débloqué !',
        description: `${achievement.name} - ${achievement.description}`,
        duration: 5000,
      });

      logger.info(`Unlocked achievement: ${achievement.name}`, 'ACHIEVEMENTS');
    } catch (err) {
      logger.error(`Failed to unlock achievement: ${err}`, 'ACHIEVEMENTS');
    }
  }, [toast]);

  /**
   * Force check on mount (once)
   */
  useEffect(() => {
    if (isAuthenticated && !checkedRef.current) {
      checkedRef.current = true;
      // Delay to avoid blocking initial render
      const timer = setTimeout(checkAndUnlockAchievements, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, checkAndUnlockAchievements]);

  /**
   * Manual trigger for specific action
   */
  const triggerCheck = useCallback(async (action: string) => {
    logger.debug(`Achievement check triggered by: ${action}`, 'ACHIEVEMENTS');
    await checkAndUnlockAchievements();
  }, [checkAndUnlockAchievements]);

  return {
    checkAndUnlockAchievements,
    triggerCheck,
  };
}

// Helper functions
async function getUserStats(userId: string): Promise<UserStats> {
  const defaultStats: UserStats = {
    total_sessions: 0,
    total_minutes: 0,
    current_streak: 0,
    longest_streak: 0,
    total_xp: 0,
    breath_sessions: 0,
    meditation_sessions: 0,
    scan_count: 0,
    journal_entries: 0,
  };

  try {
    // Get activity sessions count
    const { count: sessionsCount } = await supabase
      .from('activity_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true);

    // Get streak info
    const { data: streak } = await supabase
      .from('activity_streaks')
      .select('current_streak, longest_streak, total_minutes')
      .eq('user_id', userId)
      .single();

    // Get user stats
    const { data: stats } = await supabase
      .from('user_stats')
      .select('total_xp')
      .eq('user_id', userId)
      .single();

    // Get emotion sessions count
    const { count: scansCount } = await supabase
      .from('emotion_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get journal entries count
    const { count: journalCount } = await supabase
      .from('journal_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return {
      total_sessions: sessionsCount || 0,
      total_minutes: streak?.total_minutes || 0,
      current_streak: streak?.current_streak || 0,
      longest_streak: streak?.longest_streak || 0,
      total_xp: stats?.total_xp || 0,
      breath_sessions: sessionsCount || 0,
      meditation_sessions: 0,
      scan_count: scansCount || 0,
      journal_entries: journalCount || 0,
    };
  } catch (err) {
    logger.error(`Failed to get user stats: ${err}`, 'ACHIEVEMENTS');
    return defaultStats;
  }
}

function checkAchievementCondition(
  achievement: Achievement,
  stats: UserStats
): boolean {
  const { type, value, category } = achievement.conditions || {};

  switch (type) {
    case 'sessions_count':
      return stats.total_sessions >= value;
    case 'streak_days':
      return stats.current_streak >= value;
    case 'longest_streak':
      return stats.longest_streak >= value;
    case 'total_minutes':
      return stats.total_minutes >= value;
    case 'total_xp':
      return stats.total_xp >= value;
    case 'scan_count':
      return stats.scan_count >= value;
    case 'journal_entries':
      return stats.journal_entries >= value;
    case 'category_sessions':
      if (category === 'breath') return stats.breath_sessions >= value;
      if (category === 'meditation') return stats.meditation_sessions >= value;
      return false;
    default:
      return false;
  }
}

export default useAchievementUnlocker;
