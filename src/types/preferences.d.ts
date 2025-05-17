
import { Theme, FontFamily, FontSize } from './theme';
import { NotificationPreference, NotificationFrequency } from './notification';

export interface UserPreferences {
  theme: Theme;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  notifications?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    frequency?: NotificationFrequency;
    enabled?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    inAppEnabled?: boolean;
    types?: Record<string, boolean>;
  };
  soundEnabled?: boolean;
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
  language?: string;
  dashboardLayout?: string;
  onboardingCompleted?: boolean;
  privacy?: {
    shareData: boolean;
    anonymizeReports: boolean;
    profileVisibility: string;
  };
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'system',
  notifications: {
    email: true,
    push: false,
    inApp: true,
    frequency: 'daily'
  },
  soundEnabled: true,
  reduceMotion: false,
  language: 'fr',
  dashboardLayout: 'default',
  onboardingCompleted: false,
  privacy: {
    shareData: true,
    anonymizeReports: false,
    profileVisibility: 'public'
  }
};
