
import { useState, useEffect } from 'react';
import { Challenge } from '@/types/challenge';
import { Badge } from '@/types/badge';
import { mockChallenges, mockBadges, mockLeaderboard } from './mockData';

export interface GamificationStats {
  totalPoints: number;
  completedChallenges: number;
  totalChallenges: number;
  earnedBadges: number;
  rank?: number;
  level?: number;
  streakDays?: number;
}

export function useGamificationStats(userId?: string) {
  const [stats, setStats] = useState<GamificationStats>({
    totalPoints: 0,
    completedChallenges: 0,
    totalChallenges: 0,
    earnedBadges: 0,
    rank: 0,
    level: 1,
    streakDays: 0
  });
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Dans une vraie application, ces données viendraient d'une API
        // Pour l'instant, on utilise des données mockées
        setChallenges(mockChallenges);
        setBadges(mockBadges);
        
        // Calcul des statistiques
        const completedCount = mockChallenges.filter(c => c.completed).length;
        const totalPoints = mockChallenges.reduce((sum, c) => {
          return sum + (c.completed ? c.points : 0);
        }, 0);
        
        // Recherche du rang de l'utilisateur
        const userEntry = mockLeaderboard.find(entry => entry.userId === userId);
        
        setStats({
          totalPoints,
          completedChallenges: completedCount,
          totalChallenges: mockChallenges.length,
          earnedBadges: mockBadges.length,
          rank: userEntry?.rank || 0,
          level: Math.floor(totalPoints / 100) + 1,
          streakDays: userEntry?.streak || 0
        });
      } catch (error) {
        console.error('Error fetching gamification data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);
  
  return {
    stats,
    challenges,
    badges,
    leaderboard,
    isLoading
  };
}

export default useGamificationStats;
