
import { UserPreferences } from './user';

export type { UserPreferences };

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'system',
  notifications: {
    enabled: true,
    email: true,
    push: false,
    inApp: true,
    frequency: 'daily'
  },
  soundEffects: true,
  reducedMotion: false,
  language: 'fr',
  dashboardLayout: 'default',
  onboardingCompleted: false,
  privacy: {
    shareData: true,
    anonymizeReports: false,
    profileVisibility: 'public'
  }
};
