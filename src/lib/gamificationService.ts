
import { Badge, Challenge } from '@/types';

// Mock badges
const mockBadges: Badge[] = [
  {
    id: '1',
    user_id: 'user1',
    name: 'Premier scan',
    description: 'Effectuer son premier scan émotionnel',
    image_url: '/badges/first-scan.png',
    icon_url: '/badges/icons/first-scan.svg',
    category: 'scan',
    unlocked: true,
    awarded_at: '2023-05-10T14:28:00.000Z'
  },
  {
    id: '2',
    user_id: 'user1',
    name: 'Coach en herbe',
    description: 'Compléter 5 discussions avec le coach',
    image_url: '/badges/coach-apprentice.png',
    icon_url: '/badges/icons/coach-apprentice.svg',
    category: 'coach',
    unlocked: false,
    threshold: 5
  }
];

// Get badges for a user
export const getUserBadges = async (userId: string): Promise<Badge[]> => {
  // In a real app, this would be an API call
  return mockBadges;
};

// Check if user unlocked new badges
export const checkBadgeUnlocks = async (userId: string, action: string): Promise<Badge | null> => {
  // In a real app, this would be an API call
  return null;
};

// Mock function to get badge details
export const getBadgeDetails = async (badgeId: string): Promise<BadgeResponse | null> => {
  const badge = mockBadges.find(b => b.id === badgeId);
  if (!badge) return null;
  
  return {
    id: badge.id,
    name: badge.name,
    description: badge.description,
    image_url: badge.image_url,
    category: badge.category,
    unlocked: badge.unlocked
  };
};

// Get active challenges
export const getActiveChallenges = async (userId: string): Promise<Challenge[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 'c1',
      title: 'Semaine du bien-être',
      description: 'Effectuez un scan émotionnel chaque jour pendant une semaine',
      points: 100,
      progress: 4,
      total: 7,
      completed: false,
      category: 'scan',
      requirements: ['Scan quotidien', 'Seuil de bien-être > 60%']
    },
    {
      id: 'c2',
      title: 'Master du journal',
      description: 'Écrivez dans votre journal 3 jours consécutifs',
      points: 75,
      progress: 2,
      total: 3,
      completed: false,
      category: 'journal',
      requirements: ['Entrée quotidienne', 'Minimum 50 mots']
    },
    {
      id: 'c3',
      title: 'Expert VR',
      description: 'Complétez 5 sessions VR différentes',
      points: 150,
      progress: 3,
      total: 5,
      completed: false,
      category: 'vr',
      requirements: ['Sessions uniques', 'Durée minimale 5 minutes']
    }
  ];
};

// Complete a challenge
export const completeChallenge = async (userId: string, challengeId: string): Promise<void> => {
  // In a real app, this would be an API call
  console.log(`Challenge ${challengeId} marked as completed for user ${userId}`);
};

// Track challenge progress
export const trackChallengeProgress = async (userId: string, actionType: string, value: number = 1): Promise<Challenge | null> => {
  // In a real app, this would update challenge progress and return if any challenge was updated
  return null;
};
