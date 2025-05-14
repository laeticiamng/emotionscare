
import { UserPreferences } from '@/types';

export const defaultPreferences: UserPreferences = {
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
  privacyLevel: 'private'
};
