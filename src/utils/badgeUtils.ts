
import { Badge } from '@/types/badge';

/**
 * Normalize badge properties to handle different property names across components
 */
export const normalizeBadge = (badge: any): Badge => {
  return {
    id: badge.id,
    name: badge.name,
    description: badge.description,
    imageUrl: badge.imageUrl || badge.image_url || badge.image || badge.icon_url || '',
    earned: badge.earned || badge.unlocked || badge.achieved || !!badge.earnedAt || !!badge.unlockedAt || !!badge.unlocked_at || false,
    progress: badge.progress || 0,
    earnedAt: badge.earnedAt || badge.unlockedAt || badge.unlocked_at || badge.dateEarned,
    isNew: badge.isNew || false,
    category: badge.category || '',
    tier: badge.tier || 'bronze',
    threshold: badge.threshold || badge.total || 100
  };
};

/**
 * Normalize an array of badges
 */
export const normalizeBadges = (badges: any[]): Badge[] => {
  return badges.map(normalizeBadge);
};
