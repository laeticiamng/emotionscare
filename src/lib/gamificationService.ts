
import { Badge, Challenge, GamificationStats, LeaderboardEntry } from '@/types/gamification';
import { EmotionResult } from '@/types/emotion';
import { getBadges } from './gamification/badge-service';
import { getChallenges } from './gamification/challenge-service';
import { getUserStats } from './gamification/level-service';
import { mockBadges, mockChallenges, mockStats } from '@/hooks/community-gamification/mockData';

/**
 * Process an emotion scan for potential badges
 */
export const processEmotionForBadges = async (userId: string, emotionResult: EmotionResult): Promise<Badge[]> => {
  // This would typically be an API call to process emotions and award badges
  // For now, we'll just return a mock badge if certain conditions are met
  
  const unlockedBadges: Badge[] = [];
  
  // Example logic: if the emotion is happiness with high intensity, award a badge
  if (
    (emotionResult.dominantEmotion?.name === 'happiness' && emotionResult.dominantEmotion?.intensity > 0.8) ||
    (emotionResult.emotion === 'happiness' && emotionResult.intensity > 0.8)
  ) {
    unlockedBadges.push({
      id: 'joy-seeker',
      name: 'Chercheur de Joie',
      description: 'A ressenti une joie intense',
      imageUrl: '/badges/joy-seeker.png',
      unlockedAt: new Date().toISOString()
    });
  }
  
  // If the user has done 5+ emotion scans, they get the "Emotional Explorer" badge
  // In a real app, we'd check the count of past scans
  const randomChance = Math.random() > 0.7;
  if (randomChance) {
    unlockedBadges.push({
      id: 'emotional-explorer',
      name: 'Explorateur Émotionnel',
      description: 'A complété 5 scans émotionnels',
      imageUrl: '/badges/emotional-explorer.png',
      unlockedAt: new Date().toISOString()
    });
  }
  
  return unlockedBadges;
};

/**
 * Get all badges for a user
 */
export const getBadgesForUser = async (userId: string): Promise<Badge[]> => {
  // In a real app, we'd call an API to get badges for a specific user
  return mockBadges;
};

/**
 * Get all available badges
 */
export const getAllBadges = async (): Promise<Badge[]> => {
  // In a real app, we'd call an API to get all available badges
  return mockBadges;
};

/**
 * Get challenges for a user
 */
export const getChallengesForUser = async (userId: string): Promise<Challenge[]> => {
  // In a real app, we'd call an API to get challenges for a specific user
  return mockChallenges;
};

/**
 * Get all available challenges
 */
export const getAllChallenges = async (): Promise<Challenge[]> => {
  // In a real app, we'd call an API to get all available challenges
  return mockChallenges;
};

/**
 * Get gamification statistics for a user
 */
export const getUserGamificationStats = async (userId: string): Promise<GamificationStats> => {
  // In a real app, we'd call an API to get stats for a specific user
  return mockStats;
};

/**
 * Get leaderboard data
 */
export const getLeaderboard = async (limit = 10): Promise<LeaderboardEntry[]> => {
  // In a real app, we'd call an API to get leaderboard data
  return [
    {
      userId: '1',
      name: 'User 1',
      avatarUrl: '/avatars/user1.jpg',
      points: 1200,
      level: 5,
      position: 1,
      badges: 8,
      completedChallenges: 12
    },
    {
      userId: '2',
      name: 'User 2',
      avatarUrl: '/avatars/user2.jpg',
      points: 950,
      level: 4,
      position: 2,
      badges: 6,
      completedChallenges: 9
    },
    {
      userId: '3',
      name: 'User 3',
      avatarUrl: '/avatars/user3.jpg',
      points: 820,
      level: 4,
      position: 3,
      badges: 5,
      completedChallenges: 7
    }
  ];
};

// Helper function to simplify imports in other files
export const getBadgesById = async (id: string): Promise<Badge | undefined> => {
  const badges = await getBadges("any-user");
  return badges.find(badge => badge.id === id);
};

export const getChallengeById = async (id: string): Promise<Challenge | undefined> => {
  const challenges = await getChallenges("any-user");
  return challenges.find(challenge => challenge.id === id);
};
