
import { NotificationsPreferences, NotificationFrequency } from './notification';

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
}

export interface UserPreferences {
  theme: ThemeType;
  fontSize?: FontSizeType;
  fontFamily?: FontFamily;
  language?: string;
  notifications?: NotificationsPreferences | boolean;
  privacy?: PrivacyLevel | PrivacyPreferences;
  soundEnabled?: boolean;
  reduceMotion?: boolean;
  highContrast?: boolean;
  colorBlindMode?: boolean;
  animationReduced?: boolean;
  autoplayMedia?: boolean;
  dataUsage?: 'low' | 'medium' | 'high';
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
  dataUsage: 'medium'
};

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  theme: ThemeType;
  fontSize: FontSizeType;
  language: string;
  notifications: NotificationsPreferences;
  privacy: PrivacyLevel | PrivacyPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => void;
  isLoading: boolean;
  error: Error | null;
}
