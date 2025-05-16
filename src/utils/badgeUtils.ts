
import { Badge } from '@/types/gamification';

/**
 * Normalizes badge data to ensure it conforms to the Badge interface
 * This is particularly useful when dealing with data from different sources
 * that might have different property names for the same concept
 */
export const normalizeBadge = (badge: any): Badge => {
  return {
    id: badge.id,
    name: badge.name,
    description: badge.description,
    imageUrl: badge.imageUrl || badge.image_url || badge.image || badge.icon_url || '',
    category: badge.category,
    tier: badge.tier || 'bronze',
    unlockedAt: badge.unlockedAt,
    completed: badge.completed || badge.unlocked || false,
    progress: badge.progress,
    // Include backward compatibility fields
    image_url: badge.image_url || badge.imageUrl || badge.image || badge.icon_url || '',
    icon_url: badge.icon_url || badge.imageUrl || badge.image_url || badge.image || '',
    image: badge.image || badge.imageUrl || badge.image_url || badge.icon_url || '',
    level: badge.level
  };
};

/**
 * Normalizes an array of badges
 */
export const normalizeBadges = (badges: any[]): Badge[] => {
  return badges.map(normalizeBadge);
};
