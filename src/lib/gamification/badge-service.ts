
import { Badge } from '@/types/gamification';

// Get all badges for a user
export const getBadges = async (userId: string): Promise<Badge[]> => {
  // Mock implementation
  return [
    {
      id: 'badge-1',
      name: 'First Scan',
      description: 'Completed your first emotion scan',
      category: 'engagement',
      image: '/badges/first-scan.png',
      unlocked: true,
      unlockedAt: new Date().toISOString(),
      user_id: userId
    },
    {
      id: 'badge-2',
      name: 'Emotion Master',
      description: 'Identified 10 different emotions',
      category: 'achievement',
      image: '/badges/emotion-master.png',
      unlocked: false,
      progress: 4,
      threshold: 10,
      user_id: userId
    }
  ];
};

// Mock function to get a specific badge
export const getBadge = async (badgeId: string): Promise<Badge | null> => {
  const allBadges = await getBadges('mock-user');
  return allBadges.find(badge => badge.id === badgeId) || null;
};

// Mock function to unlock a badge
export const unlockBadge = async (userId: string, badgeId: string): Promise<Badge | null> => {
  // In a real implementation, this would update the database
  console.log(`Unlocking badge ${badgeId} for user ${userId}`);
  
  // Return a mock badge that is now unlocked
  return {
    id: badgeId,
    name: 'Unlocked Badge',
    description: 'This badge has been unlocked',
    category: 'achievement',
    image: '/badges/unlocked.png',
    unlocked: true,
    unlockedAt: new Date().toISOString(),
    user_id: userId
  };
};

export default {
  getBadges,
  getBadge,
  unlockBadge
};
