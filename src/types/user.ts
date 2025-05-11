
export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  image?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  soundEnabled?: boolean;
  language?: string;
  fontFamily?: string;
  privacyLevel?: string;
  showEmotionPrompts?: boolean;
  notification_frequency?: string;
  notification_tone?: string;
  emotionalCamouflage?: boolean;
}

export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'montserrat';
export type NotificationFrequency = 'high' | 'medium' | 'low' | 'none';
export type NotificationTone = 'formal' | 'friendly' | 'casual' | 'professional';
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export type UserPreferencesState = UserPreferences;
