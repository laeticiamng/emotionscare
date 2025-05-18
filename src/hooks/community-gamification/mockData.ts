
import { Badge, Challenge } from '@/types/badge';
import { LeaderboardEntry } from '@/types/badge';

export const mockBadges: Badge[] = [
  {
    id: "1",
    name: "Early Bird",
    description: "Connect 5 days in a row before 8am",
    imageUrl: "/badges/early-bird.png",
    unlocked: true,
    level: 1,
    category: "habit",
    tier: "bronze"
  },
  {
    id: "2",
    name: "Emotion Master",
    description: "Record your emotions 30 days in a row",
    imageUrl: "/badges/emotion-master.png",
    unlocked: true,
    level: 2,
    category: "emotion"
  },
  {
    id: "3",
    name: "Journaling Pro",
    description: "Write in your journal 20 times",
    imageUrl: "/badges/journal-pro.png",
    unlocked: false,
    level: 1,
    category: "journal"
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: "ch1",
    name: "Daily Check-in",
    title: "Daily Check-in",
    description: "Connect to the app every day for a week",
    points: 100,
    progress: 5,
    goal: 7,
    category: "habit",
    completed: false,
    status: "in-progress",
    tags: []
  },
  {
    id: "ch2",
    name: "Emotion Tracking",
    title: "Emotion Tracking",
    description: "Track your emotions every day for 5 days",
    points: 150,
    progress: 5,
    goal: 5,
    category: "emotion",
    completed: true,
    status: "completed",
    tags: []
  },
  {
    id: "ch3",
    name: "Journaling Challenge",
    title: "Journaling Challenge",
    description: "Write in your journal 3 times this week",
    points: 120,
    progress: 1,
    goal: 3,
    category: "journal",
    completed: false,
    status: "in-progress",
    tags: []
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: "l1",
    userId: "u1",
    name: "Emma Johnson",
    points: 1250,
    rank: 1,
    avatar: "/avatars/avatar-1.png"
  },
  {
    id: "l2",
    userId: "u2",
    name: "Thomas Wright",
    points: 980,
    rank: 2,
    avatar: "/avatars/avatar-2.png"
  },
  {
    id: "l3",
    userId: "u3",
    name: "Sarah Miller",
    points: 820,
    rank: 3,
    avatar: "/avatars/avatar-3.png"
  }
];
