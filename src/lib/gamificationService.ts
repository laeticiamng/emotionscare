
import { Badge, Challenge } from '@/types/gamification';
import { getBadges } from './gamification/badge-service';
import { getChallenges } from './gamification/challenge-service';
import { calculateLevel } from './gamification/level-service';
import { calculateProgressToNextLevel } from './gamification/level-service';
import { EmotionResult } from '@/types/emotion';

export interface GamificationStats {
  level: number;
  points: number;
  nextLevelPoints: number;
  streakDays: number;
  activeChallenges: number;
  completedChallenges: number;
  badges: Badge[];
  totalPoints: number;
  badgesCount: number;
  currentLevel: number;
  progressToNextLevel: number;
  pointsToNextLevel: number;
  lastActivityDate?: string | null;
  challenges: Challenge[];
  recentAchievements: Badge[];
}

/**
 * Get badges by user ID
 * @param userId User ID
 * @returns List of badges
 */
export async function getBadgesForUser(userId: string): Promise<Badge[]> {
  return getBadges(userId);
}

/**
 * Get challenges by user ID
 * @param userId User ID 
 * @returns List of challenges
 */
export async function getChallengesForUser(userId: string): Promise<Challenge[]> {
  return getChallenges(userId);
}

/**
 * Get gamification statistics by user ID
 * @param userId User ID
 * @returns Gamification statistics
 */
export async function getUserGamificationStats(userId: string): Promise<GamificationStats> {
  const badges = await getBadges(userId);
  const challenges = await getChallenges(userId);
  const completedChallenges = challenges.filter(c => c.status === 'completed').length;
  const activeChallenges = challenges.filter(c => c.status === 'active' || c.status === 'ongoing').length;
  const totalPoints = 340; // Mock total points
  const level = calculateLevel(totalPoints);
  const progress = calculateProgressToNextLevel(totalPoints);
  const pointsToNextLevel = calculatePointsToNextLevel(level);

  return {
    level,
    points: totalPoints,
    nextLevelPoints: level * 200,
    streakDays: 5,
    activeChallenges,
    completedChallenges,
    badges,
    totalPoints,
    badgesCount: badges.length,
    currentLevel: level,
    progressToNextLevel: progress,
    pointsToNextLevel,
    lastActivityDate: new Date().toISOString(),
    challenges,
    recentAchievements: badges.slice(0, 3)
  };
}

/**
 * Complete a challenge by ID
 * @param challengeId Challenge ID
 * @returns Updated challenge
 */
export async function completeChallenge(challengeId: string) {
  const challenges = await getChallenges('');
  const challenge = challenges.find(c => c.id === challengeId);
  
  if (!challenge) {
    throw new Error('Challenge not found');
  }
  
  // In a real implementation, this would update the challenge in the database
  return {
    ...challenge,
    status: 'completed' as const,
    progress: challenge.total || 1,
    completedAt: new Date().toISOString()
  };
}

/**
 * Get challenge by ID
 * @param challengeId Challenge ID
 * @returns Challenge
 */
export function getChallengeById(challengeId: string) {
  return getChallenges('').then(challenges => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    return challenge;
  });
}

/**
 * Get badge by ID
 * @param badgeId Badge ID
 * @returns Badge
 */
export function getBadgeById(badgeId: string) {
  return getBadges('').then(badges => {
    const badge = badges.find(b => b.id === badgeId);
    if (!badge) {
      throw new Error('Badge not found');
    }
    return badge;
  });
}

/**
 * Calculate points needed to reach next level
 * @param currentLevel Current level
 * @returns Points needed
 */
export function calculatePointsToNextLevel(currentLevel: number): number {
  return (currentLevel + 1) * 100;
}

/**
 * Process emotion results for potential badges
 * @param userId User ID
 * @param emotion Emotion result
 * @returns Array of earned badges
 */
export async function processEmotionForBadges(userId: string, emotion: EmotionResult): Promise<Badge[]> {
  // Mock implementation - in real app would check if emotion qualifies for badges
  console.log(`Processing emotion for badges: ${userId}`, emotion);
  return [];
}
