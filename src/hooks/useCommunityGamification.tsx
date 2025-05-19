import { useState } from 'react';
import { Badge } from '@/types/badge';

export function useCommunityGamification() {
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: '1',
      name: 'Consistent Tracker',
      description: 'Track emotions for 7 consecutive days',
      imageUrl: '/badges/consistent-tracker.png',
      level: '1', // Changed to string 
      unlocked: true,
      progress: 7,
      total: 7,
      completed: true,
      tier: 'bronze', // Added to type
    },
    {
      id: '2',
      name: 'Mindfulness Master',
      description: 'Complete 10 meditation sessions',
      imageUrl: '/badges/mindfulness-master.png',
      level: '2', // Changed to string
      unlocked: false,
      progress: 6,
      total: 10,
      completed: false,
      tier: 'silver', // Added to type
    },
    {
      id: '3',
      name: 'Emotion Explorer',
      description: 'Record 5 different emotions',
      imageUrl: '/badges/emotion-explorer.png',
      level: '1', // Changed to string
      unlocked: true,
      progress: 5,
      total: 5,
      completed: true,
      tier: 'gold', // Added to type
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
      total: 3,
      reward: {
        type: 'points',
        value: 100
      },
      unlocked: true
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
      total: 1,
      reward: {
        type: 'points',
        value: 50
      },
      unlocked: true
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
      deadline: new Date(Date.now() + 3*24*60*60*1000).toISOString(),
      reward: {
        type: 'badge',
        value: 'community-star'
      },
      unlocked: true
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: 'l1',
      userId: 'u123',
      name: 'Marie L.',
      username: 'marie_l',
      points: 850,
      position: 1,
      rank: 1,
      score: 850,
      avatarUrl: '/avatars/user1.png'
    },
    {
      id: 'l2',
      userId: 'u456',
      name: 'Thomas B.',
      username: 'thomas_b',
      points: 720,
      position: 2,
      rank: 2,
      score: 720,
      avatarUrl: '/avatars/user2.png'
    },
    {
      id: 'l3',
      userId: 'u789',
      name: 'Sophie C.',
      username: 'sophie_c',
      points: 690,
      position: 3,
      rank: 3,
      score: 690,
      avatarUrl: '/avatars/user3.png'
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
      
      const newProgress = Math.min(progress, challenge.goal || 0);
      const completed = newProgress >= (challenge.goal || 0);
      
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
