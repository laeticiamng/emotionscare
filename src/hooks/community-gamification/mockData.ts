
/**
 * MOCK DATA
 * Ce fichier respecte strictement les types officiels Badge et Challenge
 * Toute modification doit être propagée dans le type officiel ET dans tous les composants consommateurs.
 */

import { Badge, Challenge } from '@/types/badge';

// Using type LeaderboardEntry here as it's referenced but not defined
interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  points: number;
  score?: number; // For backwards compatibility
  rank: number;
  avatarUrl: string;
  level: number | string;
  progress: number;
  lastActive?: string; // Add this field to type
  trend?: string;
}

export const mockBadges: Badge[] = [
  {
    id: "1",
    name: "Early Bird",
    description: "Connect 5 days in a row before 8am",
    icon: "🌅", 
    imageUrl: "/badges/early-bird.png",
    unlocked: true,
    level: "1", // Convert to string for compatibility
    progress: 5,
    total: 5,
    completed: true,
    threshold: 5,
    achieved: true, // Add for backward compatibility
    earned: true // Add for backward compatibility
  },
  {
    id: "2",
    name: "Emotion Master",
    description: "Record your emotions 30 days in a row",
    icon: "🧠",
    imageUrl: "/badges/emotion-master.png",
    unlocked: true,
    level: "2", // Convert to string for compatibility
    progress: 30,
    total: 30,
    completed: true,
    threshold: 30,
    achieved: true,
    earned: true
  },
  {
    id: "3",
    name: "Journaling Pro",
    description: "Write in your journal 20 times",
    icon: "✏️",
    imageUrl: "/badges/journal-pro.png",
    unlocked: false,
    level: "1", // Convert to string for compatibility
    progress: 15,
    total: 20,
    completed: false,
    threshold: 20,
    achieved: false,
    earned: false
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: "ch1",
    title: "Daily Check-in",
    name: "Daily Check-in", // For backwards compatibility
    description: "Connect to the app every day for a week",
    points: 100,
    progress: 5,
    goal: 7,
    category: "habit",
    completed: false,
    isCompleted: false, // Add for component compatibility
    status: "ongoing",
    totalSteps: 7,
    icon: "📅",
    total: 7, // Required by Challenge interface
    reward: "badge-daily-check", // Add required property
    unlocked: true // Add required property
  },
  {
    id: "ch2",
    title: "Emotion Tracking",
    name: "Emotion Tracking", // For backwards compatibility
    description: "Track your emotions every day for 5 days",
    points: 150,
    progress: 5,
    goal: 5,
    category: "emotion",
    completed: true,
    isCompleted: true, // Add for component compatibility
    status: "completed",
    totalSteps: 5,
    icon: "😊",
    total: 5, // Required by Challenge interface
    reward: "badge-emotion-track", // Add required property
    unlocked: true // Add required property
  },
  {
    id: "ch3",
    title: "Journaling Challenge",
    name: "Journaling Challenge", // For backwards compatibility
    description: "Write in your journal 3 times this week",
    points: 120,
    progress: 1,
    goal: 3,
    category: "journal",
    completed: false,
    isCompleted: false, // Add for component compatibility
    status: "ongoing",
    totalSteps: 3,
    icon: "📝",
    total: 3, // Required by Challenge interface
    reward: "badge-journal", // Add required property
    unlocked: true // Add required property
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: "l1",
    userId: "u1",
    name: "Emma Johnson",
    points: 1250,
    score: 1250, // For backwards compatibility
    rank: 1,
    avatarUrl: "/avatars/avatar-1.png",
    level: 5,
    progress: 85,
    lastActive: "2025-05-15T10:30:00Z",
    trend: "up"
  },
  {
    id: "l2",
    userId: "u2",
    name: "Thomas Wright",
    points: 980,
    score: 980, // For backwards compatibility
    rank: 2,
    avatarUrl: "/avatars/avatar-2.png",
    level: 4,
    progress: 60,
    lastActive: "2025-05-16T15:45:00Z",
    trend: "stable"
  },
  {
    id: "l3",
    userId: "u3",
    name: "Sarah Miller",
    points: 820,
    score: 820, // For backwards compatibility
    rank: 3,
    avatarUrl: "/avatars/avatar-3.png",
    level: 3,
    progress: 90,
    lastActive: "2025-05-17T08:20:00Z",
    trend: "up"
  }
];
