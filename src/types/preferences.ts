
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type FontFamily = 'inter' | 'roboto' | 'montserrat' | 'open-sans';
export type DynamicThemeMode = 'default' | 'dynamic' | 'mood-based';

export interface UserPreferences {
  theme?: ThemeName;
  fontSize?: FontSize;
  font?: FontFamily;
  notifications_enabled?: boolean;
  notification_frequency?: string;
  notification_type?: string;
  notification_tone?: string;
  color_blind_mode?: boolean;
  high_contrast?: boolean;
  reduce_motion?: boolean;
  immersiveMode?: boolean;
  moodBasedTheme?: boolean;
  dynamicThemeMode?: DynamicThemeMode;
  customCSS?: string;
  emotionalCamouflage?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
  language?: string;
  notifications?: boolean;
  autoplayVideos?: boolean;
  showEmotionPrompts?: boolean;
  privacyLevel?: string;
  dataCollection?: boolean;
  notificationsEnabled?: boolean;
  // Champs pour la compatibilité
  notificationFrequency?: string;
  notificationType?: string;
  notificationTone?: string;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  isLoading?: boolean;
  error?: string | null;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<boolean>;
  resetPreferences: () => void;
  theme?: string;
  fontSize?: string;
  notifications_enabled?: boolean;
  notification_frequency?: string;
  notification_type?: string;
  notification_tone?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  emotionalCamouflage?: boolean;
}
