
import { EmotionResult } from '@/types';
import { Badge } from '@/types/gamification';

interface BadgeResult {
  points: number;
  newBadges: Badge[];
  challengesUpdated: any[];
}

/**
 * Process emotion data for badges and gamification
 * @param userId User ID
 * @param result Emotion result data
 * @returns Object with badges earned and points
 */
export const processEmotionForBadges = async (userId: string, result: EmotionResult): Promise<BadgeResult> => {
  console.log(`Processing emotion for badges: ${userId}`, result);
  
  // Mock implementation - in a real app this would call the backend
  const mockBadges: Badge[] = [];
  
  // Example badge for logging 1st emotion
  if (Math.random() > 0.7) {
    mockBadges.push({
      id: `badge-${Date.now()}`,
      name: "Premier pas émotionnel",
      description: "Vous avez enregistré votre première émotion",
      imageUrl: "/badges/first-emotion.svg",
      unlockedAt: new Date().toISOString()
    });
  }
  
  return {
    points: 10,
    newBadges: mockBadges,
    challengesUpdated: []
  };
};

/**
 * Fetch user challenges
 * @param userId User ID
 * @param status Optional status filter
 * @returns Array of challenges
 */
export const fetchChallenges = async (userId: string, status?: string) => {
  console.log(`Fetching challenges for user: ${userId}, status: ${status}`);
  // Mock implementation
  return [];
};

/**
 * Sync gamification data
 * @param userId User ID
 * @returns Updated gamification stats
 */
export const syncGamificationData = async (userId: string) => {
  console.log(`Syncing gamification data for user: ${userId}`);
  // Mock implementation
  return {
    points: 120,
    level: 2,
    badges: [],
    completedChallenges: 3,
    activeChallenges: 2,
    streakDays: 5,
    nextLevelPoints: 200,
    progressToNextLevel: 60,
    challenges: [],
    recentAchievements: []
  };
};
