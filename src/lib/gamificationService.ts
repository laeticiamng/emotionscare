
import { Badge, Challenge } from '@/types/gamification';
import { getBadges } from './gamification/badge-service';
import { getChallenges } from './gamification/challenge-service';
import { getGamificationStats } from './gamification/stats-service';
import { Emotion, EmotionResult } from '@/types/emotion';

// Re-export functions from gamification modules
export {
  getBadges,
  getChallenges,
  getGamificationStats
};

// Define missing functions
export const getBadgesForUser = getBadges;
export const getAllBadges = async (): Promise<Badge[]> => {
  // This would normally fetch all available badges
  return getBadges('system');
};

export const getChallengesForUser = getChallenges;
export const getAllChallenges = async (): Promise<Challenge[]> => {
  // This would normally fetch all available challenges
  return getChallenges('system');
};

export const getUserStats = getGamificationStats;

export const processEmotionForBadges = async (
  userId: string, 
  emotionResult: EmotionResult
): Promise<Badge[]> => {
  // Mock implementation that would process an emotion and return any badges earned
  console.log(`Processing emotion ${emotionResult.emotion || emotionResult.dominantEmotion?.name} for user ${userId}`);
  
  // Return empty array for now - no badges earned
  return [];
};

export const completeChallenge = async (challengeId: string): Promise<boolean> => {
  console.log(`Completing challenge ${challengeId}`);
  return true;
};
