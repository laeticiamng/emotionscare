
import { Theme, FontSize, FontFamily } from './theme';
import { NotificationFrequency, NotificationTone } from './notification';

export interface NotificationsPreferences {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled?: boolean;
  types?: {
    news?: boolean;
    updates?: boolean;
    reminders?: boolean;
    alerts?: boolean;
    emotions?: boolean;
    insights?: boolean;
  };
  frequency?: NotificationFrequency;
  quietHours?: {
    enabled: boolean;
    from: string;
    to: string;
  };
  tone?: NotificationTone;
}

export interface PrivacyPreferences {
  shareData: boolean;
  shareEmotions: boolean;
  shareActivity: boolean;
  publicProfile: boolean;
}

export interface UserPreferences {
  theme?: Theme;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  language?: string;
  notifications?: NotificationsPreferences | boolean;
  privacy?: PrivacyPreferences | 'private' | 'public';
  vibration?: boolean;
  soundEffects?: boolean;
  darkMode?: boolean;
  colorBlindMode?: boolean;
  highContrast?: boolean;
  reduceMotion?: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'md',
  language: 'fr',
  notifications: {
    enabled: true,
    emailEnabled: true,
    pushEnabled: false,
    inAppEnabled: true,
    types: {
      news: true,
      updates: true,
      reminders: true,
      alerts: true,
      emotions: true,
      insights: true
    },
    frequency: 'daily',
    quietHours: {
      enabled: false,
      from: '22:00',
      to: '08:00'
    },
    tone: 'friendly'
  },
  privacy: 'private',
  vibration: true,
  soundEffects: true,
  darkMode: false,
  colorBlindMode: false,
  highContrast: false,
  reduceMotion: false
};

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  theme: Theme;
  fontSize: FontSize;
  language: string;
  notifications: NotificationsPreferences;
  privacy: PrivacyPreferences | 'private' | 'public';
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => void;
  isLoading: boolean;
  error: Error | null;
}

export interface UserPreferencesFormProps {
  onSave: (preferences: UserPreferences) => void;
  isLoading?: boolean;
  preferences: UserPreferences;
}
