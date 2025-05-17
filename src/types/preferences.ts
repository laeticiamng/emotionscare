
export type ThemeName = 'light' | 'dark' | 'system' | 'blue-pastel' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono' | 'rounded' | 'monospace' | 'sans-serif';
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'formal' | 'friendly' | 'minimal';
export type PrivacyLevel = 'public' | 'private' | 'friends' | 'organization' | 'balanced';

export interface NotificationPreferences {
  enabled: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  types: {
    system: boolean;
    emotion: boolean;
    coach: boolean;
    journal: boolean;
    community: boolean;
    achievement?: boolean;
  };
  frequency: NotificationFrequency;
  tone?: NotificationTone;
  quietHours?: {
    enabled: boolean;
    start: string; // Time format 'HH:MM'
    end: string;
  };
}

export interface UserPreferences {
  theme?: ThemeName;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
  soundEnabled?: boolean;
  language?: string;
  notifications?: NotificationPreferences;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  notificationsEnabled?: boolean;
  onboardingCompleted?: boolean;
  dashboardLayout?: string;
  privacyLevel?: PrivacyLevel;
  notifications_enabled?: boolean;
  ambientSound?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  displayName?: string;
  pronouns?: string;
  biography?: string;
  avatarUrl?: string;
  fullAnonymity?: boolean;
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
  [key: string]: any; // To allow for future extensions
}
