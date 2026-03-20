import type { Badge, Challenge, GamificationStats } from '@/types/gamification';
import { supabase } from '@/integrations/supabase/client';

// Service for gamification features backed by Supabase
const GamificationService = {
  // Get user badges
  getUserBadges: async (userId: string): Promise<Badge[]> => {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievements(*)')
      .eq('user_id', userId);

    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.achievement_id || row.id,
      name: row.achievements?.name || 'Badge',
      description: row.achievements?.description || '',
      category: row.achievements?.category || 'achievement',
      image: row.achievements?.image_url || '',
      imageUrl: row.achievements?.image_url || '',
      unlocked: true,
      unlockedAt: row.unlocked_at || row.created_at,
    }));
  },

  // Get user challenges
  getUserChallenges: async (userId: string): Promise<Challenge[]> => {
    const { data, error } = await supabase
      .from('challenges')
      .select('*, user_challenges!left(progress, completed)')
      .or(`status.eq.active,user_challenges.user_id.eq.${userId}`);

    if (error) throw error;

    return (data ?? []).map((row: any) => {
      const userProgress = row.user_challenges?.[0];
      return {
        id: row.id,
        title: row.title || row.name,
        name: row.title || row.name,
        description: row.description || '',
        type: row.type || 'progress',
        targetValue: row.target_value || 10,
        currentValue: userProgress?.progress || 0,
        completed: userProgress?.completed || false,
        difficulty: row.difficulty || 'medium',
        category: row.category || 'general',
        deadline: row.deadline,
      };
    });
  },

  // Get user gamification stats
  getUserStats: async (userId: string): Promise<GamificationStats> => {
    const badges = await GamificationService.getUserBadges(userId);

    const { data: profile } = await supabase
      .from('profiles')
      .select('level, xp, streak_days')
      .eq('id', userId)
      .single();

    const { count: totalMoodEntries } = await supabase
      .from('mood_entries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    const level = profile?.level || 1;
    const xp = profile?.xp || 0;
    const xpToNextLevel = level * 1000;

    return {
      level,
      xp,
      xpToNextLevel,
      consecutiveLogins: profile?.streak_days || 0,
      totalSessions: 0,
      totalMoodEntries: totalMoodEntries || 0,
      totalMeditationMinutes: 0,
      badges,
      achievements: badges.map((b: any) => b.id),
      streakDays: profile?.streak_days || 0,
      progressToNextLevel: xpToNextLevel > 0 ? xp / xpToNextLevel : 0,
    };
  },

  // Award a badge to a user
  awardBadge: async (userId: string, badgeType: string): Promise<Badge> => {
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: badgeType,
        unlocked_at: new Date().toISOString(),
      })
      .select('*, achievements(*)')
      .single();

    if (error) throw error;

    return {
      id: data.achievement_id || data.id,
      name: data.achievements?.name || 'New Achievement',
      description: data.achievements?.description || '',
      imageUrl: data.achievements?.image_url || '',
      image: data.achievements?.image_url || '',
      unlocked: true,
      category: data.achievements?.category || 'achievement',
    };
  },

  // Update challenge progress
  updateChallengeProgress: async (userId: string, challengeId: string, progress: number): Promise<Challenge> => {
    const { data: challenge } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    const targetValue = challenge?.target_value || 10;
    const completed = progress >= targetValue;

    await supabase
      .from('user_challenges')
      .upsert({
        user_id: userId,
        challenge_id: challengeId,
        progress,
        completed,
        updated_at: new Date().toISOString(),
      });

    return {
      id: challengeId,
      title: challenge?.title || 'Challenge',
      name: challenge?.title || 'Challenge',
      description: challenge?.description || '',
      type: challenge?.type || 'progress',
      targetValue,
      currentValue: progress,
      completed,
      difficulty: challenge?.difficulty || 'medium',
      category: challenge?.category || 'progress',
    };
  }
};

export default GamificationService;

export const fetchGamificationStats = async (userId: string): Promise<GamificationStats> => {
  return GamificationService.getUserStats(userId);
};

export const fetchChallenges = async (userId: string): Promise<Challenge[]> => {
  return GamificationService.getUserChallenges(userId);
};

export const fetchUserBadges = async (userId: string): Promise<Badge[]> => {
  return GamificationService.getUserBadges(userId);
};
