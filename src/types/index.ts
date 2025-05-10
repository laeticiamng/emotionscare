
// Export all types from various modules
export * from './audio-player';
export * from './chat';
export * from './emotion';
export * from './journal';
export * from './music';
export * from './scan';
export * from './vr';
export * from './community';
export * from './invitation';
export * from './gamification';
export * from './user';
export * from './progress-bar';
export * from './track-info';

// User Preferences Types
export type ThemeName = 'light' | 'dark' | 'pastel' | 'nature' | 'starry' | 'misty';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'dm-sans' | 'atkinson' | 'serif';
export type NotificationFrequency = 'daily' | 'weekly' | 'flexible' | 'none';
export type NotificationTone = 'minimalist' | 'poetic' | 'directive' | 'silent';
export type DynamicThemeMode = 'none' | 'time' | 'emotion' | 'weather';

export interface UserPreferences {
  // Appearance
  theme: ThemeName;
  dynamicTheme?: DynamicThemeMode;
  highContrast?: boolean;
  reducedAnimations?: boolean;
  fontSize: FontSize;
  font?: FontFamily;
  customBackground?: string;
  
  // Identity
  displayName?: string;
  pronouns?: 'il' | 'elle' | 'iel' | 'autre';
  biography?: string;
  avatarUrl?: string;
  
  // Notifications
  notifications_enabled: boolean;
  notificationTypes?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  notificationFrequency?: NotificationFrequency;
  notificationTone?: NotificationTone;
  reminder_time?: string;
  
  // Language
  language?: string;
  
  // Audio & Sensorial
  ambientSound?: 'none' | 'piano' | 'forest' | 'river' | 'fire' | 'ai';
  adaptiveSound?: boolean;
  
  // Accessibility
  screenReader?: boolean;
  keyboardNavigation?: boolean;
  audioGuidance?: boolean;
  
  // Data
  dataExport?: 'pdf' | 'json';
  incognitoMode?: boolean;
  lockJournals?: boolean;
  
  // Accent colors
  accent_color?: string;
  background_color?: string;
  
  // Premium features
  duoModeEnabled?: boolean;
  trustedContact?: string;
  emotionalCamouflage?: boolean;
}

// Add MoodData type which is missing
export interface MoodData {
  date: string;
  value: number;
  emotion: string;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}
