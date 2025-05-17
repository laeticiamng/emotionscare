import { Badge, Challenge } from '@/types';

// Mock data for community gamification

export const mockChallenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Première connexion",
    name: "Première connexion",
    description: "Connectez-vous pour la première fois à l'application",
    progress: 100,
    completed: true,
    status: "completed",
    points: 10,
    difficulty: "easy",
    category: "onboarding",
    tags: ["débutant", "connexion"],
    goal: "1",
    totalSteps: 1
  },
  {
    id: "challenge-2",
    title: "Remplir son profil",
    name: "Remplir son profil",
    description: "Complétez votre profil à 100%",
    progress: 75,
    completed: false,
    status: "in-progress",
    points: 15,
    difficulty: "medium",
    category: "profile",
    tags: ["profile", "données"],
    goal: "100%",
    totalSteps: 4
  },
  {
    id: "challenge-3",
    title: "Méditation quotidienne",
    name: "Méditation quotidienne",
    description: "Faites 7 jours consécutifs de méditation",
    progress: 40,
    completed: false,
    status: "in-progress",
    points: 25,
    difficulty: "hard",
    category: "wellbeing",
    tags: ["méditation", "régularité", "bien-être"],
    goal: "7",
    totalSteps: 7
  }
];

export const mockBadges: Badge[] = [
  {
    id: "badge-1",
    name: "Explorateur Novice",
    description: "A complété sa première session sur la plateforme",
    unlocked: true,
    earned: true,
    earnedAt: "2023-04-15",
    category: "engagement",
    level: 1,
    progress: 100,
    threshold: 1,
    tier: "bronze"
  },
  {
    id: "badge-2",
    name: "Apprenti Méditant",
    description: "A complété 10 minutes de méditation",
    unlocked: true,
    earned: true,
    earnedAt: "2023-04-18",
    category: "méditation",
    level: 1,
    progress: 100,
    threshold: 10,
    tier: "bronze"
  },
  {
    id: "badge-3",
    name: "Journal Intime",
    description: "A écrit 3 entrées dans son journal émotionnel",
    unlocked: false,
    earned: false,
    category: "journal",
    level: 2,
    progress: 30,
    threshold: 3,
    tier: "silver"
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
