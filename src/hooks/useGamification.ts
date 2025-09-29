
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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
  icon: React.ReactNode;
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

  useEffect(() => {
    if (user) {
      loadGamificationData();
    }
  }, [user]);

  const loadGamificationData = async () => {
    setLoading(true);
    try {
      // Simuler le chargement des données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setUserStats({
        totalPoints: 1250,
        level: 8,
        rank: 'Explorateur Émotionnel',
        streak: 5,
        completedChallenges: 23,
        achievements: 12
      });

      setChallenges([
        {
          id: '1',
          title: 'Scanner quotidien',
          description: 'Effectuez un scan émotionnel aujourd\'hui',
          points: 50,
          progress: 0,
          maxProgress: 1,
          category: 'daily',
          difficulty: 'facile',
          completed: false
        },
        {
          id: '2',
          title: 'Méditation guidée',
          description: 'Complétez 3 sessions de méditation cette semaine',
          points: 150,
          progress: 1,
          maxProgress: 3,
          category: 'weekly',
          difficulty: 'moyen',
          completed: false,
          deadline: '2025-06-29'
        }
      ]);

      setAchievements([
        {
          id: '1',
          title: 'Premier Pas',
          description: 'Première connexion à l\'application',
          icon: null,
          points: 50,
          unlocked: true,
          unlockedAt: '2025-06-20',
          rarity: 'common'
        }
      ]);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateChallengeProgress = async (challengeId: string, progress: number) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, progress: Math.min(progress, challenge.maxProgress) }
          : challenge
      )
    );
  };

  const claimReward = async (challengeId: string) => {
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
  };

  const unlockAchievement = async (achievementId: string) => {
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
  };

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
