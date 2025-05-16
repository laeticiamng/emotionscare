import { Badge } from '@/types/gamification';

/**
 * Normalizes badge data to ensure consistent property access
 * This handles different image URL formats and ensures required properties are present
 */
export const normalizeBadges = (badges: Partial<Badge>[]): Badge[] => {
  return badges.map(badge => {
    // Ensure required properties
    const normalizedBadge: Badge = {
      id: badge.id || `badge-${Math.random().toString(36).substring(2, 9)}`,
      name: badge.name || 'Badge',
      description: badge.description || '',
      category: badge.category || 'achievement',
      tier: (badge.tier || 'bronze') as any,
      
      // Handle various image URL formats
      imageUrl: badge.imageUrl || badge.image_url || badge.image || badge.icon_url || '',
      
      // Other properties with defaults
      completed: badge.completed || false,
      progress: badge.progress || 0,
      unlocked: badge.unlocked || false
    };
    
    return normalizedBadge;
  });
};

// Define visible badges for the dashboard
export const visibleBadges = [
  {
    id: "1",
    name: "Premier pas",
    description: "Premier jour sur la plateforme",
    imageUrl: "/badges/first-day.svg",
    category: "milestone",
    tier: "bronze",
    unlockedAt: "2023-05-10T12:00:00Z",
    completed: true
  },
  {
    id: "2",
    name: "Journal émotionnel",
    description: "Écrit dans le journal 5 jours consécutifs",
    imageUrl: "/badges/journal.png",
    category: "journal",
    tier: "silver",
    unlockedAt: "2023-04-15",
    completed: true
  },
  {
    id: "3",
    name: "Mélomane",
    description: "Écoute 10 sessions de musique différentes",
    imageUrl: "/badges/music.png",
    category: "music",
    tier: "gold",
    progress: 70,
    completed: false
  }
];
