
import { useState, useEffect } from 'react';
import { Badge, Challenge, GamificationStats, LeaderboardEntry } from '@/types';
import mockData from './community-gamification/mockData';

const { mockLeaderboard, mockBadges, mockChallenges } = mockData;

interface UseCommunityGamificationReturn {
  stats: GamificationStats;
  badges: Badge[];
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
}

export const useCommunityGamification = (): UseCommunityGamificationReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock initial stats
  const [stats, setStats] = useState<GamificationStats>({
    points: 850,
    level: 3,
    badges: mockBadges,
    streak: 5,
    rank: '42',
    nextLevelPoints: 150,
    progressToNextLevel: 70,
    completedChallenges: 4,
    totalChallenges: 10,
    activeChallenges: 3,
    recentAchievements: mockBadges.slice(0, 1),
    challenges: mockChallenges
  });
  
  // Load data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));
        
        // Data already loaded in initial state, no need to update
      } catch (err) {
        setError('Failed to load gamification data');
        console.error('Error loading gamification data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return {
    stats,
    badges: mockBadges,
    challenges: mockChallenges,
    leaderboard: mockLeaderboard,
    isLoading,
    error
  };
};

export default useCommunityGamification;
