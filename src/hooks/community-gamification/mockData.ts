
import { LeaderboardEntry, Badge } from '@/types/gamification';

export const leaderboardEntries: LeaderboardEntry[] = [
  {
    id: '1',
    userId: 'user1',
    score: 1850,
    rank: 1,
    name: 'Sophie Martin',
    avatarUrl: '/images/avatars/avatar-1.png',
    points: 1850,
    level: 8,
    progress: 75
  },
  {
    id: '2',
    userId: 'user2',
    score: 1720,
    rank: 2,
    name: 'Antoine Dubois',
    avatarUrl: '/images/avatars/avatar-2.png',
    points: 1720,
    level: 7,
    progress: 90
  },
  {
    id: '3',
    userId: 'user3',
    score: 1680,
    rank: 3,
    name: 'Chloé Leclerc',
    avatarUrl: '/images/avatars/avatar-3.png',
    points: 1680,
    level: 7,
    progress: 60
  },
];

export const badges: Badge[] = [
  {
    id: '1',
    name: 'First Week',
    description: 'Completed your first week of emotional tracking',
    icon: 'star',
    level: 1,
    earnedDate: '2023-04-15',
    progress: 100,
    total: 100,
    unlocked: true,
    threshold: 7
  },
  {
    id: '2',
    name: 'Mood Master',
    description: 'Tracked your mood for 30 consecutive days',
    icon: 'heart',
    level: 2,
    earnedDate: '2023-05-01',
    progress: 100,
    total: 100,
    unlocked: true,
    threshold: 30
  },
  {
    id: '3',
    name: 'Challenge Champion',
    description: 'Completed 10 challenges',
    icon: 'check',
    level: 3,
    earnedDate: '2023-05-10',
    progress: 100,
    total: 100,
    unlocked: true,
    threshold: 10
  },
];

// Add the missing exports
export const mockBadges = badges;
export const mockLeaderboard = leaderboardEntries;
