
import { useState, useEffect } from 'react';
import { Badge, Challenge, LeaderboardEntry } from '@/types/badge';

export const useGamification = () => {
  // État local pour stocker les données de gamification
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userRank, setUserRank] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Charger les données initiales
  useEffect(() => {
    const fetchGamificationData = async () => {
      setLoading(true);
      try {
        // Dans une implémentation réelle, ces données viendraient d'une API
        await new Promise(resolve => setTimeout(resolve, 500)); // Simuler un délai réseau

        // Badges simulés
        const mockBadges: Badge[] = [
          {
            id: "1",
            name: "Première émotion",
            description: "Enregistrer votre première émotion",
            imageUrl: "/badges/first-emotion.png",
            unlocked: true,
            level: 1,
            category: "émotions",
            progress: 100,
            threshold: 100,
            completed: true
          },
          {
            id: "2",
            name: "Journal régulier",
            description: "Utiliser le journal 5 jours consécutifs",
            imageUrl: "/badges/journal-streak.png",
            unlocked: true,
            level: 2,
            category: "journal",
            progress: 100,
            threshold: 100,
            completed: true
          },
          {
            id: "3",
            name: "Explorer de la musique",
            description: "Écouter 10 morceaux différents",
            imageUrl: "/badges/music-explorer.png",
            unlocked: false,
            level: 1,
            category: "musique",
            progress: 6,
            threshold: 10,
            completed: false
          }
        ];

        // Défis simulés
        const mockChallenges: Challenge[] = [
          {
            id: "ch1",
            title: "Semaine de pleine conscience",
            name: "Semaine de pleine conscience",
            description: "Pratiquer une activité de pleine conscience pendant 5 jours",
            points: 100,
            progress: 3,
            goal: 5,
            category: "bien-être",
            completed: false,
            status: "in-progress",
            difficulty: "medium",
            completions: 3,
            total: 5
          },
          {
            id: "ch2",
            title: "Diversité émotionnelle",
            name: "Diversité émotionnelle",
            description: "Enregistrer 7 émotions différentes",
            points: 150,
            progress: 4,
            goal: 7,
            category: "émotions",
            completed: false,
            status: "in-progress",
            difficulty: "easy",
            completions: 4,
            total: 7
          },
          {
            id: "ch3",
            title: "Partage communautaire",
            name: "Partage communautaire",
            description: "Partager 3 entrées de journal avec la communauté",
            points: 200,
            progress: 0,
            goal: 3,
            category: "communauté",
            completed: false,
            status: "not-started",
            difficulty: "hard",
            completions: 0,
            total: 3
          }
        ];

        // Classement simulé
        const mockLeaderboard: LeaderboardEntry[] = [
          {
            id: "l1",
            userId: "u1",
            name: "Emma J.",
            username: "emma_j",
            points: 1250,
            rank: 1
          },
          {
            id: "l2",
            userId: "u2",
            name: "Thomas W.",
            username: "thomas_w",
            points: 980,
            rank: 2
          },
          {
            id: "l3",
            userId: "current",
            name: "Vous",
            username: "current_user",
            points: 820,
            rank: 3
          }
        ];

        setBadges(mockBadges);
        setChallenges(mockChallenges);
        setLeaderboard(mockLeaderboard);
        setUserPoints(820); // Points de l'utilisateur actuel
        setUserRank(3); // Rang de l'utilisateur actuel
      } catch (error) {
        console.error("Erreur lors du chargement des données de gamification:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGamificationData();
  }, []);

  // Fonction pour débloquer un badge
  const unlockBadge = async (badgeId: string): Promise<boolean> => {
    try {
      // Dans une implémentation réelle, cela appellerait une API
      await new Promise(resolve => setTimeout(resolve, 300)); // Simuler un délai réseau
      
      setBadges(prevBadges => 
        prevBadges.map(badge => 
          badge.id === badgeId 
            ? { ...badge, unlocked: true, completed: true, progress: badge.threshold || 100 } 
            : badge
        )
      );
      
      return true;
    } catch (error) {
      console.error("Erreur lors du déblocage du badge:", error);
      return false;
    }
  };

  // Fonction pour mettre à jour la progression d'un défi
  const updateChallengeProgress = async (challengeId: string, newProgress: number): Promise<boolean> => {
    try {
      // Dans une implémentation réelle, cela appellerait une API
      await new Promise(resolve => setTimeout(resolve, 300)); // Simuler un délai réseau
      
      setChallenges(prevChallenges => 
        prevChallenges.map(challenge => {
          if (challenge.id !== challengeId) return challenge;
          
          const progress = Math.min(newProgress, challenge.goal);
          const completed = progress >= challenge.goal;
          
          return {
            ...challenge,
            progress,
            completed,
            status: completed ? "completed" : "in-progress",
            completions: progress
          };
        })
      );
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du défi:", error);
      return false;
    }
  };

  return {
    badges,
    challenges,
    leaderboard,
    userPoints,
    userRank,
    loading,
    unlockBadge,
    updateChallengeProgress
  };
};

export default useGamification;
