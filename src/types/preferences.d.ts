
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large';
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono' | 'rounded' | 'inter' | 'sans-serif' | 'monospace';
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

export interface NotificationPreferences {
  enabled: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  email?: boolean; // Added this for compatibility
  types?: Record<string, boolean>;
  frequency?: string;
  tone?: string;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface UserPreferences {
  theme?: ThemeName;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  language?: string;
  notifications?: NotificationPreferences | boolean;
  haptics?: boolean;
  dataCollection?: boolean;
  privacyLevel?: PrivacyLevel;
  animations?: boolean;
  soundEffects?: boolean;
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
  sound?: SoundPreference | boolean;
  
  // Ajout des champs manquants qui sont utilisés dans l'application
  ambientSound?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
  displayName?: string;
  pronouns?: string;
  biography?: string;
  avatarUrl?: string;
  onboarded?: boolean;
  soundEnabled?: boolean;
  
  privacy?: {
    shareData: boolean;
    anonymizeReports?: boolean;
    profileVisibility: string;
    showProfile?: boolean;
    shareActivity?: boolean;
    allowMessages?: boolean;
    allowNotifications?: boolean;
    anonymousMode?: boolean;
  };
}
