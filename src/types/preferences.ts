
import { NotificationPreference } from './notification';

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large';
export type FontFamily = 'system' | 'serif' | 'sans-serif' | 'monospace' | 'rounded';
export type PrivacyLevel = 'high' | 'medium' | 'low' | 'balanced';

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language: string;
  notifications: NotificationPreference;
  autoplayVideos: boolean;
  dataCollection: boolean;
  accessibilityFeatures: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  dashboardLayout: string;
  onboardingCompleted: boolean;
  privacyLevel: PrivacyLevel;
  soundEnabled?: boolean;
  fullAnonymity?: boolean;
}
