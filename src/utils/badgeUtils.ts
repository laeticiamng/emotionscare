import { Badge } from '@/types/badge';

interface RawBadge {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  image_url?: string;
  icon?: string;
  earned?: boolean;
  achieved?: boolean;
  unlocked?: boolean;
  category?: string;
  points?: number;
  prerequisites?: string[];
  user_id?: string;
  userId?: string;
  date_earned?: string;
  dateAwarded?: string;
  unlockedAt?: string;
  timestamp?: string;
}

/**
 * Normalizes a badge object to handle different property names
 * across different parts of the application
 */
export function normalizeBadge(badge: RawBadge): Badge {
  return {
    id: badge.id,
    name: badge.name || badge.title || 'Unknown',
    description: badge.description || '',
    image: badge.image || badge.imageUrl || badge.image_url || badge.icon,
    icon: badge.icon || '',
    category: badge.category || 'general',
    dateEarned: badge.date_earned || badge.dateAwarded || badge.unlockedAt || badge.timestamp || ''
  };
}

/**
 * Normalizes an array of badges
 */
export function normalizeBadges(badges: RawBadge[]): Badge[] {
  return badges.map(normalizeBadge);
}
