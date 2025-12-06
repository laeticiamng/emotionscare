
import { Badge } from '@/types/badge';

/**
 * Compatibilité pour vérifier si un badge est débloqué
 */
export const isBadgeUnlocked = (badge: Badge): boolean => {
  return badge.unlocked === true || badge.achieved === true || badge.earned === true;
};

/**
 * Compatibilité pour obtenir l'URL de l'image du badge
 */
export const getBadgeImageUrl = (badge: Badge): string => {
  return badge.imageUrl || badge.image_url || badge.image || '/badges/default-badge.png';
};

/**
 * Compatibilité pour obtenir la date de déblocage du badge
 */
export const getBadgeUnlockedDate = (badge: Badge): Date | null => {
  const dateStr = badge.date_earned || badge.dateAwarded || badge.unlockedAt || 
                 badge.unlocked_at || badge.timestamp;
                 
  return dateStr ? new Date(dateStr) : null;
};

/**
 * Compatibilité pour obtenir la progression du badge
 */
export const getBadgeProgress = (badge: Badge): { current: number, target: number } => {
  const current = badge.progress || 0;
  const target = badge.threshold || 100;
  
  return { current, target };
};
