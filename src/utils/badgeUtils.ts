
import { Badge } from '@/types/badge';

/**
 * Normalizes a badge object to ensure all required properties are present
 */
export function normalizeBadge(badge: any): Badge {
  return {
    id: badge.id || `badge-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: badge.name || 'Unknown Badge',
    description: badge.description || 'No description',
    imageUrl: badge.imageUrl || badge.image_url || badge.icon || '/badges/default.png',
    image_url: badge.image_url || badge.imageUrl || badge.icon || '/badges/default.png',
    unlocked: badge.unlocked || badge.completed || !!badge.unlockedAt || !!badge.unlocked_at || false,
    level: badge.level || 1,
    tier: badge.tier || 'bronze',
    progress: badge.progress !== undefined ? badge.progress : 0,
    threshold: badge.threshold !== undefined ? badge.threshold : 100,
    completed: badge.completed || badge.unlocked || false,
    category: badge.category || 'general',
    earned: badge.earned || badge.achieved || badge.unlocked || false,
    rarity: badge.rarity || 'common',
    icon: badge.icon || badge.imageUrl || badge.image_url || '/badges/default.png',
  };
}

/**
 * Normalizes an array of badge objects
 */
export function normalizeBadges(badges: any[]): Badge[] {
  return badges.map(normalizeBadge);
}
