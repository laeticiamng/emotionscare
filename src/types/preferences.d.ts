
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationType = 'all' | 'important' | 'none';
export type NotificationTone = 'friendly' | 'professional' | 'motivational' | 'direct' | 'calm';
export type PrivacyLevel = 'public' | 'team' | 'private' | 'balanced';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'system' | 'serif' | 'rounded' | 'mono';
export type ThemeName = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language: string;
  dashboardLayout: string;
  onboardingCompleted: boolean;
  soundEnabled: boolean;
  animations: boolean;
  notifications: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: string;
  };
  privacy: {
    shareData: boolean;
    anonymizeReports: boolean;
    publicProfile: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reduceMotion: boolean;
    largeText: boolean;
  };
  emotionalCamouflage: boolean;  // Premium feature
  aiSuggestions: boolean;        // Premium feature
  fullAnonymity?: boolean;
  notifications_enabled?: boolean; // For backward compatibility
}
