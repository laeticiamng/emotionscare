
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export interface UserPreferences {
  fontSize: FontSize;
  fontFamily: FontFamily;
  theme: ThemeName;
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  soundEffects: boolean;
  animationReduced: boolean;
  highContrast: boolean;
  dateFormat: string;
  timeFormat: string;
  colorBlindMode?: boolean;
  reduceMotion?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  shareData?: boolean;
  anonymizedData?: boolean;
  ambientSound?: string;
  soundEnabled?: boolean;
  privacy?: PrivacyPreferences;
  notifications?: NotificationsPreferences;
}

export interface PrivacyPreferences {
  shareData: boolean;
  anonymizedData: boolean;
  dataRetention: number;
  consentToAI: boolean;
  profileVisibility: 'private' | 'team' | 'organization' | 'public';
}

export interface NotificationsPreferences {
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
  };
}

export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';

export interface UserPreferencesFormProps {
  preferences: UserPreferences;
  onSave: (values: Partial<UserPreferences>) => Promise<void>;
  isLoading?: boolean;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}
