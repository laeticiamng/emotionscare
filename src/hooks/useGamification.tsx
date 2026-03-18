// @ts-nocheck

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge, Challenge, GamificationStats, UseGamificationReturn } from '@/types';

export function useGamification(): UseGamificationReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch badges from Supabase
  const {
    data: badges = [],
    isLoading: isLoadingBadges,
    error: badgesError,
  } = useQuery({
    queryKey: ['gamification-badges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((item) => ({
        id: item.id,
        name: item.name || item.achievement_type || '',
        description: item.description || '',
        category: item.category || 'general',
        image: item.image_url || item.icon || '',
        imageUrl: item.image_url || item.icon || '',
        unlocked: true,
        unlockedAt: item.unlocked_at || item.created_at,
        user_id: item.user_id,
        level: item.level || 'bronze',
      })) as Badge[];
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch challenges from Supabase (using user_achievements or a challenges table)
  const {
    data: challenges = [],
    isLoading: isLoadingChallenges,
    error: challengesError,
  } = useQuery({
    queryKey: ['gamification-challenges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Try fetching from challenges table; fall back gracefully
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .order('created_at', { ascending: false });

      if (error) {
        // If the table doesn't exist, return empty
        console.warn('Could not fetch challenges:', error.message);
        return [];
      }

      return (data || []).map((item) => ({
        id: item.id,
        name: item.name || item.title || '',
        title: item.title || item.name || '',
        description: item.description || '',
        points: item.points || 0,
        type: item.type || 'daily',
        category: item.category || 'general',
        progress: item.progress || item.current_value || 0,
        total: item.total || item.target_value || 1,
        targetValue: item.target_value || item.total || 1,
        currentValue: item.current_value || item.progress || 0,
        status: item.status || (item.completed ? 'completed' : 'in-progress'),
        completed: item.completed || item.status === 'completed',
        difficulty: item.difficulty || 'easy',
        icon: item.icon || 'activity',
      })) as Challenge[];
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch points and stats from Supabase
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ['gamification-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Fetch points
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (pointsError) {
        console.warn('Could not fetch user_points:', pointsError.message);
      }

      // Fetch streak
      const { data: streakData, error: streakError } = await supabase
        .from('activity_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (streakError) {
        console.warn('Could not fetch activity_streaks:', streakError.message);
      }

      // Count achievements
      const { count: achievementCount } = await supabase
        .from('user_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const totalPoints = pointsData?.total_points || pointsData?.points || 0;
      const currentLevel = pointsData?.level || Math.floor(totalPoints / 100) + 1;
      const nextLevelPoints = currentLevel * 100;
      const pointsToNextLevel = Math.max(0, nextLevelPoints - totalPoints);
      const progressToNextLevel = nextLevelPoints > 0
        ? Math.round((totalPoints % 100) / 100 * 100)
        : 0;
      const streakDays = streakData?.current_streak || streakData?.streak_days || 0;
      const completedChallenges = challenges.filter((c) => c.completed || c.status === 'completed').length;

      return {
        points: totalPoints,
        totalPoints,
        level: currentLevel,
        currentLevel,
        xp: totalPoints,
        xpToNextLevel: pointsToNextLevel,
        nextLevel: currentLevel + 1,
        nextLevelPoints,
        pointsToNextLevel,
        progressToNextLevel,
        badges,
        badgesCount: achievementCount || badges.length,
        challenges,
        completedChallenges,
        totalChallenges: challenges.length,
        activeChallenges: challenges.filter((c) => c.status === 'in-progress').length,
        streak: streakDays,
        streakDays,
        consecutiveLogins: streakDays,
        totalSessions: pointsData?.total_sessions || 0,
        totalMoodEntries: pointsData?.total_mood_entries || 0,
        totalMeditationMinutes: pointsData?.total_meditation_minutes || 0,
        achievements: badges.map((b) => b.name),
        rank: pointsData?.rank || 'Explorer',
        lastActivityDate: streakData?.last_activity_date || pointsData?.updated_at || new Date().toISOString(),
      } as GamificationStats;
    },
    enabled: !!user?.id && !isLoadingBadges && !isLoadingChallenges,
    staleTime: 2 * 60 * 1000,
  });

  const isLoading = isLoadingBadges || isLoadingChallenges || isLoadingStats;
  const error = badgesError?.message || challengesError?.message || statsError?.message || null;

  // Default stats when data hasn't loaded yet
  const defaultStats: GamificationStats = {
    points: 0,
    totalPoints: 0,
    level: 1,
    currentLevel: 1,
    xp: 0,
    xpToNextLevel: 100,
    nextLevel: 2,
    nextLevelPoints: 100,
    pointsToNextLevel: 100,
    progressToNextLevel: 0,
    badges: [],
    badgesCount: 0,
    challenges: [],
    completedChallenges: 0,
    totalChallenges: 0,
    activeChallenges: 0,
    streak: 0,
    streakDays: 0,
    consecutiveLogins: 0,
    totalSessions: 0,
    totalMoodEntries: 0,
    totalMeditationMinutes: 0,
    achievements: [],
    rank: 'Explorer',
    lastActivityDate: new Date().toISOString(),
  };

  // Complete a challenge via Supabase
  const completeChallenge = async (challengeId: string): Promise<boolean> => {
    try {
      if (!user?.id) return false;

      const { error } = await supabase
        .from('challenges')
        .update({
          status: 'completed',
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', challengeId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error completing challenge:', error.message);
        return false;
      }

      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ['gamification-challenges', user.id] });
      queryClient.invalidateQueries({ queryKey: ['gamification-stats', user.id] });
      return true;
    } catch (err) {
      console.error('Error completing challenge:', err);
      return false;
    }
  };

  const refresh = () => {
    if (!user?.id) return;
    queryClient.invalidateQueries({ queryKey: ['gamification-badges', user.id] });
    queryClient.invalidateQueries({ queryKey: ['gamification-challenges', user.id] });
    queryClient.invalidateQueries({ queryKey: ['gamification-stats', user.id] });
  };

  return {
    badges,
    challenges,
    stats: stats || defaultStats,
    completeChallenge,
    isLoading,
    error,
    refresh,
  };
}

export default useGamification;
