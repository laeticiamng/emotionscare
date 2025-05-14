
// User preferences defaults
export const DEFAULT_USER_PREFERENCES = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'sans',
  notifications: true,
  sound: true,
  language: 'fr',
  dashboardLayout: 'standard'
};

// Time of day constants for greeting messages and UI adaptations
export enum TIME_OF_DAY {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  NIGHT = 'night'
}

// Default emotion values
export const DEFAULT_EMOTION = {
  emotion: 'neutral',
  score: 5,
  confidence: 0.7
};
