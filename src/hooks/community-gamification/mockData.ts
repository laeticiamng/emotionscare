
import { Badge } from '@/types/badge';
import { Challenge, LeaderboardEntry } from '@/types/gamification';

// Mock data for community gamification

export const mockChallenges: Challenge[] = [
  {
    id: 'challenge1',
    title: 'Partage quotidien',
    description: 'Partagez votre ressenti dans la communauté chaque jour pendant 5 jours',
    points: 50,
    progress: 3,
    totalSteps: 5,
    completed: false,
    difficulty: 'medium',
    category: 'community'
  },
  {
    id: 'challenge2',
    title: 'Supporter actif',
    description: 'Apportez votre soutien à 3 publications de la communauté',
    points: 30,
    progress: 2,
    totalSteps: 3,
    completed: false,
    difficulty: 'easy',
    category: 'community'
  },
  {
    id: 'challenge3',
    title: 'Première connexion',
    description: 'Bienvenue dans la communauté !',
    points: 10,
    progress: 1,
    totalSteps: 1,
    completed: true,
    difficulty: 'easy',
    category: 'onboarding'
  }
];

export const mockBadges: Badge[] = [
  {
    id: 'badge1',
    name: 'Membre de la communauté',
    description: 'A rejoint la communauté EmotionsCare',
    imageUrl: '/badges/community-member.svg',
    category: 'community',
    level: 'bronze',
    unlocked: true,
    unlockedAt: '2025-04-01T10:00:00Z',
    earned: true, 
    progress: 1,
    threshold: 1
  },
  {
    id: 'badge2',
    name: 'Entraide',
    description: 'A aidé 5 membres de la communauté',
    imageUrl: '/badges/helper.svg',
    category: 'community',
    level: 'silver',
    unlocked: true,
    unlockedAt: '2025-04-15T14:30:00Z',
    earned: true,
    progress: 5,
    threshold: 5
  },
  {
    id: 'badge3',
    name: 'Influenceur',
    description: 'Publier 10 messages qui ont reçu des réactions',
    imageUrl: '/badges/influencer.svg',
    category: 'community',
    level: 'gold',
    unlocked: false,
    progress: 7,
    threshold: 10,
    earned: false
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: 'user1',
    name: 'Sophie Martin',
    rank: 1,
    points: 780,
    avatarUrl: '/avatars/user1.jpg',
    trend: 'up'
  },
  {
    id: 'user2',
    name: 'Thomas Bernard',
    rank: 2,
    points: 650,
    avatarUrl: '/avatars/user2.jpg',
    trend: 'stable'
  },
  {
    id: 'user3',
    name: 'Emma Dubois',
    rank: 3,
    points: 620,
    avatarUrl: '/avatars/user3.jpg',
    trend: 'up'
  },
  {
    id: 'user4',
    name: 'Lucas Petit',
    rank: 4,
    points: 590,
    avatarUrl: '/avatars/user4.jpg',
    trend: 'down'
  },
  {
    id: 'current-user',
    name: 'Vous',
    rank: 15,
    points: 320,
    avatarUrl: '/avatars/current-user.jpg',
    trend: 'up'
  }
];

export const mockGamificationStats = {
  points: 320,
  level: 3,
  rank: '15',
  badges: mockBadges,
  streak: 4,
  nextLevelPoints: 500,
  progress: 0.64,
  recentAchievements: [mockBadges[1]]
};
