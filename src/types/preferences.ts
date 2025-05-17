
import { NotificationPreference } from './notification';

export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'system' | 'serif' | 'mono' | 'sans' | 'inter';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system' | 'pastel';
  fontSize: FontSize;
  fontFamily: FontFamily;
  reduceMotion: boolean;
  colorBlindMode: boolean;
  autoplayMedia: boolean;
  soundEnabled: boolean;
  language?: string;
  dashboardLayout?: string;
  onboardingCompleted?: boolean;
  notifications: NotificationPreference;
  privacy: {
    shareData: boolean;
    anonymizeReports: boolean;
    profileVisibility: 'public' | 'team' | 'private';
  };
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}
