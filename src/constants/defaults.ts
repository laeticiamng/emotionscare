
import { UserPreferences } from '@/types/user';
import { NotificationFrequencyEnum, NotificationTypeEnum, NotificationToneEnum } from '@/types/notification';

// Define default user preferences
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'light',
  fontSize: 'medium',
  fontFamily: 'system',
  language: 'fr',
  notifications: {
    enabled: true,
    emailEnabled: false,
    pushEnabled: true,
    frequency: NotificationFrequencyEnum.DAILY,
    types: [NotificationTypeEnum.INFO, NotificationTypeEnum.SUCCESS],
    tone: NotificationToneEnum.FRIENDLY
  },
  autoplayVideos: false,
  dataCollection: true,
  accessibilityFeatures: {
    highContrast: false,
    reducedMotion: false,
    screenReader: false
  },
  dashboardLayout: 'default',
  onboardingCompleted: false,
  privacyLevel: 'balanced',
  soundEnabled: true,
  fullAnonymity: false,
  emotionalCamouflage: false,
  aiSuggestions: true
};

// Define default emoticons for the emoticon selector
export const DEFAULT_EMOTICONS = ['😊', '😢', '😠', '😎', '😴', '🤔', '😰', '🥰', '🤯', '😑'];

// Define default color themes
export const DEFAULT_COLOR_THEMES = {
  light: {
    primary: '#3b82f6',
    secondary: '#10b981',
    background: '#ffffff',
    text: '#111827'
  },
  dark: {
    primary: '#60a5fa',
    secondary: '#34d399',
    background: '#111827',
    text: '#f3f4f6'
  }
};
