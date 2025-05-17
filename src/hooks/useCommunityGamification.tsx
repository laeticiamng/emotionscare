
import { useState, useCallback, useEffect } from 'react';
import { Badge } from '@/types/badge';
import { Challenge, LeaderboardEntry } from '@/types/gamification';

export const useCommunityGamification = () => {
  // État des badges
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: '1',
      name: 'Contributeur',
      description: 'A participé à 5 discussions',
      imageUrl: '/badges/contributor.png',
      image_url: '/badges/contributor.png',
      tier: 'bronze',
      icon: 'message-circle',
      earned: true,
      progress: 100,
      threshold: 5
    },
    {
      id: '2',
      name: 'Mentor',
      description: 'A aidé 3 utilisateurs',
      imageUrl: '/badges/mentor.png',
      image_url: '/badges/mentor.png',
      tier: 'silver',
      icon: 'heart-handshake',
      earned: false,
      progress: 67,
      threshold: 3
    },
  ]);

  // État des défis
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Bienvenue dans la communauté',
      name: 'Bienvenue dans la communauté',
      description: 'Présentez-vous dans la section Introduction',
      points: 10,
      progress: 0,
      completed: false,
      status: 'active'
    },
    {
      id: '2',
      title: 'Entraide hebdomadaire',
      name: 'Entraide hebdomadaire',
      description: 'Répondez à une question dans le forum d\'entraide',
      points: 25,
      progress: 0,
      completed: false,
      status: 'active'
    }
  ]);

  // État du classement
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: '1',
      name: 'Sophie M.',
      rank: 1,
      points: 730,
      avatar: '/avatars/user1.png',
      trend: 'stable'
    },
    {
      id: '2',
      name: 'Thomas L.',
      rank: 2,
      points: 685,
      avatar: '/avatars/user2.png',
      trend: 'up'
    },
    {
      id: '3',
      name: 'Vous',
      rank: 3,
      points: 520,
      avatar: '/avatars/user3.png',
      trend: 'down'
    }
  ]);

  // Statistiques utilisateur
  const [stats, setStats] = useState({
    level: 3,
    points: 520,
    streak: 5,
    progress: 65,
    nextLevelPoints: 750
  });

  // Fonction pour accomplir un défi
  const completeChallenge = useCallback((challengeId: string) => {
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => 
        challenge.id === challengeId
          ? { ...challenge, completed: true, progress: 100, status: 'completed' as const }
          : challenge
      )
    );

    // Mise à jour des points
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      setStats(prev => ({
        ...prev,
        points: prev.points + (challenge.points || 0)
      }));
    }
  }, [challenges]);

  // Fonction pour déverrouiller un badge
  const unlockBadge = useCallback((badgeId: string) => {
    setBadges(prevBadges => 
      prevBadges.map(badge => 
        badge.id === badgeId
          ? { ...badge, earned: true, progress: 100 }
          : badge
      )
    );
  }, []);

  // Fonction pour vérifier les progrès et déverrouiller les badges si nécessaire
  useEffect(() => {
    // Logique pour vérifier et débloquer automatiquement les badges
    // basée sur les progrès de l'utilisateur
    // Dans un vrai système, cela serait fait côté serveur
  }, [stats, badges, challenges]);

  return {
    badges,
    challenges,
    leaderboard,
    stats,
    completeChallenge,
    unlockBadge
  };
};

export default useCommunityGamification;
