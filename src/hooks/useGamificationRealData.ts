// @ts-nocheck

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface GamificationStats {
  totalPoints: number;
  level: number;
  badgesEarned: number;
  challengesCompleted: number;
  currentStreak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  rarity: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  goal: number;
  points: number;
  status: 'active' | 'completed' | 'locked';
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  rank: number;
  avatar?: string;
}

export function useGamificationRealData() {
  const { user } = useAuth();
  const [stats, setStats] = useState<GamificationStats>({
    totalPoints: 0,
    level: 1,
    badgesEarned: 0,
    challengesCompleted: 0,
    currentStreak: 0,
  });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchGamificationData = async () => {
      setIsLoading(true);
      try {
        // Fetch user stats from user_stats table
        const { data: userStats } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Fetch user achievements/badges
        const { data: userAchievements } = await supabase
          .from('user_achievements')
          .select(`
            *,
            achievements (
              id,
              name,
              description,
              icon,
              rarity,
              category
            )
          `)
          .eq('user_id', user.id);

        // Fetch all available achievements for comparison
        const { data: allAchievements } = await supabase
          .from('achievements')
          .select('*')
          .limit(20);

        // Fetch weekly challenges
        const { data: weeklyChallenges } = await supabase
          .from('weekly_challenges')
          .select('*')
          .gte('end_date', new Date().toISOString())
          .order('start_date', { ascending: true })
          .limit(5);

        // Fetch user challenge progress
        const { data: challengeProgress } = await supabase
          .from('user_challenge_progress')
          .select('*')
          .eq('user_id', user.id);

        // Fetch activity streaks
        const { data: streakData } = await supabase
          .from('activity_streaks')
          .select('current_streak, longest_streak')
          .eq('user_id', user.id)
          .single();

        // Build leaderboard from user_stats
        const { data: leaderboardData } = await supabase
          .from('user_stats')
          .select('user_id, total_xp, current_level')
          .order('total_xp', { ascending: false })
          .limit(10);

        // Calculate stats
        const earnedBadges = userAchievements?.length || 0;
        const completedChallenges = challengeProgress?.filter(cp => cp.completed)?.length || 0;
        const totalPoints = userStats?.total_xp || 0;
        const level = userStats?.current_level || Math.floor(totalPoints / 100) + 1;
        const currentStreak = streakData?.current_streak || 0;

        setStats({
          totalPoints,
          level,
          badgesEarned: earnedBadges,
          challengesCompleted: completedChallenges,
          currentStreak,
        });

        // Map badges
        const earnedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);
        const mappedBadges: Badge[] = (allAchievements || []).map(ach => ({
          id: ach.id,
          name: ach.name,
          description: ach.description,
          icon: ach.icon || '🏅',
          earned: earnedIds.has(ach.id),
          earnedAt: userAchievements?.find(ua => ua.achievement_id === ach.id)?.unlocked_at,
          rarity: ach.rarity || 'common',
        }));
        setBadges(mappedBadges);

        // Map challenges with progress
        const progressMap = new Map(
          (challengeProgress || []).map(cp => [cp.challenge_id, cp])
        );
        const mappedChallenges: Challenge[] = (weeklyChallenges || []).map(ch => {
          const prog = progressMap.get(ch.id);
          const currentProgress = prog?.current_progress || 0;
          const goal = ch.target_value || 100;
          return {
            id: ch.id,
            title: ch.title,
            description: ch.description || '',
            progress: Math.round((currentProgress / goal) * 100),
            goal,
            points: ch.xp_reward || 50,
            status: prog?.completed ? 'completed' : (currentProgress > 0 ? 'active' : 'locked'),
          };
        });
        setChallenges(mappedChallenges);

        // Map leaderboard
        const mappedLeaderboard: LeaderboardEntry[] = (leaderboardData || []).map((entry, index) => ({
          id: entry.user_id,
          username: `Utilisateur ${index + 1}`,
          score: entry.total_xp || 0,
          rank: index + 1,
        }));
        setLeaderboard(mappedLeaderboard);

      } catch (error) {
        logger.error('Error fetching gamification data:', error, 'SYSTEM');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGamificationData();
  }, [user?.id]);

  return {
    stats,
    badges,
    challenges,
    leaderboard,
    isLoading,
  };
}
