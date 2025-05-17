
import { useState, useEffect } from 'react';
import { Badge, Challenge, LeaderboardEntry } from '@/types/gamification';

export interface GamificationStats {
  points: number;
  level: number;
  rank: string | number;
  streak: number;
  nextLevelPoints: number;
  progress: number;
  badges: Badge[];
  challenges: Challenge[];
  completedChallenges: number;
  totalChallenges: number;
  activeChallenges?: Challenge[];
  totalPoints?: number;
  unlockedBadges?: number;
  totalBadges?: number;
  xp?: number;
  xpToNextLevel?: number;
}

export const useGamification = () => {
  const [stats, setStats] = useState<GamificationStats>({
    points: 120,
    level: 3,
    rank: 42,
    streak: 4,
    nextLevelPoints: 200,
    progress: 0.6,
    badges: [],
    challenges: [],
    completedChallenges: 4,
    totalChallenges: 10,
    totalPoints: 500,
    activeChallenges: []
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize with some mock data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock badges
      const badges: Badge[] = [
        {
          id: 'badge1',
          name: 'Premier scan',
          description: 'Effectuez votre premier scan émotionnel',
          imageUrl: '/badges/first-scan.svg',
          category: 'debutant',
          tier: 'bronze',
          earned: true,
          threshold: 1,
          progress: 1,
          completed: true
        },
        {
          id: 'badge2',
          name: 'Apprenti méditatif',
          description: 'Complétez 5 sessions de méditation',
          imageUrl: '/badges/meditation-apprentice.svg',
          category: 'meditation',
          tier: 'silver',
          earned: false,
          threshold: 5,
          progress: 2,
          completed: false
        },
        {
          id: 'badge3',
          name: 'Maître de l\'équilibre',
          description: 'Maintenez un équilibre émotionnel pendant 7 jours',
          imageUrl: '/badges/balance-master.svg',
          category: 'maitrise',
          tier: 'gold',
          earned: false,
          threshold: 7,
          progress: 3,
          completed: false
        }
      ];
      
      // Mock challenges
      const challenges: Challenge[] = [
        {
          id: 'challenge1',
          title: 'Méditation quotidienne',
          description: 'Faites une méditation tous les jours pendant une semaine',
          points: 50,
          progress: 4,
          completed: false,
          totalSteps: 7,
          difficulty: 'medium',
          deadline: '2025-06-01'
        },
        {
          id: 'challenge2',
          title: 'Journal des émotions',
          description: 'Enregistrez vos émotions 3 jours de suite',
          points: 30,
          progress: 2,
          completed: false,
          totalSteps: 3,
          difficulty: 'easy',
          deadline: '2025-05-25'
        },
        {
          id: 'challenge3',
          title: 'Partage social',
          description: 'Partagez votre progression avec la communauté',
          points: 20,
          progress: 1,
          completed: true,
          totalSteps: 1,
          difficulty: 'easy'
        }
      ];
      
      // Mock leaderboard
      const mockLeaderboard: LeaderboardEntry[] = [
        { id: 'user1', name: 'Emma L.', points: 450, rank: 1, trend: 'up', avatar: '/avatars/user1.jpg' },
        { id: 'user2', name: 'Thomas R.', points: 425, rank: 2, trend: 'stable', avatar: '/avatars/user2.jpg' },
        { id: 'user3', name: 'Sophie M.', points: 410, rank: 3, trend: 'up', avatar: '/avatars/user3.jpg' },
        { id: 'current', name: 'Vous', points: 120, rank: 42, trend: 'down', avatar: '/avatars/current-user.jpg' }
      ];
      
      setStats(prev => ({
        ...prev,
        badges,
        challenges,
        activeChallenges: challenges.filter(c => !c.completed),
        progress: 0.6, // 60% progress to next level
        completedChallenges: challenges.filter(c => c.completed).length,
        totalChallenges: challenges.length
      }));
      
      setLeaderboard(mockLeaderboard);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Function to earn points
  const earnPoints = (points: number, reason?: string) => {
    setStats(prev => {
      const newPoints = prev.points + points;
      const newLevel = Math.floor(newPoints / 100) + 1; // Simple level calculation
      const nextLevelPoints = newLevel * 100;
      const progress = (newPoints % 100) / 100;
      
      console.log(`Points earned: ${points}. Reason: ${reason || 'Not specified'}`);
      
      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        nextLevelPoints,
        progress,
      };
    });
  };
  
  // Function to complete a challenge
  const completeChallenge = (challengeId: string) => {
    setStats(prev => {
      const updatedChallenges = prev.challenges.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, completed: true, progress: challenge.totalSteps || 1 } 
          : challenge
      );
      
      const completedChallenge = prev.challenges.find(c => c.id === challengeId);
      if (completedChallenge && !completedChallenge.completed) {
        earnPoints(completedChallenge.points || 0, `Challenge completed: ${completedChallenge.title}`);
      }
      
      return {
        ...prev,
        challenges: updatedChallenges,
        completedChallenges: updatedChallenges.filter(c => c.completed).length,
        activeChallenges: updatedChallenges.filter(c => !c.completed)
      };
    });
  };
  
  // Function to earn a badge
  const earnBadge = (badgeId: string) => {
    setStats(prev => {
      const updatedBadges = prev.badges.map(badge => 
        badge.id === badgeId 
          ? { ...badge, earned: true, earnedAt: new Date().toISOString() } 
          : badge
      );
      
      return {
        ...prev,
        badges: updatedBadges,
        unlockedBadges: updatedBadges.filter(b => b.earned).length,
      };
    });
  };
  
  // Function to refresh stats
  const refreshStats = () => {
    setIsLoading(true);
    // In a real app, this would call the API
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  return {
    stats,
    leaderboard,
    earnPoints,
    completeChallenge,
    earnBadge,
    refreshStats,
    isLoading,
    error
  };
};

export default useGamification;
