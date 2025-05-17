
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
      threshold: 5,
      level: 1,
      category: 'community',
      unlocked: true
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
      threshold: 3,
      level: 2,
      category: 'community',
      unlocked: false
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
      status: 'active',
      category: 'community',
      goal: 1
    },
    {
      id: '2',
      title: 'Entraide hebdomadaire',
      name: 'Entraide hebdomadaire',
      description: 'Répondez à une question dans le forum d\'entraide',
      points: 25,
      progress: 0,
      completed: false,
      status: 'active',
      category: 'community',
      goal: 1
    }
  ]);

  // État du classement
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: '1',
      userId: 'user1',
      rank: 1,
      score: 730,
      points: 730,
      avatar: '/avatars/user1.png',
      username: 'Sophie M.',
      badges: 5
    },
    {
      id: '2',
      userId: 'user2',
      rank: 2,
      score: 685,
      points: 685,
      avatar: '/avatars/user2.png',
      username: 'Thomas L.',
      badges: 4
    },
    {
      id: '3',
      userId: 'user3',
      rank: 3,
      score: 520,
      points: 520,
      avatar: '/avatars/user3.png',
      username: 'Vous',
      badges: 3
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
          ? { ...badge, earned: true, progress: 100, unlocked: true }
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
