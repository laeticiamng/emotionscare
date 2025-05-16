
export enum TimeOfDay {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  NIGHT = 'night'
}

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
    allowAnalytics: true
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    frequency: 'daily'
  }
};
