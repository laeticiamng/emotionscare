
import { Badge, Challenge } from '@/types';

// Define BadgeResponse interface
export interface BadgeResponse {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  category: string;
  unlocked: boolean;
}

// Sample badges with proper structure
const mockBadges: Badge[] = [
  {
    id: "1",
    user_id: "1",
    name: "Premier pas",
    description: "Compléter votre premier scan émotionnel",
    image_url: "/badges/first-scan.svg",
    icon_url: "/badges/icons/scan-icon.svg",
    icon: "award",     // Added required field
    level: 1,          // Added required field
    category: "scan",
    unlocked: true,
    awarded_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    threshold: 1
  },
  {
    id: "2",
    user_id: "1",
    name: "Semaine positive",
    description: "Maintenir un score de bien-être au-dessus de 75% pendant 7 jours consécutifs",
    image_url: "/badges/positive-week.svg",
    icon_url: "/badges/icons/positive-icon.svg",
    icon: "sun",        // Added required field
    level: 2,           // Added required field
    category: "streak",
    unlocked: false,
    awarded_at: new Date().toISOString(),
    threshold: 7
  },
  {
    id: "3",
    user_id: "1",
    name: "Coach en herbe",
    description: "Compléter 5 discussions avec le coach",
    image_url: "/badges/coach-apprentice.png",
    icon_url: "/badges/icons/coach-apprentice.svg",
    icon: "message-circle",  // Added required field
    level: 1,                // Added required field
    category: "coach",
    unlocked: false,
    awarded_at: new Date().toISOString(),
    threshold: 5
  }
];

// Sample challenges with proper structure
const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Fièvre écriture",
    description: "Écrire dans votre journal pendant 3 jours consécutifs",
    points: 100,
    completed: false,
    progress: 1,
    total: 3,
    category: "journal",
  },
  {
    id: "2",
    title: "Série de méditation",
    description: "Compléter 5 sessions de méditation VR",
    points: 200,
    completed: false,
    progress: 3,
    total: 5,
    category: "vr",
  },
  {
    id: "3",
    title: "Expert émotionnel",
    description: "Atteindre un score de bien-être de 90% ou plus",
    points: 500,
    completed: false,
    progress: 82,
    total: 90,
    category: "scan",
  }
];

// Get badges for a user
export const getUserBadges = async (userId: string): Promise<Badge[]> => {
  // In a real app, this would be an API call
  return mockBadges;
};

// Check if user unlocked new badges
export const checkBadgeUnlocks = async (userId: string, action: string): Promise<Badge | null> => {
  // In a real app, this would be an API call
  return null;
};

// Mock function to get badge details
export const getBadgeDetails = async (badgeId: string): Promise<BadgeResponse | null> => {
  const badge = mockBadges.find(b => b.id === badgeId);
  if (!badge) return null;
  
  return {
    id: badge.id,
    name: badge.name,
    description: badge.description,
    image_url: badge.image_url,
    category: badge.category,
    unlocked: badge.unlocked
  };
};

// Add these missing functions that GamificationPage.tsx is trying to use
export const fetchBadges = async (): Promise<{all: Badge[], earned: Badge[]}> => {
  // In a real app, this would be an API call
  const earned = mockBadges.filter(badge => badge.unlocked);
  return {
    all: mockBadges,
    earned
  };
};

export const fetchChallenges = async (): Promise<Challenge[]> => {
  // In a real app, this would be an API call
  return mockChallenges;
};

// Complete a challenge
export const completeChallenge = async (userId: string, challengeId: string): Promise<boolean> => {
  // In a real app, this would be an API call
  console.log(`Challenge ${challengeId} marked as completed for user ${userId}`);
  return true; // Return a boolean to indicate success
};

// Track challenge progress
export const trackChallengeProgress = async (userId: string, actionType: string, value: number = 1): Promise<Challenge | null> => {
  // In a real app, this would update challenge progress and return if any challenge was updated
  return null;
};
