
import { Badge, Challenge, LeaderboardEntry } from '@/types';

// Mock leaderboard data
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    userId: 'user-1',
    name: 'Sophie Martin',
    points: 1250,
    rank: 1,
    avatar: '/avatars/avatar-1.png',
    department: 'Marketing',
    trend: 'same',
    previousRank: 1
  },
  {
    id: '2',
    userId: 'user-2',
    name: 'Thomas Bernard',
    points: 980,
    rank: 2,
    avatar: '/avatars/avatar-2.png',
    department: 'Design',
    trend: 'up',
    previousRank: 4
  },
  {
    id: '3',
    userId: 'user-3',
    name: 'Marie Dubois',
    points: 920,
    rank: 3,
    avatar: '/avatars/avatar-3.png',
    department: 'Engineering',
    trend: 'down',
    previousRank: 2
  }
];

// Mock badges
export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Première Connexion',
    description: 'Bienvenue dans l\'application !',
    icon: 'award',
    level: 'Bronze',
    progress: 100,
    total: 100,
  },
  {
    id: '2',
    name: 'Streak Hebdomadaire',
    description: 'Connecté 7 jours d\'affilée',
    icon: 'flame',
    level: 'Silver',
    progress: 5,
    total: 7,
  },
  {
    id: '3',
    name: 'Gourou du Bien-être',
    description: 'Complété 10 sessions de méditation',
    icon: 'lotus',
    level: 'Gold',
    progress: 8,
    total: 10,
  }
];

// Mock challenges
export const mockChallenges: Challenge[] = [
  {
    id: '1',
    name: 'Journal Quotidien',
    description: 'Écrivez dans votre journal pendant 5 jours consécutifs',
    points: 50,
    progress: 3,
    total: 5,
    completed: false
  },
  {
    id: '2',
    name: 'Méditation Matinale',
    description: 'Pratiquez la méditation pendant 10 minutes chaque jour',
    points: 100,
    progress: 7,
    total: 10,
    completed: false
  },
  {
    id: '3',
    name: 'Partage d\'Expérience',
    description: 'Partagez une expérience positive avec la communauté',
    points: 75,
    progress: 1,
    total: 1,
    completed: true
  }
];

export default {
  mockLeaderboard,
  mockBadges,
  mockChallenges
};
