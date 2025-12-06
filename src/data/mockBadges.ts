// @ts-nocheck
import { Badge, Challenge, LeaderboardEntry } from '@/types/badge';

export const mockBadges: Badge[] = [
  {
    id: "badge-1",
    name: "Emotional Intelligence",
    description: "Completed the emotional intelligence assessment with high scores",
    imageUrl: "/images/badges/emotional-intelligence.svg",
    image: "/images/badges/emotional-intelligence.svg", // Adding image property to match the type
    unlocked: true,
    category: "assessment",
    tier: "bronze",
    rarity: "rare"
  },
  {
    id: "badge-2",
    name: "Journaling Star",
    description: "Maintained a daily journaling practice for 7 consecutive days",
    imageUrl: "/images/badges/journaling-star.svg",
    image: "/images/badges/journaling-star.svg",
    unlocked: true,
    earned: true,
    category: "consistency",
    rarity: "uncommon"
  },
  {
    id: "badge-3",
    name: "Meditation Master",
    description: "Completed 10 guided meditation sessions",
    imageUrl: "/images/badges/meditation-master.svg",
    image: "/images/badges/meditation-master.svg",
    unlocked: true,
    earned: false,
    progress: 7,
    goal: 10,
    category: "wellness",
    rarity: "rare"
  },
  {
    id: "badge-4",
    name: "Resilience Builder",
    description: "Successfully completed the resilience training course",
    imageUrl: "/images/badges/resilience-builder.svg",
    image: "/images/badges/resilience-builder.svg",
    unlocked: false,
    category: "training",
    rarity: "epic"
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Daily Journaling",
    description: "Write in your journal for 5 consecutive days",
    points: 50,
    reward: "Journaling Star Badge",
    progress: 3,
    goal: 5,
    status: "active",
    category: "consistency",
    difficulty: "easy"
  },
  {
    id: "challenge-2",
    title: "Mindful Meditation",
    description: "Complete 7 guided meditation sessions this week",
    points: 75,
    reward: "Meditation Master Badge",
    progress: 5,
    goal: 7,
    status: "active",
    category: "wellness",
    difficulty: "medium"
  },
  {
    id: "challenge-3",
    title: "Gratitude Practice",
    description: "List 3 things you are grateful for each day for a week",
    points: 60,
    reward: "Grateful Heart Badge",
    progress: 0,
    goal: 7,
    status: "locked",
    category: "mindfulness",
    difficulty: "easy"
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: "user-1",
    userId: "user-1",
    name: "Alice Johnson",
    username: "alice.j",
    points: 920,
    rank: 1,
    avatar: "/images/avatars/avatar-1.jpg",
    score: 920
  },
  {
    id: "user-2",
    userId: "user-2",
    name: "Bob Smith",
    username: "bob.s",
    points: 850,
    rank: 2,
    avatar: "/images/avatars/avatar-2.jpg",
    score: 850
  },
  {
    id: "user-3",
    userId: "user-3",
    name: "Charlie Brown",
    username: "charlie.b",
    points: 780,
    rank: 3,
    avatar: "/images/avatars/avatar-3.jpg",
    score: 780
  },
  {
    id: "user-4",
    userId: "user-4",
    name: "Diana Miller",
    username: "diana.m",
    points: 650,
    rank: 4,
    avatar: "/images/avatars/avatar-4.jpg",
    score: 650
  },
  {
    id: "user-5",
    userId: "user-5",
    name: "Ethan White",
    username: "ethan.w",
    points: 590,
    rank: 5,
    avatar: "/images/avatars/avatar-5.jpg",
    score: 590
  }
];
