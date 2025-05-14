
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchGamificationStats, fetchChallenges } from '@/lib/gamificationService';
import type { GamificationStats, Challenge } from '@/types/gamification';
import type { Badge } from '@/types';

interface UseCommunityGamificationResult {
  stats: GamificationStats;
  badges: Badge[];
  challenges: Challenge[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useCommunityGamification = (): UseCommunityGamificationResult => {
  const { user } = useAuth();
  const [stats, setStats] = useState<GamificationStats>({
    points: 0,
    level: 1,
    rank: '',
    badges: [], 
    challenges: [],
    streak: 0,
    nextLevel: { points: 100, rewards: [] },
    achievements: [],
    currentLevel: 1,
    pointsToNextLevel: 100,
    progressToNextLevel: 0,
    totalPoints: 0,
    badgesCount: 0,
    streakDays: 0,
    activeChallenges: 0,
    completedChallenges: 0,
    lastActivityDate: new Date().toISOString()
  });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch stats
      const statsData = await fetchGamificationStats(user.id);
      setStats({
        ...statsData,
        badgesCount: statsData.badgesCount || stats.badgesCount,
        streakDays: statsData.streakDays || stats.streakDays
      });
      
      // Fetch challenges
      const challengesData = await fetchChallenges(user.id);
      setChallenges(challengesData);
      
      // Mock badges data
      setBadges([
        {
          id: '1',
          name: 'Premier scan',
          description: 'Félicitations pour votre premier scan émotionnel !',
          image_url: '/badges/first-scan.png',
          type: 'achievement'
        },
        {
          id: '2',
          name: 'Série de 3 jours',
          description: 'Vous avez utilisé l\'application 3 jours de suite',
          image_url: '/badges/streak-3.png',
          type: 'streak'
        }
      ]);
    } catch (err) {
      console.error('Error fetching gamification data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch gamification data'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [user?.id]);
  
  return {
    stats,
    badges,
    challenges,
    loading,
    error,
    refetch: fetchData
  };
};

export default useCommunityGamification;
