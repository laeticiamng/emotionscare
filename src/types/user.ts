
import { Theme, FontFamily, FontSize } from './theme';
import { NotificationType, NotificationFrequency, NotificationTone } from './notification';

export type UserRole = 'admin' | 'user' | 'manager' | 'coach' | 'guest' | 'b2b-admin' | 'b2b-user' | 'b2c';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  avatar_url?: string;
  created_at?: string;
  last_sign_in_at?: string;
  onboarded?: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: Theme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language?: string;
  ambientSound?: boolean;
  colorAccent?: string;
  accessibility?: {
    highContrast?: boolean;
    largeText?: boolean;
    screenReader?: boolean;
    reducedMotion?: boolean;
  };
  accessibilityFeatures?: {
    highContrast?: boolean;
    largeText?: boolean;
    screenReader?: boolean;
    reducedMotion?: boolean;
  };
  notifications?: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: NotificationFrequency;
    types?: {
      system: boolean;
      emotion: boolean;
      coach: boolean;
      journal: boolean;
      community: boolean;
    };
    tone?: NotificationTone;
    quietHours?: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  notifications_enabled?: boolean;
  privacy?: {
    shareData?: boolean;
    anonymizeReports?: boolean;
    publicProfile?: boolean;
    anonymousMode?: boolean;
    dataSharing?: boolean;
    profileVisibility?: 'public' | 'team' | 'private';
    showEmotionalScore?: boolean;
    shareJournalInsights?: boolean;
    anonymousDataContribution?: boolean;
    shareEmotionalData?: boolean;
  } | string;
  incognitoMode?: boolean;
  lockJournals?: boolean;
  dataExport?: boolean;
  avatarUrl?: string;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  loading: boolean;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  loading: boolean;
}
