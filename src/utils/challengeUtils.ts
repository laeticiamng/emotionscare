// @ts-nocheck

import { Challenge } from '@/types/gamification';

/**
 * Normalizes a challenge object to ensure all required properties are present
 */
export function normalizeChallenge(challenge: any): Challenge {
  return {
    id: challenge.id || `challenge-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    title: challenge.title || challenge.name || 'Unknown Challenge',
    name: challenge.name || challenge.title || 'Unknown Challenge',
    description: challenge.description || 'No description',
    points: challenge.points !== undefined ? challenge.points : 0,
    progress: challenge.progress !== undefined ? challenge.progress : 0,
    goal: challenge.goal || challenge.total || challenge.totalSteps || 1,
    category: challenge.category || 'general',
    completed: challenge.completed || challenge.isCompleted || false,
    isCompleted: challenge.isCompleted || challenge.completed || false,
    status: challenge.status || 'active',
    difficulty: challenge.difficulty || 'medium',
    completions: challenge.completions !== undefined ? challenge.completions : challenge.progress,
    total: challenge.total || challenge.goal || challenge.totalSteps || 1,
    totalSteps: challenge.totalSteps || challenge.total || challenge.goal || 1,
    reward: challenge.reward || { type: 'points', value: challenge.points || 0 },
    unlocked: challenge.unlocked !== undefined ? challenge.unlocked : true,
    icon: challenge.icon || null,
    deadline: challenge.deadline || null,
  };
}

/**
 * Normalizes an array of challenge objects
 */
export function normalizeChallenges(challenges: any[]): Challenge[] {
  return challenges.map(normalizeChallenge);
}
