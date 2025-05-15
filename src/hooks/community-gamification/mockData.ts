
import { Challenge, Badge, GamificationStats, LeaderboardEntry } from '@/types';

// Challenges mock data
export const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Première émotion',
    description: 'Enregistrez votre première émotion',
    reward: 100,
    progress: 1,
    total: 1,
    complete: true,
    icon: 'star'
  },
  {
    id: '2',
    title: '7 jours consécutifs',
    description: 'Enregistrez une émotion pendant 7 jours consécutifs',
    reward: 250,
    progress: 5,
    total: 7,
    complete: false,
    icon: 'calendar'
  },
  {
    id: '3',
    title: 'Méditation VR',
    description: 'Complétez 3 sessions de méditation VR',
    reward: 200,
    progress: 1,
    total: 3,
    complete: false,
    icon: 'headset'
  }
];

// Badges mock data
export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Explorateur émotionnel',
    description: 'A enregistré 10 émotions différentes',
    icon: 'compass',
    level: 1,
    unlockedAt: new Date(),
    progress: 10,
    total: 10,
    color: 'blue'
  },
  {
    id: '2',
    name: 'Méditant',
    description: 'A complété 5 sessions de méditation',
    icon: 'zen',
    level: 1,
    progress: 3,
    total: 5,
    color: 'purple'
  },
  {
    id: '3',
    name: 'Olympien émotionnel',
    description: 'A maintenu une streak de 30 jours',
    icon: 'medal',
    level: 2,
    progress: 18,
    total: 30,
    color: 'gold'
  }
];

// Gamification stats mock data
export const mockGamificationStats: GamificationStats = {
  points: 750,
  level: 3,
  nextLevelPoints: 1000,
  rank: 42,
  streak: 5,
  nextLevel: 4,
  achievements: mockBadges,
  badges: mockBadges,
  completedChallenges: 2,
  activeChallenges: 3,
  streakDays: 5,
  progressToNextLevel: 75,
  challenges: mockChallenges,
  recentAchievements: [mockBadges[0]]
};

// Leaderboard mock data
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Emma L.',
    points: 1240,
    level: 5,
    position: 1,
    avatar: '/images/avatars/emma.jpg',
    badges: [mockBadges[0], mockBadges[2]]
  },
  {
    id: '2',
    name: 'Thomas R.',
    points: 980,
    level: 4,
    position: 2,
    avatar: '/images/avatars/thomas.jpg',
    badges: [mockBadges[1]]
  },
  {
    id: '3',
    name: 'Sophie M.',
    points: 820,
    level: 3,
    position: 3,
    avatar: '/images/avatars/sophie.jpg',
    badges: [mockBadges[0]]
  },
  {
    id: 'user',
    name: 'Vous',
    points: 750,
    level: 3,
    position: 4,
    avatar: '/images/avatars/user.jpg',
    badges: [mockBadges[0]]
  }
];
