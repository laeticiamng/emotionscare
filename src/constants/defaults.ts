
// Default theme settings
export const DEFAULT_THEME = "system";
export const DEFAULT_FONT_SIZE = "medium";
export const DEFAULT_FONT_FAMILY = "system";

// Notification defaults
export const DEFAULT_NOTIFICATION_PREFERENCES = {
  enabled: false,
  emailEnabled: false,
  pushEnabled: false,
  frequency: "daily",
  types: {
    system: true,
    emotion: true,
    journal: true,
    coach: true
  }
};

// Time of day enum
export enum TimeOfDay {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  NIGHT = 'night'
}

// Default user preferences
export const DEFAULT_USER_PREFERENCES = {
  theme: "system",
  fontSize: "medium",
  fontFamily: "system",
  language: "fr",
  notifications: DEFAULT_NOTIFICATION_PREFERENCES,
  autoplayVideos: false,
  dataCollection: true,
  accessibilityFeatures: {
    highContrast: false,
    reducedMotion: false,
    screenReader: false
  },
  dashboardLayout: "standard",
  onboardingCompleted: false,
  privacyLevel: "balanced",
  soundEnabled: true
};
