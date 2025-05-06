
import { Badge } from "@/types";

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
