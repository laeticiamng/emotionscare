
import { Badge } from '@/types/gamification';

// Example badge service for handling badges
export const BadgeService = {
  getBadgesForUser: async (userId: string): Promise<Badge[]> => {
    // This would typically fetch from an API
    return [
      {
        id: 'badge-1',
        name: 'First Login',
        description: 'You logged in for the first time',
        category: 'general',
        image: '/badges/first-login.png',
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        user_id: userId
      },
      {
        id: 'badge-2',
        name: 'Emotion Explorer',
        description: 'You discovered 5 different emotions',
        category: 'emotion',
        image: '/badges/emotion-explorer.png',
        unlocked: false,
        progress: 3,
        threshold: 5,
        user_id: userId
      }
    ];
  },

  unlockBadge: async (userId: string, badgeId: string): Promise<Badge> => {
    // This would typically call an API
    return {
      id: badgeId,
      name: 'Newly Unlocked Badge',
      description: 'This badge was just unlocked',
      category: 'achievement',
      image: '/badges/achievement.png',
      unlocked: true,
      unlockedAt: new Date().toISOString(),
      user_id: userId
    };
  },

  // Additional badge-related functions
};

export default BadgeService;
