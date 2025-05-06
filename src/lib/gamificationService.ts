
import { Badge } from "@/types";
import { Challenge, UserChallenge, UserBadge } from "@/types/gamification";

// Get all badges for a user
export const getUserBadges = async (userId: string): Promise<Badge[]> => {
  // In a real app, this would be a fetch call to your API
  return mockBadges.filter(badge => badge.user_id === userId);
};

// Check if user has earned any new badges
export const checkForNewBadges = async (userId: string): Promise<Badge[]> => {
  // Mock logic for badge earning
  const existingBadges = await getUserBadges(userId);
  const newBadges: Badge[] = [];
  
  // This would contain real logic in a production app
  return newBadges;
};

// Mock badges data
const mockBadges: Badge[] = [
  {
    id: "1",
    user_id: "user1",
    name: "Premier pas",
    description: "Première utilisation de l'application",
    icon_url: "/badges/first-steps.svg",
    threshold: 1,
    awarded_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "user1",
    name: "Explorateur",
    description: "A visité toutes les sections de l'application",
    icon_url: "/badges/explorer.svg",
    threshold: 5,
    awarded_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "user2",
    name: "Journal intime",
    description: "A complété 5 entrées de journal",
    icon_url: "/badges/journal.svg",
    threshold: 5,
    awarded_at: new Date().toISOString(),
  }
];

// Calculate progress for a specific badge type
export const calculateBadgeProgress = (
  userId: string, 
  badgeType: string, 
  currentValue: number
): number => {
  // This would calculate real progress in a production app
  return Math.min(100, (currentValue / 5) * 100);
};

// Mock challenges data
const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Première émotion",
    description: "Enregistrez votre première émotion",
    points: 10
  },
  {
    id: "2",
    title: "Journal quotidien",
    description: "Écrivez une entrée dans votre journal",
    points: 5
  },
  {
    id: "3",
    title: "Session de méditation",
    description: "Complétez une session VR de méditation",
    points: 15
  }
];

// Mock user challenges data
const mockUserChallenges: UserChallenge[] = [];

// Fetch all available challenges
export const fetchChallenges = async (): Promise<Challenge[]> => {
  // In a real app, this would fetch from an API
  return mockChallenges;
};

// Fetch user-specific challenge progress
export const fetchUserChallenges = async (userId: string): Promise<UserChallenge[]> => {
  // In a real app, this would fetch from an API with the user ID
  return mockUserChallenges.filter(uc => uc.user_id === userId);
};

// Complete a challenge for a user
export const completeChallenge = async (challengeData: UserChallenge): Promise<UserChallenge> => {
  // In a real app, this would be a POST request to an API
  const newChallenge = {
    ...challengeData,
    id: `uc-${Date.now()}`
  };
  
  mockUserChallenges.push(newChallenge);
  return newChallenge;
};

// Mock data for earned badges
const mockEarnedBadges: UserBadge[] = [];

// Fetch all badges and user's earned badges
export const fetchBadges = async (userId: string) => {
  // In a real app, this would fetch from an API
  const allBadges = mockBadges; // All possible badges
  const earnedBadges = mockEarnedBadges.filter(eb => eb.user_id === userId);
  
  return {
    all: allBadges,
    earned: earnedBadges
  };
};
