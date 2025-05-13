
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge, Challenge, GamificationStats, LeaderboardEntry } from '@/types/gamification';
import { getBadges } from '@/lib/gamification/badge-service';
import { getChallenges, updateChallenge } from '@/lib/gamification/challenge-service';
import { getGamificationStats } from '@/lib/gamification/stats-service';

export const useGamification = () => {
  const { user } = useAuth();
  const userId = user?.id;
  
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<GamificationStats>({
    points: 0,
    level: 1,
    nextLevelPoints: 100,
    badges: [],
    completedChallenges: 0,
    activeChallenges: 0,
    streakDays: 0,
    progressToNextLevel: 0,
    challenges: [],
    recentAchievements: []
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const loadGamificationData = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const [badgesData, challengesData, statsData] = await Promise.all([
        getBadges(userId),
        getChallenges(userId),
        getGamificationStats(userId)
      ]);
      
      setBadges(badgesData);
      setChallenges(challengesData);
      setStats(statsData);
      
      // Simulate leaderboard data
      setLeaderboard([
        {
          userId: '1',
          name: 'User 1',
          avatarUrl: '/avatars/user1.jpg',
          points: 1200,
          level: 5,
          position: 1,
          badges: 8,
          completedChallenges: 12
        },
        {
          userId: '2',
          name: 'User 2',
          avatarUrl: '/avatars/user2.jpg',
          points: 950,
          level: 4,
          position: 2,
          badges: 6,
          completedChallenges: 9
        }
      ]);
    } catch (err) {
      console.error('Error loading gamification data:', err);
      setError('Failed to load gamification data');
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    if (userId) {
      loadGamificationData();
    }
  }, [userId]);
  
  // Complete a challenge
  const completeChallenge = async (challengeId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      // Update challenge status to completed
      const success = await updateChallenge(challengeId, { status: 'completed' });
      
      if (success) {
        // Update local state
        setChallenges(prev => 
          prev.map(c => 
            c.id === challengeId 
              ? { ...c, status: 'completed' } 
              : c
          )
        );
        
        // Reload gamification data to get updated stats
        await loadGamificationData();
      }
      
      return success;
    } catch (err) {
      console.error('Error completing challenge:', err);
      return false;
    }
  };
  
  // Update challenge progress
  const updateChallengeProgress = async (challengeId: string, progress: number): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      // Update challenge progress
      const success = await updateChallenge(challengeId, { progress });
      
      if (success) {
        // Update local state
        setChallenges(prev => 
          prev.map(c => 
            c.id === challengeId 
              ? { ...c, progress } 
              : c
          )
        );
      }
      
      return success;
    } catch (err) {
      console.error('Error updating challenge progress:', err);
      return false;
    }
  };
  
  return {
    badges,
    challenges,
    stats,
    leaderboard,
    loading,
    error,
    completeChallenge,
    updateChallengeProgress,
    loadGamificationData,
    isLoading: loading
  };
};
