
import { GamificationStats, Badge } from '@/types';
import { LeaderboardEntry } from '@/types/gamification';

// Mock leaderboard data
export const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: "1",
    name: "Alice Martin",
    points: 2340,
    rank: 1,
    avatar: "/images/avatars/alice.jpg",
    department: "Marketing",
    level: 7,
    badges: 12,
    streak: 21
  },
  {
    id: "2",
    name: "Bob Johnson",
    points: 1950,
    rank: 2,
    avatar: "/images/avatars/bob.jpg",
    department: "Engineering",
    level: 6,
    badges: 9,
    streak: 14
  },
  {
    id: "3",
    name: "Carol Williams",
    points: 1820,
    rank: 3,
    avatar: "/images/avatars/carol.jpg",
    department: "HR",
    level: 5,
    badges: 8,
    streak: 10
  }
];

// Mock badges data
export const mockBadges: Badge[] = [
  {
    id: "1",
    name: "Consistency Champion",
    description: "Complete 7 consecutive daily check-ins",
    icon: "award",
    threshold: 7,
    type: "streak",
    imageUrl: "/images/badges/streak-7.svg",
    unlocked: true,
    unlockedAt: "2023-04-15T10:30:00Z",
    category: "engagement",
    level: "bronze",
    points: 50,
    total: 7
  },
  {
    id: "2",
    name: "Emotional Intelligence",
    description: "Complete 5 emotional intelligence assessments",
    icon: "brain",
    threshold: 5,
    type: "assessment",
    imageUrl: "/images/badges/ei-5.svg",
    unlocked: true,
    unlockedAt: "2023-03-28T14:20:00Z",
    category: "development",
    level: "silver",
    points: 100,
    total: 5
  },
  {
    id: "3",
    name: "Community Supporter",
    description: "Help 3 team members with their challenges",
    icon: "users",
    threshold: 3,
    type: "social",
    imageUrl: "/images/badges/community-3.svg",
    unlocked: false,
    category: "social",
    level: "gold",
    points: 150,
    progress: 1,
    total: 3
  }
];

// Mock gamification stats
export const mockGamificationStats: GamificationStats = {
  level: 5,
  points: 1250,
  badges: mockBadges.length,
  streak: 14,
  completedChallenges: 23,
  totalChallenges: 35,
  nextLevel: {
    points: 1500,
    rewards: ["New Badge", "Feature Unlock"]
  },
  pointsToNextLevel: 250,
  progressToNextLevel: 0.83,
  challenges: [],
  totalPoints: 1250,
  currentLevel: 5,
  streakDays: 14,
  lastActivityDate: new Date().toISOString(),
  activeChallenges: 5,
  badgesCount: mockBadges.length,
  rank: "Gold",
  recentAchievements: []
};

export default {
  mockLeaderboardData,
  mockBadges,
  mockGamificationStats
};
