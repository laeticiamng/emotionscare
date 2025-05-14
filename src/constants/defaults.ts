
import { NotificationFrequency, NotificationType, NotificationTone } from '@/types/notification';

export const DEFAULT_USER_PREFERENCES = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'inter',
  notifications: {
    enabled: true,
    emailEnabled: true,
    pushEnabled: true,
    frequency: 'daily' as NotificationFrequency,
  },
  autoplayVideos: true,
  dataCollection: true,
  highContrast: false,
  reduceAnimations: false,
  soundEffects: true,
  colorAccent: '#6366f1',
  language: 'fr',
  privacyLevel: 'balanced',
  onboardingCompleted: false,
  emotionalCamouflage: false,
  aiSuggestions: true,
  fullAnonymity: false,
  notifications_enabled: true,
  privacy: {
    anonymousMode: false,
    dataSharing: true,
    profileVisibility: 'public',
  },
  dashboardLayout: 'standard'
};

export const TIME_OF_DAY = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
  NIGHT: 'night'
};
