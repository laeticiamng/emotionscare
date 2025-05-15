
import { Badge, Challenge, LeaderboardEntry } from '@/types';

// Mock leaderboard data
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    user_id: 'user-1',
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
    user_id: 'user-2',
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
    user_id: 'user-3',
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
    total: 100
  },
  {
    id: '2',
    name: 'Streak Hebdomadaire',
    description: 'Connecté 7 jours d\'affilée',
    icon: 'flame',
    level: 'Silver',
    progress: 5,
    total: 7
  },
  {
    id: '3',
    name: 'Gourou du Bien-être',
    description: 'Complété 10 sessions de méditation',
    icon: 'lotus',
    level: 'Gold',
    progress: 8,
    total: 10
  }
];

// Export default for consistency
export default {
  mockLeaderboard,
  mockBadges
};
