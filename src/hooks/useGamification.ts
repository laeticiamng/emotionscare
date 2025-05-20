import { useState, useEffect } from 'react';
import { Badge, Challenge, GamificationStats, LeaderboardEntry } from '@/types/gamification';

interface UseGamificationProps {
  userId: string;
}

interface GamificationHook {
  loading: boolean;
  error: string | null;
  userStats: GamificationStats | null;
  badges: Badge[];
  challenges: Challenge[];
  leaderboardData: LeaderboardEntry[];
  fetchUserStats: () => Promise<void>;
  fetchBadges: () => Promise<void>;
  fetchChallenges: () => Promise<void>;
  fetchLeaderboardData: () => Promise<void>;
}

export const useGamification = ({ userId }: UseGamificationProps): GamificationHook => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<GamificationStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  const fetchUserStats = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const data: GamificationStats = {
        level: 5,
        xp: 750,
        xpToNextLevel: 1000,
        consecutiveLogins: 7,
        totalSessions: 50,
        totalMoodEntries: 120,
        totalMeditationMinutes: 360,
        badges: [],
        achievements: ['Completed 5 days streak', 'Reached level 5'],
        streakDays: 5,
        progressToNextLevel: 0.75,
        points: 1500,
        longestStreak: 10,
        completedChallenges: 8,
        totalChallenges: 15,
        unlockedBadges: 5,
        totalBadges: 10,
      };
      setUserStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchBadges = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const data: Badge[] = [
        {
          id: 'badge-1',
          name: 'Early Bird',
          description: 'Login for 3 consecutive days',
          category: 'Login',
          image: '/images/badges/early-bird.png',
          unlocked: true,
          unlockedAt: '2024-07-15T10:00:00Z',
          earned: true,
          achieved: true,
        },
        {
          id: 'badge-2',
          name: 'Mood Tracker',
          description: 'Record 10 mood entries',
          category: 'Mood Tracking',
          image: '/images/badges/mood-tracker.png',
          unlocked: true,
          unlockedAt: '2024-07-18T14:30:00Z',
          earned: true,
          achieved: true,
        },
        {
          id: 'badge-3',
          name: 'Meditation Master',
          description: 'Meditate for 60 minutes',
          category: 'Meditation',
          image: '/images/badges/meditation-master.png',
          unlocked: false,
          progress: 45,
          threshold: 60,
          earned: false,
          achieved: false,
        },
      ];
      setBadges(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch badges');
    } finally {
      setLoading(false);
    }
  };

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const data: Challenge[] = [
        {
          id: 'challenge-1',
          title: 'Daily Meditation',
          description: 'Meditate for 15 minutes today',
          progress: 10,
          threshold: 15,
          completed: false,
          category: 'Meditation',
          currentValue: 10,
          targetValue: 15,
        },
        {
          id: 'challenge-2',
          title: 'Mood Tracking Streak',
          description: 'Record your mood for the next 7 days',
          progress: 3,
          threshold: 7,
          completed: false,
          category: 'Mood Tracking',
          currentValue: 3,
          targetValue: 7,
        },
        {
          id: 'challenge-3',
          title: 'Reach Level 6',
          description: 'Gain enough XP to reach level 6',
          progress: 750,
          threshold: 1000,
          completed: false,
          category: 'Progression',
          currentValue: 750,
          targetValue: 1000,
        },
      ];
      setChallenges(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch challenges');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const data: LeaderboardEntry[] = [
        {
          id: 'leader-1',
          userId: 'user-1',
          username: 'EcoMindful',
          avatarUrl: '/images/avatars/avatar-1.png',
          score: 2500,
          rank: 1,
          points: 2500,
        },
        {
          id: 'leader-2',
          userId: 'user-2',
          username: 'ZenMaster',
          avatarUrl: '/images/avatars/avatar-2.png',
          score: 2200,
          rank: 2,
          points: 2200,
        },
        {
          id: 'leader-3',
          userId: 'user-3',
          username: 'MindfulManiac',
          avatarUrl: '/images/avatars/avatar-3.png',
          score: 2000,
          rank: 3,
          points: 2000,
        },
      ];

      setLeaderboardData(data.map((item) => ({
        ...item,
        score: item.points || 0, // Map points to score
      })));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
    fetchBadges();
    fetchChallenges();
    fetchLeaderboardData();
  }, [userId]);

  useEffect(() => {
    if (userStats && badges.length > 0) {
      badges.forEach(badge => {
        const requiredXP = parseInt(String(badge.threshold || 0), 10);
        if (userStats.xp >= requiredXP) {
          // Update badge status if user has enough XP
          setBadges(prevBadges =>
            prevBadges.map(b =>
              b.id === badge.id ? { ...b, unlocked: true, earned: true, achieved: true } : b
            )
          );
        }
      });
    }
  }, [userStats, badges]);

  return {
    loading,
    error,
    userStats,
    badges,
    challenges,
    leaderboardData,
    fetchUserStats,
    fetchBadges,
    fetchChallenges,
    fetchLeaderboardData,
  };
};
