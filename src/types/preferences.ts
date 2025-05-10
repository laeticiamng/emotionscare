
export type ThemeName = 'light' | 'dark' | 'system';
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
}
