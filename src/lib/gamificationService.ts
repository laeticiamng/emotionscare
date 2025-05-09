
import { v4 as uuidv4 } from 'uuid';
import { Challenge, Badge } from '@/types';

// Mock challenges
let challenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Premier scan émotionnel',
    description: 'Réalisez votre premier scan émotionnel',
    points: 10,
    completed: false,
    category: 'scan',
    difficulty: 'easy',
    image_url: '/images/badges/first-scan.svg',
  },
  {
    id: 'challenge-2',
    title: 'Journal régulier',
    description: 'Écrivez dans votre journal 3 jours de suite',
    points: 20,
    completed: false,
    category: 'journal',
    difficulty: 'medium',
    image_url: '/images/badges/journal-streak.svg',
  }
];

// Mock badges
const badges: Badge[] = [
  {
    id: 'badge-1',
    user_id: 'user-1',
    name: 'Explorer émotionnel',
    description: 'Vous avez complété votre premier scan émotionnel',
    image_url: '/images/badges/emotional-explorer.svg',
    level: 1,
    progress: 100,
    threshold: 100,
    unlocked: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'badge-2',
    user_id: 'user-1',
    name: 'Journal extraordinaire',
    description: 'Vous avez écrit 10 entrées de journal',
    image_url: '/images/badges/journal-master.svg',
    level: 1,
    progress: 60,
    threshold: 100,
    unlocked: false,
    created_at: new Date().toISOString()
  }
];

/**
 * Get all challenges
 */
export const getChallenges = async (): Promise<Challenge[]> => {
  return challenges;
};

/**
 * Complete a challenge
 */
export const completeChallenge = async (challengeId: string): Promise<Challenge> => {
  const challenge = challenges.find(c => c.id === challengeId);
  
  if (!challenge) {
    throw new Error(`Challenge with ID ${challengeId} not found`);
  }
  
  challenge.completed = true;
  return challenge;
};

/**
 * Get user badges
 */
export const getUserBadges = async (userId: string): Promise<Badge[]> => {
  return badges.filter(badge => badge.user_id === userId);
};

/**
 * Award a badge to a user
 */
export const awardBadge = async (userId: string, badgeData: Partial<Badge>): Promise<Badge> => {
  const newBadge: Badge = {
    id: uuidv4(),
    user_id: userId,
    name: badgeData.name || 'Badge sans nom',
    description: badgeData.description || 'Description du badge',
    image_url: badgeData.image_url || '/images/badges/default.svg',
    level: badgeData.level || 1,
    progress: badgeData.progress || 0,
    threshold: badgeData.threshold || 100,
    unlocked: badgeData.unlocked || false,
    created_at: new Date().toISOString()
  };
  
  badges.push(newBadge);
  return newBadge;
};
