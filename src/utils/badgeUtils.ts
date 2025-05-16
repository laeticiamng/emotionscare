
import { Badge } from '@/types/gamification';

/**
 * Normalizes badge data to ensure it conforms to the Badge interface
 * This is particularly useful when dealing with data from different sources
 * that might have different property names for the same concept
 */
export const normalizeBadge = (badge: any): Badge => {
  const imageUrl = badge.imageUrl || badge.image_url || badge.image || badge.icon_url || '';
  
  return {
    id: badge.id,
    name: badge.name,
    description: badge.description,
    imageUrl: imageUrl,
    image: imageUrl, // Backward compatibility
    image_url: imageUrl, // Backward compatibility
    icon_url: imageUrl, // Backward compatibility
    category: badge.category,
    tier: badge.tier || 'bronze',
    unlockedAt: badge.unlockedAt,
    completed: badge.completed || badge.unlocked || false,
    progress: badge.progress,
    level: badge.level,
    unlocked: badge.completed || badge.unlocked || false, // Backward compatibility
  };
};

/**
 * Normalizes an array of badges
 */
export const normalizeBadges = (badges: any[]): Badge[] => {
  return badges.map(normalizeBadge);
};
