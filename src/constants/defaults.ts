
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
