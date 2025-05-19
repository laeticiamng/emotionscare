
export interface PrivacyPreferences {
  dataSharing?: boolean;
  shareData?: boolean;
  analytics?: boolean;
  thirdParty?: boolean;
  anonymizeReports?: boolean;
  anonymizedData?: boolean;
  profileVisibility?: 'private' | 'team' | 'organization' | 'public';
}

export interface NotificationsPreferences {
  enabled: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  types?: {
    system: boolean;
    emotion: boolean;
    coach: boolean;
    journal: boolean;
    community: boolean;
    achievement?: boolean;
    badge?: boolean;
    challenge?: boolean;
    reminder?: boolean;
    info?: boolean;
    warning?: boolean;
    error?: boolean;
    success?: boolean;
    streak?: boolean;
  };
  frequency: NotificationFrequency;
  tone?: string;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  }
}

export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never' | 'custom';
export type NotificationType = 'system' | 'emotion' | 'coach' | 'journal' | 'community';

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system' | 'pastel';
  fontSize?: 'small' | 'medium' | 'large' | 'xlarge';
  fontFamily?: 'sans' | 'serif' | 'mono' | 'system' | 'rounded';
  notifications?: boolean | NotificationsPreferences;
  emailNotifications?: boolean;
  soundEffects?: boolean;
  animationReduced?: boolean;
  highContrast?: boolean;
  language?: string;
  dateFormat?: string;
  timeFormat?: string;
  ambientSound?: string;
  soundEnabled?: boolean;
  privacy?: string | PrivacyPreferences;
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  shareData?: boolean;
  anonymizedData?: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'sans',
  notifications: true,
  emailNotifications: false,
  soundEnabled: true,
  language: 'fr',
  ambientSound: 'nature',
  privacy: 'private',
};

export interface UserPreferencesFormProps {
  preferences: UserPreferences;
  onSave: (values: Partial<UserPreferences>) => Promise<void>;
  isLoading?: boolean;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  theme?: string;
  fontSize?: string;
  language?: string;
  notifications?: boolean | NotificationsPreferences;
  privacy?: string | PrivacyPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>;
  resetPreferences?: () => void;
  isLoading: boolean;
  error?: Error | null;
}
