
import { NotificationPreference, NotificationFrequency } from './notification';

export type ThemeType = 'light' | 'dark' | 'system' | 'pastel';
export type FontSizeType = 'small' | 'medium' | 'large' | 'xlarge';
export type FontFamily = 'sans' | 'serif' | 'mono' | 'system' | 'rounded';
export type PrivacyLevel = 'private' | 'friends' | 'public';

export interface PrivacyPreferences {
  shareActivity?: boolean;
  shareEmotionalStatus?: boolean;
  shareJournal?: boolean;
  shareBadges?: boolean;
  shareProfile?: boolean;
  defaultVisibility?: PrivacyLevel;
  // Add fields used in PrivacyPreferences.tsx
  dataSharing?: boolean;
  analytics?: boolean;
  thirdParty?: boolean;
  shareData?: boolean;
  anonymizeReports?: boolean;
  profileVisibility?: string;
}

export interface UserPreferences {
  theme: ThemeType;
  fontSize?: FontSizeType;
  fontFamily?: FontFamily;
  language?: string;
  notifications?: NotificationPreference | boolean;
  privacy?: PrivacyLevel | PrivacyPreferences;
  soundEnabled?: boolean;
  reduceMotion?: boolean;
  highContrast?: boolean;
  colorBlindMode?: boolean;
  animationReduced?: boolean;
  autoplayMedia?: boolean;
  dataUsage?: 'low' | 'medium' | 'high';
  ambientSound?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  shareData?: boolean; // For DataPrivacySettings.tsx
  anonymizedData?: boolean; // For DataPrivacySettings.tsx
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'system',
  language: 'fr',
  notifications: {
    enabled: true,
    emailEnabled: true,
    pushEnabled: false,
    inAppEnabled: true,
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
    },
    frequency: 'immediate'
  },
  privacy: 'private',
  soundEnabled: true,
  reduceMotion: false,
  highContrast: false,
  colorBlindMode: false,
  autoplayMedia: true,
  dataUsage: 'medium',
  ambientSound: true,
  emotionalCamouflage: false,
  aiSuggestions: true
};

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  theme: ThemeType;
  fontSize: FontSizeType;
  language: string;
  notifications: NotificationPreference;
  privacy: PrivacyLevel | PrivacyPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => void;
  isLoading: boolean;
  error: Error | null;
}

// Function to normalize preferences with default values
export const normalizePreferences = (prefs: Partial<UserPreferences> | null): UserPreferences => {
  if (!prefs) {
    return DEFAULT_PREFERENCES;
  }
  
  return {
    ...DEFAULT_PREFERENCES,
    ...prefs
  };
};

// Added for PreferencesForm.tsx
export interface UserPreferencesFormProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  isLoading?: boolean;
}

// Export NotificationsPreferences
export type NotificationsPreferences = NotificationPreference;
