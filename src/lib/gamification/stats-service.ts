/**
 * Gamification Stats Service - Real Supabase Implementation
 * Fetches user gamification stats from the database
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GamificationStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  consecutiveLogins: number;
  totalSessions: number;
  totalMoodEntries: number;
  totalMeditationMinutes: number;
  badges: Badge[];
  achievements: string[];
  streakDays: number;
  progressToNextLevel: number;
}

const XP_PER_LEVEL = 500;

export const StatsService = {
  /**
   * Fetch gamification stats for a user from Supabase
   */
  async getStatsForUser(userId: string): Promise<GamificationStats> {
    try {
      // Fetch user profile with gamification data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('xp, level, streak_days, consecutive_logins, created_at')
        .eq('id', userId)
        .single();

      if (profileError) {
        logger.warn('Profile fetch failed, using defaults', { error: profileError.message }, 'GAMIFICATION');
      }

      // Fetch user badges
      const { data: userBadges, error: badgesError } = await supabase
        .from('user_badges')
        .select(`
          id,
          unlocked_at,
          badges (
            id,
            name,
            description,
            category,
            image_url
          )
        `)
        .eq('user_id', userId);

      if (badgesError) {
        logger.warn('Badges fetch failed', { error: badgesError.message }, 'GAMIFICATION');
      }

      // Fetch session count
      const { count: sessionCount } = await supabase
        .from('activity_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Fetch mood entries count
      const { count: moodCount } = await supabase
        .from('mood_scans')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Fetch meditation minutes
      const { data: meditationData } = await supabase
        .from('activity_sessions')
        .select('duration_sec')
        .eq('user_id', userId)
        .in('activity_type', ['meditation', 'breathwork', 'mindfulness']);

      const totalMeditationMinutes = meditationData
        ? Math.round(meditationData.reduce((acc, s) => acc + (s.duration_sec || 0), 0) / 60)
        : 0;

      // Fetch achievements
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

      // Calculate stats
      const xp = profile?.xp || 0;
      const level = profile?.level || Math.floor(xp / XP_PER_LEVEL) + 1;
      const xpInCurrentLevel = xp % XP_PER_LEVEL;
      const progressToNextLevel = xpInCurrentLevel / XP_PER_LEVEL;

      // Transform badges
      const badges: Badge[] = (userBadges || []).map((ub: any) => ({
        id: ub.badges?.id || ub.id,
        name: ub.badges?.name || 'Badge',
        description: ub.badges?.description || '',
        category: ub.badges?.category || 'general',
        image: ub.badges?.image_url || '/badges/default.png',
        unlocked: true,
        unlockedAt: ub.unlocked_at
      }));

      return {
        level,
        xp,
        xpToNextLevel: XP_PER_LEVEL,
        consecutiveLogins: profile?.consecutive_logins || 0,
        totalSessions: sessionCount || 0,
        totalMoodEntries: moodCount || 0,
        totalMeditationMinutes,
        badges,
        achievements: achievements?.map(a => a.achievement_id) || [],
        streakDays: profile?.streak_days || 0,
        progressToNextLevel
      };
    } catch (error) {
      logger.error('Stats service error', error as Error, 'GAMIFICATION');

      // Return default stats on error
      return {
        level: 1,
        xp: 0,
        xpToNextLevel: XP_PER_LEVEL,
        consecutiveLogins: 0,
        totalSessions: 0,
        totalMoodEntries: 0,
        totalMeditationMinutes: 0,
        badges: [],
        achievements: [],
        streakDays: 0,
        progressToNextLevel: 0
      };
    }
  },

  /**
   * Add XP to user and handle level ups
   */
  async addXP(userId: string, amount: number, reason: string): Promise<{ newXP: number; leveledUp: boolean; newLevel: number }> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', userId)
        .single();

      const currentXP = profile?.xp || 0;
      const currentLevel = profile?.level || 1;
      const newXP = currentXP + amount;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
      const leveledUp = newLevel > currentLevel;

      await supabase
        .from('profiles')
        .update({ xp: newXP, level: newLevel })
        .eq('id', userId);

      // Log XP gain
      await supabase.from('xp_logs').insert({
        user_id: userId,
        amount,
        reason,
        created_at: new Date().toISOString()
      });

      if (leveledUp) {
        logger.info('User leveled up', { userId, newLevel }, 'GAMIFICATION');
      }

      return { newXP, leveledUp, newLevel };
    } catch (error) {
      logger.error('Add XP failed', error as Error, 'GAMIFICATION');
      return { newXP: 0, leveledUp: false, newLevel: 1 };
    }
  },

  /**
   * Update user streak
   */
  async updateStreak(userId: string): Promise<number> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('streak_days, last_activity_date')
        .eq('id', userId)
        .single();

      const today = new Date().toISOString().split('T')[0];
      const lastActivity = profile?.last_activity_date;
      const currentStreak = profile?.streak_days || 0;

      let newStreak = currentStreak;

      if (!lastActivity) {
        newStreak = 1;
      } else {
        const lastDate = new Date(lastActivity);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          // Same day, no change
        } else if (diffDays === 1) {
          newStreak = currentStreak + 1;
        } else {
          newStreak = 1; // Streak broken
        }
      }

      await supabase
        .from('profiles')
        .update({ streak_days: newStreak, last_activity_date: today })
        .eq('id', userId);

      return newStreak;
    } catch (error) {
      logger.error('Update streak failed', error as Error, 'GAMIFICATION');
      return 0;
    }
  }
};

export default StatsService;
