
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
    anonymousMode?: boolean;
  };
  // Préférences supplémentaires
  avatarUrl?: string;
  displayName?: string;
  pronouns?: string;
  biography?: string;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  ambientSound?: boolean;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'system',
  reduceMotion: false,
  colorBlindMode: false,
  autoplayMedia: true,
  soundEnabled: true,
  language: 'fr',
  onboardingCompleted: false,
  notifications: {
    enabled: true,
    emailEnabled: true,
    pushEnabled: true,
    inAppEnabled: true,
    frequency: 'immediate',
    types: {
      system: true,
      emotion: true,
      coach: true,
      journal: true,
      community: true,
      achievement: true,
      badge: true,
      challenge: true,
      reminder: true,
      info: true,
      warning: true,
      error: true,
      success: true,
      streak: true,
      urgent: true
    }
  },
  privacy: {
    shareData: true,
    anonymizeReports: false,
    profileVisibility: 'public',
    anonymousMode: false
  }
};
