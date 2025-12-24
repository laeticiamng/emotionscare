// @ts-nocheck
import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

interface UserStats {
  totalPoints: number;
  level: number;
  rank: string;
  streak: number;
  completedChallenges: number;
  achievements: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  maxProgress: number;
  category: 'daily' | 'weekly' | 'special';
  difficulty: 'facile' | 'moyen' | 'difficile';
  completed: boolean;
  deadline?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const useGamification = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGamificationData = useCallback(async () => {
    setLoading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        // Fetch gamification metrics
        const { data: metricsData } = await supabase
          .from('gamification_metrics')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        // Fetch user achievements
        const { data: userAchievementsData } = await supabase
          .from('user_achievements')
          .select('*, achievements(*)')
          .eq('user_id', authUser.id);

        // Fetch challenges
        const { data: challengesData } = await supabase
          .from('challenges')
          .select('*')
          .or(`user_id.eq.${authUser.id},is_global.eq.true`)
          .order('created_at', { ascending: false });

        // Calculate streak from emotion_scans
        const { data: recentScans } = await supabase
          .from('emotion_scans')
          .select('created_at')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(30);

        let streak = 0;
        if (recentScans && recentScans.length > 0) {
          const uniqueDays = new Set(recentScans.map(s => s.created_at?.split('T')[0]));
          streak = uniqueDays.size;
        }

        if (metricsData) {
          const level = Math.floor((metricsData.total_points || 0) / 500) + 1;
          const ranks = ['Débutant', 'Explorateur', 'Aventurier', 'Expert', 'Maître', 'Légende'];
          setUserStats({
            totalPoints: metricsData.total_points || 0,
            level,
            rank: ranks[Math.min(level - 1, ranks.length - 1)],
            streak,
            completedChallenges: metricsData.challenges_completed || 0,
            achievements: userAchievementsData?.length || 0
          });
        } else {
          setUserStats({
            totalPoints: 0,
            level: 1,
            rank: 'Débutant',
            streak,
            completedChallenges: 0,
            achievements: userAchievementsData?.length || 0
          });
        }

        if (challengesData && challengesData.length > 0) {
          setChallenges(challengesData.map(c => ({
            id: c.id,
            title: c.title || 'Défi',
            description: c.description || '',
            points: c.points || 50,
            progress: c.progress || 0,
            maxProgress: c.max_progress || 1,
            category: c.category || 'daily',
            difficulty: c.difficulty || 'facile',
            completed: c.is_completed || false,
            deadline: c.deadline
          })));
        }

        if (userAchievementsData && userAchievementsData.length > 0) {
          setAchievements(userAchievementsData.map(ua => ({
            id: ua.achievement_id,
            title: ua.achievements?.title || 'Achievement',
            description: ua.achievements?.description || '',
            icon: null,
            points: ua.achievements?.points || 50,
            unlocked: true,
            unlockedAt: ua.unlocked_at,
            rarity: ua.achievements?.rarity || 'common'
          })));
        }
      }
    } catch (error) {
      logger.error('Error loading gamification data', error as Error, 'ANALYTICS');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadGamificationData();
    }
  }, [user, loadGamificationData]);

  const updateChallengeProgress = useCallback(async (challengeId: string, progress: number) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, progress: Math.min(progress, challenge.maxProgress) }
          : challenge
      )
    );
  }, []);

  const claimReward = useCallback(async (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && challenge.progress >= challenge.maxProgress) {
      setChallenges(prev => 
        prev.map(c => 
          c.id === challengeId 
            ? { ...c, completed: true }
            : c
        )
      );

      // Mettre à jour les points
      if (userStats) {
        setUserStats(prev => prev ? {
          ...prev,
          totalPoints: prev.totalPoints + challenge.points,
          completedChallenges: prev.completedChallenges + 1
        } : null);
      }
    }
  }, [challenges, userStats]);

  const unlockAchievement = useCallback(async (achievementId: string) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === achievementId 
          ? { 
              ...achievement, 
              unlocked: true, 
              unlockedAt: new Date().toISOString() 
            }
          : achievement
      )
    );
  }, []);

  return {
    userStats,
    challenges,
    achievements,
    loading,
    updateChallengeProgress,
    claimReward,
    unlockAchievement,
    refreshData: loadGamificationData
  };
};
