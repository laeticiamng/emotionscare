
import { EmotionResult } from '@/types';
import { Badge, Challenge, GamificationStats } from '@/types/gamification';

/**
 * Process emotion data for badges and gamification
 * @param userId User ID
 * @param result Emotion result data
 * @returns Object with badges earned and points
 */
export const processEmotionForBadges = async (userId: string, result: EmotionResult): Promise<{ points: number; newBadges: Badge[]; challengesUpdated: any[] }> => {
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
export const fetchChallenges = async (userId: string, status?: string): Promise<Challenge[]> => {
  console.log(`Fetching challenges for user: ${userId}, status: ${status}`);
  // Mock implementation
  return [];
};

/**
 * Fetch gamification stats
 * @param userId User ID
 * @returns Gamification stats
 */
export const fetchGamificationStats = async (userId: string): Promise<GamificationStats> => {
  console.log(`Fetching gamification stats for user: ${userId}`);
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

/**
 * Sync gamification data
 * @param userId User ID
 * @returns Updated gamification stats
 */
export const syncGamificationData = async (userId: string): Promise<GamificationStats> => {
  return fetchGamificationStats(userId);
};

/**
 * Get user gamification stats
 * @param userId User ID
 * @returns User gamification stats
 */
export const getUserGamificationStats = async (userId: string): Promise<GamificationStats> => {
  return fetchGamificationStats(userId);
};
