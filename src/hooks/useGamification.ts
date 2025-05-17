
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge, Challenge } from '@/types/badge';
import { LeaderboardEntry } from '@/types/dashboard';

interface GamificationData {
  badges: Badge[];
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  userPoints: number;
  userRank: number;
  nextLevel: number;
  currentLevel: number;
}

const useGamification = () => {
  const { user } = useAuth();
  const [gamificationData, setGamificationData] = useState<GamificationData>({
    badges: [],
    challenges: [],
    leaderboard: [],
    userPoints: 0,
    userRank: 0,
    nextLevel: 1,
    currentLevel: 0
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Simuler le chargement des données de gamification
  const fetchGamificationData = useCallback(async () => {
    setLoading(true);
    // Dans un cas réel, cela ferait une requête API
    setTimeout(() => {
      const mockBadges: Badge[] = [
        {
          id: "1",
          name: "Premier Pas",
          description: "Compléter le profil utilisateur",
          imageUrl: "/badges/profile-completed.png",
          category: "onboarding",
          tier: "bronze",
          earned: true,
          threshold: 1,
          progress: 1,
          completed: true,
          level: 1,
          unlocked: true,
          icon: "user"
        },
        {
          id: "2",
          name: "Journaliste Émotionnel",
          description: "Écrire 5 entrées dans le journal",
          imageUrl: "/badges/journal-entries.png",
          category: "journal",
          tier: "silver",
          earned: false,
          threshold: 5,
          progress: 2,
          completed: false,
          level: 2,
          unlocked: false,
          icon: "book"
        },
        {
          id: "3",
          name: "Explorateur Musical",
          description: "Écouter 10 playlists différentes",
          imageUrl: "/badges/music-explorer.png",
          category: "music",
          tier: "gold",
          earned: false,
          threshold: 10,
          progress: 3,
          completed: false,
          level: 3,
          unlocked: false,
          icon: "music"
        }
      ];

      const mockChallenges: Challenge[] = [
        {
          id: "1",
          title: "21 jours de journal",
          description: "Écrivez dans votre journal pendant 21 jours consécutifs",
          points: 500,
          progress: 5,
          goal: 21,
          completed: false,
          totalSteps: 21,
          difficulty: "Medium",
          deadline: "2023-12-31",
          status: "en cours",
          category: "journal"
        },
        {
          id: "2",
          title: "Explorer toutes les fonctionnalités",
          description: "Essayez chaque fonctionnalité de l'application",
          points: 300,
          progress: 3,
          goal: 8,
          completed: false,
          totalSteps: 8,
          difficulty: "Easy",
          deadline: "2023-11-15",
          status: "en cours",
          category: "onboarding"
        },
        {
          id: "3",
          title: "Partager avec un ami",
          description: "Invitez un ami à rejoindre la communauté",
          points: 200,
          progress: 1,
          goal: 1,
          completed: true,
          totalSteps: 1,
          difficulty: "Easy",
          status: "terminé",
          category: "social"
        }
      ];

      const randomUserPoints = Math.floor(Math.random() * 2000);
      
      // Classement aléatoire basé sur les points
      const mockLeaderboard: LeaderboardEntry[] = [
        { id: "1", userId: "user1", name: "Sophie M.", rank: 1, points: randomUserPoints + 500, trend: "up" },
        { id: "2", userId: "user2", name: "Thomas L.", rank: 2, points: randomUserPoints + 300, trend: "neutral" },
        { id: "3", userId: "user3", name: "Emma K.", rank: 3, points: randomUserPoints + 100, trend: "down" },
        { id: "4", userId: "currentUser", name: "Vous", rank: 4, points: randomUserPoints, trend: "up" }
      ];

      setGamificationData({
        badges: mockBadges,
        challenges: mockChallenges,
        leaderboard: mockLeaderboard,
        userPoints: randomUserPoints,
        userRank: 4,
        nextLevel: Math.floor(randomUserPoints / 1000) + 1,
        currentLevel: Math.floor(randomUserPoints / 1000)
      });
      
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (user) {
      fetchGamificationData();
    }
  }, [user, fetchGamificationData]);

  // Fonction pour gagner des points
  const earnPoints = useCallback((amount: number) => {
    setGamificationData(prev => ({
      ...prev,
      userPoints: prev.userPoints + amount
    }));
  }, []);

  // Fonction pour marquer un défi comme complété
  const completeChallenge = useCallback((challengeId: string) => {
    setGamificationData(prev => ({
      ...prev,
      challenges: prev.challenges.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, completed: true, progress: Number(challenge.goal) } 
          : challenge
      )
    }));
  }, []);

  return { 
    ...gamificationData, 
    loading, 
    earnPoints, 
    completeChallenge,
    refreshData: fetchGamificationData
  };
};

export default useGamification;
