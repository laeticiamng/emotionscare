
import { useState, useEffect } from 'react';
import { UserPoints, UserBadge, Achievement, Streak } from '@/types/gamification';
import { gamificationService } from '@/services/gamificationService';

export const useGamification = () => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [pointsData, badgesData, achievementsData, streaksData] = await Promise.all([
        gamificationService.getUserPoints(),
        gamificationService.getUserBadges(),
        gamificationService.getUserAchievements(),
        gamificationService.getUserStreaks()
      ]);

      setUserPoints(pointsData);
      setUserBadges(badgesData);
      setAchievements(achievementsData);
      setStreaks(streaksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      console.error('Erreur gamification:', err);
    } finally {
      setLoading(false);
    }
  };

  const awardPoints = async (points: number, reason: string) => {
    try {
      const result = await gamificationService.awardPoints(points, reason);
      setUserPoints(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'attribution des points');
      throw err;
    }
  };

  const checkAchievements = async () => {
    try {
      const newAchievements = await gamificationService.checkAndAwardAchievements();
      if (newAchievements.length > 0) {
        setAchievements(prev => [...prev, ...newAchievements]);
        await loadGamificationData(); // Refresh all data
      }
      return newAchievements;
    } catch (err) {
      console.error('Erreur lors de la vérification des succès:', err);
      return [];
    }
  };

  const updateStreak = async (activityType: string) => {
    try {
      const updatedStreak = await gamificationService.updateStreak(activityType);
      setStreaks(prev => prev.map(s => 
        s.activity_type === activityType ? updatedStreak : s
      ));
      return updatedStreak;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la série:', err);
      throw err;
    }
  };

  return {
    userPoints,
    userBadges,
    achievements,
    streaks,
    loading,
    error,
    awardPoints,
    checkAchievements,
    updateStreak,
    refreshData: loadGamificationData
  };
};
