
import { Badge } from '@/types/gamification';
import { getBadges } from './gamification/badge-service';
import { getChallenges } from './gamification/challenge-service';
import { calculateLevel, getProgressToNextLevel, calculateXpToNextLevel } from './gamification/level-service';

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
}

/**
 * Get badges by user ID
 * @param userId User ID
 * @returns List of badges
 */
export async function getBadgesByUserId(userId: string): Promise<Badge[]> {
  return getBadges();
}

/**
 * Get gamification statistics by user ID
 * @param userId User ID
 * @returns Gamification statistics
 */
export async function getGamificationStatsByUserId(userId: string): Promise<GamificationStats> {
  const badges = await getBadges();
  const challenges = await getChallenges();
  const completedChallenges = challenges.filter(c => c.status === 'completed').length;
  const activeChallenges = challenges.filter(c => c.status === 'active' || c.status === 'ongoing').length;
  const totalPoints = 340; // Mock total points
  const level = calculateLevel(totalPoints);
  const progress = getProgressToNextLevel(totalPoints);
  const pointsToNextLevel = calculateXpToNextLevel(level);

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
    pointsToNextLevel
  };
}

/**
 * Complete a challenge by ID
 * @param challengeId Challenge ID
 * @returns Updated challenge
 */
export async function completeChallenge(challengeId: string) {
  const challenges = await getChallenges();
  const challenge = challenges.find(c => c.id === challengeId);
  
  if (!challenge) {
    throw new Error('Challenge not found');
  }
  
  // In a real implementation, this would update the challenge in the database
  return {
    ...challenge,
    status: 'completed',
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
  return getChallenges().then(challenges => {
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
  return getBadges().then(badges => {
    const badge = badges.find(b => b.id === badgeId);
    if (!badge) {
      throw new Error('Badge not found');
    }
    return badge;
  });
}
