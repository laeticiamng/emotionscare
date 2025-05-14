
import { UserPreferences } from '@/types/user';

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  font: 'inter',
  dynamicTheme: 'none',
  notificationsEnabled: true,
  notifications: {
    enabled: true,
  },
  privacy: {
    profileVisibility: 'private',
  },
  dataExport: 'pdf',
  incognitoMode: false,
  lockJournals: false,
  emotionalCamouflage: false, 
  aiSuggestions: true,
  screenReader: false,
  keyboardNavigation: false,
  audioGuidance: false,
  autoplayVideos: false,
  highContrast: false,
  reducedAnimations: false,
  language: 'fr',
  notificationFrequency: 'daily',
  notificationTone: 'friendly'
};
