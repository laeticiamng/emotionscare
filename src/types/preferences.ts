
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'system' | 'serif' | 'mono' | 'sans-serif' | 'monospace';

export interface NotificationPreferences {
  enabled: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  types?: {
    system?: boolean;
    emotion?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
    achievement?: boolean;
  };
  frequency?: string;
}

export interface UserPreferences {
  theme?: ThemeName;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  language?: string;
  notifications?: NotificationPreferences;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  autoplayVideos?: boolean;
  autoplayMedia?: boolean;
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  dataCollection?: boolean;
  soundEnabled?: boolean;
  accessibilityFeatures?: {
    highContrast?: boolean;
    reducedMotion?: boolean;
    screenReader?: boolean;
  };
  dashboardLayout?: string;
  onboardingCompleted?: boolean;
  privacyLevel?: string;
  privacy?: {
    shareData: boolean;
    anonymizeReports?: boolean;
    profileVisibility: string;
    showProfile?: boolean;
    shareActivity?: boolean;
    allowMessages?: boolean;
    allowNotifications?: boolean;
  };
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences?: () => void;
  loading?: boolean;
  setPreferences?: React.Dispatch<React.SetStateAction<UserPreferences>>;
}
