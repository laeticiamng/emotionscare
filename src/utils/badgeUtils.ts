
import { Badge } from '@/types/gamification';

/**
 * Normalizes a single badge
 */
export const normalizeBadge = (badge: Partial<Badge>): Badge => {
  return {
    id: badge.id || '',
    name: badge.name || '',
    description: badge.description || '',
    category: badge.category || 'general',
    tier: badge.tier || 'bronze',
    imageUrl: badge.imageUrl || badge.image_url || badge.image || badge.icon_url || '',
    unlockedAt: badge.unlockedAt || '',
    unlocked: badge.unlocked || badge.completed || false,
    progress: badge.progress || 0,
  };
};

/**
 * Normalizes an array of badges
 */
export const normalizeBadges = (badges: Partial<Badge>[]): Badge[] => {
  return badges.map(normalizeBadge);
};

/**
 * Filter badges by visibility (unlocked or in progress)
 */
export const visibleBadges = (badges: Badge[]): Badge[] => {
  return badges.filter(badge => badge.unlocked || badge.progress > 0);
};
