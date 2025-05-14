
import { UserPreferences } from '@/types';

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'inter',
  notifications: {
    enabled: false,
    emailEnabled: false,
    pushEnabled: false,
    frequency: 'daily'
  },
  language: 'fr',
  privacyLevel: 'private',
  autoplayVideos: false,
  dataCollection: true
};

export const MOCK_LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  300,   // Level 3
  600,   // Level 4
  1000,  // Level 5
  1500,  // Level 6
  2200,  // Level 7
  3000,  // Level 8
  4000,  // Level 9
  5500   // Level 10
];

export const RANK_THRESHOLDS = {
  NOVICE: 0,
  APPRENTICE: 500,
  EXPLORER: 1200,
  SPECIALIST: 2500,
  EXPERT: 4000,
  MASTER: 6000,
  GRANDMASTER: 8500
};

export const BADGE_CATEGORIES = {
  ACHIEVEMENT: 'achievement',
  STREAK: 'streak',
  EMOTION: 'emotion',
  SOCIAL: 'social',
  CHALLENGE: 'challenge',
  SPECIAL: 'special'
};

export const CHALLENGE_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};
