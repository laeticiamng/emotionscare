
import { Badge, Challenge, GamificationStats, LeaderboardEntry } from '@/types/gamification';
import { getBadges, getBadgeById } from './gamification/badge-service';
import { getChallenges, getChallengeById } from './gamification/challenge-service';
import { getUserStats } from './gamification/stats-service';
import { EmotionResult } from '@/types/emotion';
import { v4 as uuidv4 } from 'uuid';

// Process emotions to award badges
export async function processEmotionForBadges(userId: string, emotionResult: EmotionResult): Promise<Badge[]> {
  // This is a mock implementation that would normally call a backend API
  console.log(`Processing emotion for badges: ${emotionResult.dominantEmotion?.name} for user ${userId}`);
  
  const awardedBadges: Badge[] = [];
  
  // Simulate a badge award for consistent emotional check-ins
  if (Math.random() > 0.7) {
    const badge: Badge = {
      id: uuidv4(),
      name: 'Explorateur émotionnel',
      description: 'Effectuer sa première analyse émotionnelle',
      imageUrl: '/assets/badges/emotion-explorer.svg',
      unlockedAt: new Date().toISOString()
    };
    
    awardedBadges.push(badge);
  }
  
  // Add more emotion-related badge award logic here
  
  return awardedBadges;
}

// Mocked implementations for gamification services
export const completeChallenge = async (userId: string, challengeId: string): Promise<boolean> => {
  console.log(`Completing challenge ${challengeId} for user ${userId}`);
  
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would call a backend API
  return true;
};

export const updateChallengeProgress = async (
  userId: string, 
  challengeId: string, 
  progress: number
): Promise<boolean> => {
  console.log(`Updating challenge ${challengeId} progress to ${progress}% for user ${userId}`);
  
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real implementation, this would call a backend API
  return true;
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Return mock leaderboard data
  return [
    {
      userId: '1',
      name: 'Marie Dubois',
      avatarUrl: '/assets/avatars/user1.jpg',
      points: 1250,
      level: 5,
      position: 1,
      badges: 12,
      completedChallenges: 8
    },
    {
      userId: '2',
      name: 'Thomas Martin',
      avatarUrl: '/assets/avatars/user2.jpg',
      points: 980,
      level: 4,
      position: 2,
      badges: 9,
      completedChallenges: 7
    },
    {
      userId: '3',
      name: 'Sophie Petit',
      avatarUrl: '/assets/avatars/user3.jpg',
      points: 870,
      level: 4,
      position: 3,
      badges: 8,
      completedChallenges: 6
    }
  ];
};

export const awardPoints = async (userId: string, points: number, reason: string): Promise<number> => {
  console.log(`Awarding ${points} points to user ${userId} for ${reason}`);
  
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real implementation, this would call a backend API and return new total
  return 1000 + points; // Mock return of new total points
};

export const calculateLevel = (points: number): number => {
  // Simple level calculation based on points
  return Math.floor(Math.sqrt(points / 100)) + 1;
};

export const getUserGamificationStats = async (userId: string): Promise<GamificationStats> => {
  // Fetch challenges and badges
  const challenges = await getChallenges();
  const badges = await getBadges();
  
  // Generate stats with sample data
  return {
    points: 850,
    level: 4,
    nextLevelPoints: 1000,
    badges: badges.slice(0, 5), // First 5 badges as if earned
    completedChallenges: 6,
    activeChallenges: 3,
    streakDays: 8,
    progressToNextLevel: 85,
    totalPoints: 850,
    currentLevel: 4,
    badgesCount: 5,
    pointsToNextLevel: 150,
    lastActivityDate: new Date().toISOString(),
    challenges: challenges.slice(0, 3), // First 3 challenges as active
    recentAchievements: badges.slice(0, 2) // First 2 badges as recent
  };
};

export { getBadges, getChallenges, getUserStats };
