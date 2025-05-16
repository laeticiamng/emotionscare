
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono' | 'rounded';
export type PrivacyLevel = 'strict' | 'balanced' | 'relaxed';
export type Theme = ThemeName;

export interface NotificationPreference {
  email: boolean;
  push: boolean;
  sounds: boolean;
}

export interface SoundPreference {
  volume: number;
  effects: boolean;
  music: boolean;
}

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language: string;
  notifications: NotificationPreference;
  haptics: boolean;
  dataCollection: boolean;
  privacyLevel: PrivacyLevel;
  animations: boolean;
  soundEffects: boolean;
  reduceMotion: boolean;
  colorBlindMode: boolean;
  autoplayMedia: boolean;
  sound: SoundPreference | boolean;
  fullAnonymity?: boolean;
  ambientSound?: boolean;
  displayName?: string;
  pronouns?: string;
  biography?: string;
  avatarUrl?: string;
  onboarded?: boolean;
}
