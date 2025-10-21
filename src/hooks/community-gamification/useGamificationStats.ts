// @ts-nocheck

// @ts-nocheck
import { useState, useEffect } from 'react';
import { Badge, Challenge } from '@/types/badge';
import { mockBadges, mockChallenges } from './mockData';
import { logger } from '@/lib/logger';

export interface GamificationStats {
  totalPoints: number;
  level: number;
  streakDays: number;
  nextLevelPoints: number;
  completedChallenges: number;
  totalChallenges: number;
  unlockedBadges: number;
  totalBadges: number;
  percentageToNextLevel: number;
}

export const useGamificationStats = (userId?: string) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<GamificationStats>({
    totalPoints: 0,
    level: 1,
    streakDays: 0,
    nextLevelPoints: 100,
    completedChallenges: 0,
    totalChallenges: 0,
    unlockedBadges: 0,
    totalBadges: 0,
    percentageToNextLevel: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be API calls
        // For now, we'll use the mock data
        const fetchedBadges = [...mockBadges];
        const fetchedChallenges = [...mockChallenges];
        
        setBadges(fetchedBadges);
        setChallenges(fetchedChallenges);
        
        // Calculate stats
        const totalPoints = fetchedChallenges.reduce((sum, challenge) => {
          return sum + (challenge.status === 'completed' ? challenge.points : 0);
        }, 0);
        
        const level = Math.floor(totalPoints / 100) + 1;
        const nextLevelPoints = level * 100;
        const percentageToNextLevel = ((totalPoints % 100) / 100) * 100;
        
        const completedChallenges = fetchedChallenges.filter(c => c.status === 'completed').length;
        const unlockedBadges = fetchedBadges.filter(b => b.unlocked).length;
        
        setStats({
          totalPoints,
          level,
          streakDays: 7, // Mock streak data
          nextLevelPoints,
          completedChallenges,
          totalChallenges: fetchedChallenges.length,
          unlockedBadges,
          totalBadges: fetchedBadges.length,
          percentageToNextLevel,
        });
        
      } catch (error) {
        logger.error('Error fetching gamification data', error as Error, 'UI');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);

  // Function to complete a challenge
  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, status: 'completed' as const } 
          : challenge
      )
    );
  };

  // Function to unlock a badge
  const unlockBadge = (badgeId: string) => {
    setBadges(prev => 
      prev.map(badge => 
        badge.id === badgeId 
          ? { ...badge, unlocked: true } 
          : badge
      )
    );
  };

  return {
    badges,
    challenges,
    stats,
    loading,
    completeChallenge,
    unlockBadge
  };
};

export default useGamificationStats;
