
import { Challenge, Badge, LeaderboardEntry } from '@/types/badge';

// Mock challenges for demonstration purposes
export const mockChallenges: Challenge[] = [
  {
    id: 'c1',
    title: 'Première méditation',
    name: 'Première méditation',
    description: 'Complétez votre première session de méditation',
    status: 'completed',
    type: 'achievement',
    points: 50,
    progress: 1,
    goal: 1,
    unlocked: true,
    category: 'wellness',
    reward: { id: 'b1', name: 'Novice en méditation', description: 'Badge de méditation', unlocked: true }
  },
  {
    id: 'c2',
    title: 'Semaine de pleine conscience',
    name: 'Semaine de pleine conscience',
    description: 'Complétez 5 sessions de méditation en une semaine',
    status: 'active',
    type: 'streak',
    points: 200,
    progress: 3,
    goal: 5,
    unlocked: true,
    category: 'wellness',
    reward: { id: 'b2', name: 'Maître de la méditation', description: 'Badge de maîtrise', unlocked: false }
  },
  {
    id: 'c3',
    title: 'Explorer les émotions',
    name: 'Explorer les émotions',
    description: 'Enregistrez 10 entrées dans votre journal émotionnel',
    status: 'active',
    type: 'ongoing',
    points: 150,
    progress: 7,
    goal: 10,
    unlocked: true,
    category: 'emotional',
    reward: { id: 'b3', name: 'Explorateur émotionnel', description: 'Badge d\'exploration', unlocked: false }
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
    tier: 'bronze',
    unlocked: true,
    rarity: 'common',
    progress: 1,
    threshold: 1
  },
  {
    id: 'b2',
    name: 'Explorateur émotionnel',
    description: 'Identifiez 5 émotions différentes',
    imageUrl: '/images/badges/emotion-explorer.png',
    category: 'emotional',
    tier: 'silver',
    unlocked: true,
    rarity: 'uncommon',
    progress: 5,
    threshold: 5
  },
  {
    id: 'b3',
    name: 'Maître du sommeil',
    description: 'Complétez 10 sessions de méditation pour le sommeil',
    imageUrl: '/images/badges/sleep-master.png',
    category: 'wellness',
    tier: 'gold',
    unlocked: false,
    rarity: 'rare',
    progress: 6,
    threshold: 10
  }
];

// Mock leaderboard entries
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: 'u1',
    userId: 'u1',
    username: 'MindfulMarie',
    name: 'Marie Dupont',
    points: 1250,
    rank: 1,
    avatar: '/images/avatars/avatar1.jpg',
    badges: [],
    score: 1250
  },
  {
    id: 'u2',
    userId: 'u2',
    username: 'CalmCarlos',
    name: 'Carlos Martin',
    points: 1120,
    rank: 2,
    avatar: '/images/avatars/avatar2.jpg',
    badges: [],
    score: 1120
  },
  {
    id: 'u3',
    userId: 'u3',
    username: 'SereneSelma',
    name: 'Selma Larsson',
    points: 980,
    rank: 3,
    avatar: '/images/avatars/avatar3.jpg',
    badges: [],
    score: 980
  },
  {
    id: 'current',
    userId: 'current',
    username: 'Vous',
    name: 'Votre Nom',
    points: 750,
    rank: 4,
    avatar: '/images/avatars/avatar-you.jpg',
    badges: [],
    score: 750
  }
];

// Add exports for compatibility with other files
export const mockCommunityBadges = mockBadges;
export const mockCommunityChallenges = mockChallenges;
