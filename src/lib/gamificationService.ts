
import { Badge, Challenge, Achievement } from '@/types/gamification';

// Mock data for challenges
const challenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'First Journal Entry',
    description: 'Create your first journal entry to start tracking your emotional journey.',
    points: 10,
    requirements: ['Create a journal entry'],
    completed: false,
    category: 'journal',
    difficulty: 'easy',
    name: 'First Journal Entry'  // Added name property
  },
  {
    id: 'challenge-2',
    title: 'Complete an Emotion Scan',
    description: 'Complete your first emotion scan to understand your emotional state.',
    points: 15,
    requirements: ['Use the emotion scanner'],
    completed: false,
    category: 'emotions',
    difficulty: 'easy',
    name: 'Complete an Emotion Scan'  // Added name property
  }
];

// Mock data for badges
const badges: Badge[] = [
  {
    id: 'badge-1',
    name: 'Emotion Explorer',
    description: 'Completed 5 emotion scans',
    image_url: '/badges/emotion-explorer.png',
    threshold: 5,
    progress: 2,
    unlocked: false
  },
  {
    id: 'badge-2',
    name: 'Journal Master',
    description: 'Created 10 journal entries',
    image_url: '/badges/journal-master.png',
    threshold: 10,
    progress: 3,
    unlocked: false
  }
];

// Get all challenges
export const getChallenges = async (): Promise<Challenge[]> => {
  return [...challenges];
};

// Get a specific challenge by ID
export const getChallenge = async (id: string): Promise<Challenge | undefined> => {
  return challenges.find(challenge => challenge.id === id);
};

// Complete a challenge
export const completeChallenge = async (id: string): Promise<Challenge | undefined> => {
  const challengeIndex = challenges.findIndex(challenge => challenge.id === id);
  
  if (challengeIndex === -1) {
    return undefined;
  }
  
  challenges[challengeIndex] = {
    ...challenges[challengeIndex],
    completed: true
  };
  
  return challenges[challengeIndex];
};

// Get all badges
export const getBadges = async (): Promise<Badge[]> => {
  return [...badges];
};

// Get a specific badge by ID
export const getBadge = async (id: string): Promise<Badge | undefined> => {
  return badges.find(badge => badge.id === id);
};

// Unlock a badge
export const unlockBadge = async (id: string): Promise<Badge | undefined> => {
  const badgeIndex = badges.findIndex(badge => badge.id === id);
  
  if (badgeIndex === -1) {
    return undefined;
  }
  
  badges[badgeIndex] = {
    ...badges[badgeIndex],
    unlocked: true,
    unlocked_at: new Date().toISOString(),
    progress: badges[badgeIndex].threshold || 1
  };
  
  return badges[badgeIndex];
};

// Update badge progress
export const updateBadgeProgress = async (id: string, progress: number): Promise<Badge | undefined> => {
  const badgeIndex = badges.findIndex(badge => badge.id === id);
  
  if (badgeIndex === -1) {
    return undefined;
  }
  
  const threshold = badges[badgeIndex].threshold || 1;
  const isUnlocked = progress >= threshold;
  
  badges[badgeIndex] = {
    ...badges[badgeIndex],
    progress,
    unlocked: isUnlocked,
    unlocked_at: isUnlocked ? new Date().toISOString() : undefined
  };
  
  return badges[badgeIndex];
};

export default {
  getChallenges,
  getChallenge,
  completeChallenge,
  getBadges,
  getBadge,
  unlockBadge,
  updateBadgeProgress
};
