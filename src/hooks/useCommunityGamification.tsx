
import { useState } from 'react';
import { Badge, Challenge, LeaderboardEntry } from '@/types/badge';

export function useCommunityGamification() {
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: '1',
      name: 'Premier pas',
      description: 'Rejoindre la communauté',
      imageUrl: '/badges/welcome.svg',
      unlocked: true,
      level: 1,
      category: 'community',
      tier: 'bronze',
      progress: 100,
      threshold: 100,
      completed: true
    },
    {
      id: '2',
      name: 'Communicateur',
      description: 'Participer à 5 discussions',
      imageUrl: '/badges/communicator.svg',
      unlocked: true,
      level: 2,
      category: 'community',
      tier: 'silver',
      progress: 5,
      threshold: 5,
      completed: true
    },
    {
      id: '3',
      name: 'Influenceur',
      description: 'Obtenir 10 likes sur vos commentaires',
      imageUrl: '/badges/influencer.svg',
      unlocked: false,
      level: 3,
      category: 'community',
      tier: 'gold',
      progress: 4,
      threshold: 10,
      completed: false
    }
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'c1',
      title: 'Soutien communautaire',
      name: 'Soutien communautaire',
      description: 'Répondre à 3 questions d\'autres membres',
      points: 100,
      progress: 1,
      goal: 3,
      category: 'community',
      completed: false,
      status: 'in-progress',
      difficulty: 'easy',
      completions: 1,
      total: 3
    },
    {
      id: 'c2',
      title: 'Partage bienveillant',
      name: 'Partage bienveillant',
      description: 'Partager une expérience personnelle positive',
      points: 50,
      progress: 1,
      goal: 1,
      category: 'community',
      completed: true,
      status: 'completed',
      difficulty: 'easy',
      completions: 1,
      total: 1
    },
    {
      id: 'c3',
      title: 'Engagement hebdomadaire',
      name: 'Engagement hebdomadaire',
      description: 'Participer aux discussions 5 jours cette semaine',
      points: 200,
      progress: 3,
      goal: 5,
      category: 'community',
      completed: false,
      status: 'in-progress',
      difficulty: 'medium',
      completions: 3,
      total: 5,
      deadline: new Date(Date.now() + 3*24*60*60*1000).toISOString()
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: 'l1',
      userId: 'u123',
      name: 'Marie L.',
      username: 'marie_l',
      points: 850,
      rank: 1,
      avatar: '/avatars/user1.png',
      score: 850
    },
    {
      id: 'l2',
      userId: 'u456',
      name: 'Thomas B.',
      username: 'thomas_b',
      points: 720,
      rank: 2,
      avatar: '/avatars/user2.png',
      score: 720
    },
    {
      id: 'l3',
      userId: 'u789',
      name: 'Sophie C.',
      username: 'sophie_c',
      points: 690,
      rank: 3,
      avatar: '/avatars/user3.png',
      score: 690
    }
  ]);

  const unlockBadge = (badgeId: string) => {
    setBadges(prev => prev.map(badge => 
      badge.id === badgeId 
        ? { ...badge, unlocked: true, completed: true, progress: badge.threshold || 100 } 
        : badge
    ));
  };

  const updateProgress = (challengeId: string, progress: number) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id !== challengeId) return challenge;
      
      const newProgress = Math.min(progress, challenge.goal);
      const completed = newProgress >= challenge.goal;
      
      return {
        ...challenge,
        progress: newProgress,
        completed,
        status: completed ? 'completed' : 'in-progress',
        completions: newProgress,
      };
    }));
  };

  return {
    badges,
    challenges,
    leaderboard,
    unlockBadge,
    updateProgress
  };
}

export default useCommunityGamification;
