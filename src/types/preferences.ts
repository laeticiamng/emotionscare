
export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'sans' | 'serif' | 'mono';

export interface NotificationsPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: {
    security: boolean;
    system: boolean;
    social: boolean;
    achievements: boolean;
    reminders: boolean;
  };
}

export interface PrivacyPreferences {
  profileVisibility: 'private' | 'friends' | 'public';
  dataCollection: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface AccessibilityPreferences {
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  largeText: boolean;
}

export interface UserPreferences {
  theme?: Theme;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  language?: string;
  notifications?: NotificationsPreferences;
  privacy?: PrivacyPreferences | 'private' | 'public';
  accessibility?: AccessibilityPreferences;
  vibration?: boolean;
  soundEffects?: boolean;
  darkMode?: boolean;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  theme: string;
  fontSize: string;
  language: string;
  notifications: NotificationsPreferences;
  privacy: string | PrivacyPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  resetPreferences?: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'sans',
  language: 'fr',
  notifications: {
    email: true,
    push: true,
    inApp: true,
    types: {
      security: true,
      system: true,
      social: false,
      achievements: true,
      reminders: true,
    },
  },
  privacy: {
    profileVisibility: 'private',
    dataCollection: false,
    analytics: false,
    marketing: false,
  },
  accessibility: {
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    keyboardNavigation: false,
    largeText: false,
  },
  vibration: true,
  soundEffects: true,
  darkMode: false,
};

export const normalizePreferences = (prefs: Partial<UserPreferences>): UserPreferences => {
  return { ...DEFAULT_PREFERENCES, ...prefs };
};
