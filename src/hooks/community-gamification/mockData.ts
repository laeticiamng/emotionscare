
import { Badge, Challenge, LeaderboardEntry } from '@/types/badge';

// Mock challenges data
export const mockChallenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Streak héroïque",
    description: "Maintenez une utilisation quotidienne pendant 7 jours",
    points: 150,
    reward: "Écusson de persévérance",
    progress: 5,
    goal: 7,
    status: "active",
    category: "engagement",
    unlocked: true,
    totalSteps: 7,
    name: "Streak héroïque"
  },
  {
    id: "challenge-2",
    title: "Explorateur émotionnel",
    description: "Identifiez 5 émotions différentes dans un délai de 3 jours",
    points: 200,
    reward: "Badge d'intelligence émotionnelle",
    progress: 3,
    goal: 5,
    status: "active",
    category: "émotion",
    unlocked: true,
    totalSteps: 5,
    name: "Explorateur émotionnel"
  },
  {
    id: "challenge-3",
    title: "Journaliste assidu",
    description: "Complétez 10 entrées de journal en utilisant des émojis expressifs",
    points: 300,
    reward: "Badge de réflexion profonde",
    progress: 2,
    goal: 10,
    status: "active",
    category: "journal",
    unlocked: true,
    totalSteps: 10,
    name: "Journaliste assidu"
  }
];

// Mock badges data
export const mockBadges: Badge[] = [
  {
    id: "badge-1",
    name: "Premier pas",
    description: "Première connexion à l'application",
    image: "/images/badges/first-step.png",
    unlocked: true,
    rarity: "common",
    tier: "bronze"
  },
  {
    id: "badge-2",
    name: "Observateur attentif",
    description: "Identifiez 3 émotions différentes",
    image: "/images/badges/observer.png",
    unlocked: true,
    rarity: "uncommon",
    tier: "silver"
  },
  {
    id: "badge-3",
    name: "Maître zen",
    description: "Complétez 5 séances de méditation",
    image: "/images/badges/zen-master.png",
    unlocked: false,
    progress: 3,
    rarity: "rare",
    tier: "gold"
  }
];

// Mock leaderboard data
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: "user-1",
    userId: "user-1",
    name: "Marie L.",
    points: 1250,
    rank: 1,
    avatar: "/images/avatars/user-1.jpg",
    badges: mockBadges.slice(0, 2)
  },
  {
    id: "user-2",
    userId: "user-2",
    name: "Thomas R.",
    points: 980,
    rank: 2,
    avatar: "/images/avatars/user-2.jpg",
    badges: mockBadges.slice(0, 1)
  },
  {
    id: "user-3",
    userId: "user-3",
    name: "Sophie G.",
    points: 870,
    rank: 3,
    avatar: "/images/avatars/user-3.jpg",
    badges: mockBadges.slice(1, 2)
  },
  {
    id: "user-4",
    userId: "user-4",
    name: "Vous",
    points: 750,
    rank: 4,
    avatar: "/images/avatars/default.jpg",
    badges: mockBadges.slice(0, 1)
  }
];

export const mockCommunityBadges = mockBadges;
export const mockCommunityChallenges = mockChallenges;
