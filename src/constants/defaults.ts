
export enum TimeOfDay {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  NIGHT = 'night'
}

// Add DEFAULT_THEME constant
export const DEFAULT_THEME = 'light';

// Add the missing DEFAULT_WELCOME_MESSAGES export
export const DEFAULT_WELCOME_MESSAGES = {
  morning: "Bonjour ! Comment vous sentez-vous ce matin ?",
  afternoon: "Bon après-midi ! Comment se passe votre journée ?",
  evening: "Bonsoir ! Comment s'est passée votre journée ?",
  night: "Bonne soirée ! Comment vous sentez-vous avant de vous reposer ?"
};

export const DEFAULT_PREFERENCES = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'system',
  reduceMotion: false,
  colorBlindMode: false,
  autoplayMedia: true,
  soundEnabled: true,
  emotionalCamouflage: false,
  aiSuggestions: true,
  notifications_enabled: true,
  language: 'fr',
  privacy: {
    shareData: false,
    allowAnalytics: true,
    // Add missing properties for UserDetailView
    showProfile: true,
    shareActivity: true,
    allowMessages: true,
    allowNotifications: true
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    frequency: 'daily',
    enabled: true, // Add the missing enabled property
    // Add properties needed by the components
    emailEnabled: true,
    pushEnabled: true,
    inAppEnabled: true
  }
};
