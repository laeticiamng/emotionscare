
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchGamificationStats } from '@/lib/gamificationService';
import { Badge, Challenge, GamificationStats } from '@/types/gamification';
import { UseCommunityGamificationResult } from './community-gamification/types';

export function useCommunityGamification(): UseCommunityGamificationResult {
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
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const fetchStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGamificationStats(user.id);
      setStats(data);
    } catch (err) {
      setError('Failed to fetch gamification data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const claimBadge = async (badgeId: string) => {
    // Implementation for claiming badges
    console.log('Claiming badge:', badgeId);
  };
  
  useEffect(() => {
    fetchStats();
  }, [user]);
  
  return {
    stats,
    badges: stats.badges || [],
    challenges: stats.challenges || [],
    badges_count: stats.badges?.length || 0,
    completed_challenges: stats.completedChallenges || 0,
    loading,
    error,
    refresh: fetchStats,
    claimBadge
  };
}

export default useCommunityGamification;
