
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
export * from './badge';
export * from './group';

// User Preferences Types
export type ThemeName = 'light' | 'dark' | 'pastel' | 'nature' | 'starry' | 'misty';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'dm-sans' | 'atkinson' | 'serif';
export type NotificationFrequency = 'daily' | 'weekly' | 'flexible' | 'none';
export type NotificationTone = 'minimalist' | 'poetic' | 'directive' | 'silent';
export type DynamicThemeMode = 'none' | 'time' | 'emotion' | 'weather';

// Add MoodData type which was missing
export interface MoodData {
  date: string;
  value: number;
  emotion: string;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}
