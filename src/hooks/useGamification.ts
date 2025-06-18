
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GamificationService } from '@/services/gamificationService';
import { UserPoints, UserBadge, Achievement, Streak } from '@/types/gamification';

export const useGamification = () => {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGamificationData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [points, badges] = await Promise.all([
        GamificationService.getUserPoints(user.id),
        GamificationService.getUserBadges(user.id),
      ]);
      
      setUserPoints(points);
      setUserBadges(badges);
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPoints = async (points: number, reason: string) => {
    if (!user) return false;
    
    const success = await GamificationService.addPoints(user.id, points, reason);
    if (success) {
      await fetchGamificationData();
    }
    return success;
  };

  const updateStreak = async (activityType: string) => {
    if (!user) return null;
    
    return await GamificationService.updateStreak(user.id, activityType);
  };

  const checkNewBadges = async () => {
    if (!user) return [];
    
    const newBadges = await GamificationService.checkAndAwardBadges(user.id);
    if (newBadges.length > 0) {
      await fetchGamificationData();
    }
    return newBadges;
  };

  useEffect(() => {
    fetchGamificationData();
  }, [user]);

  return {
    userPoints,
    userBadges,
    recentAchievements,
    streaks,
    loading,
    addPoints,
    updateStreak,
    checkNewBadges,
    refreshData: fetchGamificationData
  };
};
