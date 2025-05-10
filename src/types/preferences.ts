
// Define basic shared types for preferences
export type ThemeName = 'light' | 'dark' | 'pastel' | 'nature' | 'starry' | 'misty' | 'system' | 'deep-night';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'dm-sans' | 'atkinson' | 'serif';
export type DynamicThemeMode = 'none' | 'time' | 'emotion' | 'weather';

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  autoTheme: boolean;
  dynamicThemeMode: DynamicThemeMode;
  notifications: {
    enabled: boolean;
    sound: boolean;
    email: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  privacy: {
    shareEmotionalData: boolean;
    anonymousAnalytics: boolean;
  };
}
