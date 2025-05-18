
import { FontFamily, FontSize, ThemeName } from './theme';

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  types: {
    system: boolean;
    emotion: boolean;
    coach: boolean;
    journal: boolean;
    community: boolean;
    achievement: boolean;
    badge?: boolean; // Added for backward compatibility
  };
  frequency: string;
  email: boolean;
  push: boolean;
  sms?: boolean;
  inApp?: boolean;
}

export interface PrivacyPreference {
  shareData?: boolean;
  anonymizeReports?: boolean;
  profileVisibility?: string;
  shareActivity?: boolean;
  shareJournal?: boolean;
  publicProfile?: boolean;
  anonymousMode?: boolean; // Added missing field
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'fr',
  notifications_enabled: true,
  email_notifications: false,
  fontSize: 'medium',
  fontFamily: 'system',
  notifications: {
    enabled: true,
    emailEnabled: false,
    pushEnabled: true,
    inAppEnabled: true,
    types: {
      system: true,
      emotion: true,
      coach: true,
      journal: true,
      community: true,
      achievement: true,
    },
    frequency: 'normal',
    email: false,
    push: true,
    sms: false,
    inApp: true,
  },
  privacy: {
    shareData: true,
    anonymizeReports: false,
    profileVisibility: 'public',
    anonymousMode: false
  },
  soundEnabled: true,
  reduceMotion: false,
  colorBlindMode: false,
  useSystemTheme: true,
  highContrast: false,
  onboardingCompleted: false,
  dashboardLayout: {},
  ambientSound: 'nature'
};

export interface UserPreferences {
  theme?: ThemeName;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  useSystemTheme?: boolean;
  highContrast?: boolean;
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  soundEnabled?: boolean;
  language?: string;
  timeZone?: string;
  dateFormat?: string;
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  autoplayMedia?: boolean;
  dashboardLayout?: Record<string, any> | string;
  onboardingCompleted?: boolean;
  showTips?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  ambientSound?: string;
  
  // Structured preferences
  notifications?: NotificationPreference;
  privacy?: PrivacyPreference;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}
