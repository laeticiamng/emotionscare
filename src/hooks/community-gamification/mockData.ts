
import { Badge, Challenge, LeaderboardEntry } from '@/types/badge';

// Mock data for community badges
export const mockCommunityBadges: Badge[] = [
  {
    id: "comm-badge-1",
    name: "Community Builder",
    description: "Awarded for creating an active community group",
    image: "/images/badges/community-builder.svg",
    imageUrl: "/images/badges/community-builder.svg",
    rarity: "rare",
    unlocked: true,
    earned: true
  },
  {
    id: "comm-badge-2",
    name: "Conversation Starter",
    description: "Started 10 engaging discussions",
    image: "/images/badges/conversation-starter.svg",
    imageUrl: "/images/badges/conversation-starter.svg",
    rarity: "uncommon",
    unlocked: true,
    earned: true
  },
  {
    id: "comm-badge-3",
    name: "Support Network",
    description: "Helped 5 members with their emotional challenges",
    image: "/images/badges/support-network.svg",
    imageUrl: "/images/badges/support-network.svg",
    rarity: "rare",
    unlocked: false
  },
  {
    id: "comm-badge-4",
    name: "Wellness Champion",
    description: "Completed all community wellness challenges",
    image: "/images/badges/wellness-champion.svg",
    imageUrl: "/images/badges/wellness-champion.svg",
    rarity: "legendary",
    unlocked: false
  }
];

// Export aliases to fix import errors
export const mockBadges = mockCommunityBadges;

// Mock data for community challenges
export const mockCommunityChallenges: Challenge[] = [
  {
    id: "comm-challenge-1",
    title: "Group Meditation",
    description: "Participate in a group meditation session",
    points: 100,
    reward: "Meditation Master Badge",
    progress: 3,
    goal: 5,
    status: "active",
    category: "wellness",
    difficulty: "easy"
  },
  {
    id: "comm-challenge-2",
    title: "Emotional Support Network",
    description: "Help 3 community members with their emotional challenges",
    points: 150,
    reward: "Support Network Badge",
    progress: 1,
    goal: 3,
    status: "active",
    category: "social",
    difficulty: "medium"
  },
  {
    id: "comm-challenge-3",
    title: "Wellness Workshop",
    description: "Host or attend a community wellness workshop",
    points: 200,
    reward: "Workshop Facilitator Badge",
    progress: 0,
    goal: 1,
    status: "locked",
    category: "education",
    difficulty: "hard"
  }
];

// Export aliases to fix import errors
export const mockChallenges = mockCommunityChallenges;

// Mock data for community leaderboard
export const mockCommunityLeaderboard: LeaderboardEntry[] = [
  {
    id: "user-1",
    userId: "user-1",
    name: "Marie Laurent",
    username: "marie.laurent",
    points: 850,
    rank: 1,
    avatar: "/images/avatars/avatar-1.jpg",
    score: 850
  },
  {
    id: "user-2",
    userId: "user-2",
    name: "Thomas Dubois",
    username: "thomas.dubois",
    points: 720,
    rank: 2,
    avatar: "/images/avatars/avatar-2.jpg",
    score: 720
  },
  {
    id: "user-3",
    userId: "user-3",
    name: "Sophie Moreau",
    username: "sophie.m",
    points: 685,
    rank: 3,
    avatar: "/images/avatars/avatar-3.jpg",
    score: 685
  },
  {
    id: "user-4",
    userId: "user-4",
    name: "Jean Petit",
    username: "jean.petit",
    points: 590,
    rank: 4,
    avatar: "/images/avatars/avatar-4.jpg",
    score: 590
  },
  {
    id: "user-5",
    userId: "user-5",
    name: "Clara Blanc",
    username: "clara.b",
    points: 520,
    rank: 5,
    avatar: "/images/avatars/avatar-5.jpg",
    score: 520
  }
];

// Export aliases to fix import errors
export const mockLeaderboard = mockCommunityLeaderboard;
