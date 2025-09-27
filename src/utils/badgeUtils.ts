
import { Badge } from '@/types/badge';

/**
 * Normalizes a badge object to handle different property names
 * across different parts of the application
 */
export function normalizeBadge(badge: any): Badge {
  return {
    id: badge.id,
    name: badge.name || badge.title || 'Unknown',
    description: badge.description || '',
    image: badge.image || badge.imageUrl || badge.image_url || badge.icon,
    earned: badge.earned || badge.achieved || badge.unlocked || false,
    category: badge.category || 'general',
    icon: badge.icon || '',
    points: badge.points || 0,
    prerequisites: badge.prerequisites || [],
    user_id: badge.user_id || badge.userId || '',
    date_earned: badge.date_earned || badge.dateAwarded || badge.unlockedAt || badge.timestamp || ''
  };
}

/**
 * Normalizes an array of badges
 */
export function normalizeBadges(badges: any[]): Badge[] {
  return badges.map(normalizeBadge);
}
