
import { Challenge, Badge, LeaderboardEntry } from '@/types/challenge';

// Mock challenges for demonstration purposes
export const mockChallenges: Challenge[] = [
  {
    id: 'c1',
    title: 'Première méditation',
    description: 'Complétez votre première session de méditation',
    category: 'wellness',
    type: 'achievement',
    points: 50,
    progress: 1,
    target: 1,
    completed: true,
    imageUrl: '/images/challenges/meditation.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 'c2',
    title: 'Semaine de pleine conscience',
    description: 'Complétez 5 sessions de méditation en une semaine',
    category: 'wellness',
    type: 'streak',
    points: 200,
    progress: 3,
    target: 5,
    completed: false,
    imageUrl: '/images/challenges/streak.png',
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'c3',
    title: 'Explorer les émotions',
    description: 'Enregistrez 10 entrées dans votre journal émotionnel',
    category: 'emotional',
    type: 'ongoing',
    points: 150,
    progress: 7,
    target: 10,
    completed: false,
    imageUrl: '/images/challenges/journal.png'
  }
];

// Mock badges for demonstration purposes
export const mockBadges: Badge[] = [
  {
    id: 'b1',
    name: 'Novice en méditation',
    description: 'Complétez votre première session de méditation',
    imageUrl: '/images/badges/meditation-novice.png',
    category: 'wellness',
    rarity: 'common',
    earnedAt: new Date().toISOString(),
    progress: 1,
    target: 1
  },
  {
    id: 'b2',
    name: 'Explorateur émotionnel',
    description: 'Identifiez 5 émotions différentes',
    imageUrl: '/images/badges/emotion-explorer.png',
    category: 'emotional',
    rarity: 'uncommon',
    earnedAt: new Date().toISOString(),
    progress: 5,
    target: 5
  },
  {
    id: 'b3',
    name: 'Maître du sommeil',
    description: 'Complétez 10 sessions de méditation pour le sommeil',
    imageUrl: '/images/badges/sleep-master.png',
    category: 'wellness',
    rarity: 'rare',
    progress: 6,
    target: 10
  }
];

// Mock leaderboard entries
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: 'u1',
    username: 'MindfulMarie',
    points: 1250,
    rank: 1,
    avatarUrl: '/images/avatars/avatar1.jpg',
    badges: 12,
    achievements: 15
  },
  {
    userId: 'u2',
    username: 'CalmCarlos',
    points: 1120,
    rank: 2,
    avatarUrl: '/images/avatars/avatar2.jpg',
    badges: 10,
    achievements: 13
  },
  {
    userId: 'u3',
    username: 'SereneSelma',
    points: 980,
    rank: 3,
    avatarUrl: '/images/avatars/avatar3.jpg',
    badges: 9,
    achievements: 11
  },
  {
    userId: 'current',
    username: 'Vous',
    points: 750,
    rank: 4,
    avatarUrl: '/images/avatars/avatar-you.jpg',
    badges: 7,
    achievements: 9,
    isCurrentUser: true
  }
];
