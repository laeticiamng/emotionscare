// Default constants for the application

// Time of day as enum
export enum TimeOfDay {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  NIGHT = 'night'
}

// Time of day as array (keep for backward compatibility)
export const TIME_OF_DAY = [TimeOfDay.MORNING, TimeOfDay.AFTERNOON, TimeOfDay.EVENING, TimeOfDay.NIGHT];

// Default user preferences
export const DEFAULT_USER_PREFERENCES = {
  theme: 'system',
  fontSize: 'medium',
  language: 'fr',
  notifications: {
    enabled: true,
    emailEnabled: true,
    pushEnabled: false,
    frequency: 'daily',
    types: {
      tips: true,
      reminders: true,
      updates: true,
      community: false
    },
    tone: 'friendly',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  }
};

// Default emotions
export const DEFAULT_EMOTIONS = [
  'joy',
  'calm',
  'sadness',
  'anger',
  'fear',
  'surprise',
  'neutral'
];

// Default wellbeing score thresholds
export const WELLBEING_SCORE_THRESHOLDS = {
  excellent: 80,
  good: 60,
  average: 40,
  poor: 20
};
