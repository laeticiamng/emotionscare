
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchGamificationStats } from '@/lib/gamificationService';
import { GamificationStats } from './types';

export const useGamificationStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<GamificationStats>({
    points: 0,
    level: 1,
    rank: 'Débutant',
    badges: [],
    streak: 0,
    nextLevelPoints: 100,
    progress: 0,
    recentAchievements: []
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchStats = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchGamificationStats(user.id);
      
      // Adapter les données du serveur à notre format local
      setStats({
        points: data.points,
        level: data.level,
        rank: data.rank,
        badges: data.badges || [],
        streak: data.streak,
        nextLevelPoints: data.pointsToNextLevel,
        progress: (data.progressToNextLevel / data.pointsToNextLevel) * 100,
        recentAchievements: data.recentAchievements || []
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération des statistiques";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStats();
  }, [user]);
  
  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

export default useGamificationStats;
