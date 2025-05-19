
// For fixing imports conflicts, we'll rename the imported Badge type
import { Badge as BadgeType } from '@/types/badge';

// In-memory storage for badges
let badges: BadgeType[] = [];

// Add a badge
export function addBadge(badge: Omit<BadgeType, 'id'>): BadgeType {
  const newBadge: BadgeType = {
    id: `badge-${Date.now()}`,
    ...badge as any
  };
  
  badges.push(newBadge);
  return newBadge;
}

// Get all badges
export function getAllBadges(): BadgeType[] {
  return [...badges];
}

// Get badges by user
export function getBadgesByUser(userId: string): BadgeType[] {
  return badges.filter(badge => badge.user_id === userId);
}

// Get badges by category
export function getBadgesByCategory(category: string): BadgeType[] {
  return badges.filter(badge => badge.category === category);
}

// Get badge by ID
export function getBadgeById(id: string): BadgeType | undefined {
  return badges.find(badge => badge.id === id);
}

// Export getBadges for compatibility
export const getBadges = getAllBadges;

// Badge service object
const badgeService = {
  addBadge,
  getAllBadges,
  getBadgesByUser,
  getBadgesByCategory,
  getBadgeById,
  getBadges
};

export default badgeService;
