
import { Badge } from '@/types/gamification';

export const getBadges = async (userId: string): Promise<Badge[]> => {
  // Mock implementation - fetching badges for a specific user
  return [
    {
      id: '1',
      name: 'Premier pas',
      description: 'Première émotion enregistrée',
      image: '/badges/first-step.png',
      imageUrl: '/badges/first-step.png',
      unlockedAt: new Date().toISOString(),
      category: 'achievement'
    },
    {
      id: '2',
      name: 'Explorateur émotionnel',
      description: '5 émotions différentes enregistrées',
      image: '/badges/explorer.png',
      imageUrl: '/badges/explorer.png',
      unlockedAt: new Date().toISOString(),
      category: 'exploration'
    }
  ];
};

export const unlockBadge = async (userId: string, badgeId: string): Promise<boolean> => {
  console.log(`Unlocking badge ${badgeId} for user ${userId}`);
  // Mock successful unlock
  return true;
};

// Add the missing evaluateBadgesForUser function
export const evaluateBadgesForUser = async (userId: string): Promise<Badge[]> => {
  // Mock implementation that evaluates if a user earned any new badges
  return [];
};
