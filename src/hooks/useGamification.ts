
import { useState, useEffect } from 'react';
import { Badge, Challenge, LeaderboardEntry, GamificationStats } from '@/types/gamification';
import { getBadges, unlockBadge } from '@/lib/gamification/badge-service';
import { getChallenges, updateChallenge } from '@/lib/gamification/challenge-service';
import { getLeaderboard } from '@/lib/gamification/leaderboard-service';
import { getUserPoints, addPoints } from '@/lib/gamification/points-service';
import { getGamificationStats } from '@/lib/gamification/stats-service';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface GamificationReward {
  id: string;
  name: string;
  description: string;
  type: 'badge' | 'points' | 'level' | 'item';
  imageUrl?: string;
  value?: number;
}

export function useGamification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<GamificationStats>({
    totalPoints: 0,
    currentLevel: 1,
    badgesCount: 0,
    completedChallenges: 0,
    activeChallenges: 0,
    pointsToNextLevel: 100,
    progressToNextLevel: 0,
    streakDays: 0,
    lastActivityDate: null
  });
  const [rewards, setRewards] = useState<GamificationReward[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadGamificationData();
    }
  }, [user?.id]);

  const loadGamificationData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Charger les badges
      const userBadges = await getBadges(user.id);
      setBadges(userBadges);
      
      // Charger les défis
      const userChallenges = await getChallenges(user.id);
      setChallenges(userChallenges);
      
      // Charger les points
      const points = await getUserPoints(user.id);
      setUserPoints(points);
      
      // Charger le classement
      const userLeaderboard = await getLeaderboard();
      setLeaderboard(userLeaderboard);
      
      // Charger les statistiques
      const userStats = await getGamificationStats(user.id);
      setStats(userStats);
      
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des données de gamification:", err);
      setError("Impossible de charger les données de gamification.");
    } finally {
      setIsLoading(false);
    }
  };

  const claimReward = async (rewardId: string, rewardType: 'badge' | 'challenge' | 'points') => {
    if (!user?.id) return false;
    
    try {
      switch (rewardType) {
        case 'badge':
          await unlockBadge(user.id, rewardId);
          toast({
            title: "Badge débloqué!",
            description: "Félicitations! Vous avez débloqué un nouveau badge."
          });
          break;
        case 'challenge':
          await updateChallenge(rewardId, { status: 'completed' });
          toast({
            title: "Défi complété!",
            description: "Félicitations! Vous avez terminé un défi."
          });
          break;
        case 'points':
          await addPoints(user.id, parseInt(rewardId, 10));
          toast({
            title: "Points gagnés!",
            description: `Vous avez gagné ${rewardId} points.`
          });
          break;
      }
      
      // Recharger les données
      await loadGamificationData();
      return true;
    } catch (err) {
      console.error("Erreur lors de la réclamation de la récompense:", err);
      toast({
        title: "Erreur",
        description: "Impossible de réclamer cette récompense.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    badges,
    challenges,
    stats,
    userPoints,
    leaderboard,
    error,
    isLoading,
    claimReward,
    rewards,
    loadGamificationData
  };
}
