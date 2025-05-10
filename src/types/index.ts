
// Export all types from various modules
export * from './user';
export * from './emotion';
export * from './chat';
export * from './journal';
export * from './mood';
export * from './vr';
export * from './invitation';
export * from './badge';
export * from './audio-player';
export * from './music';
export * from './scan';
export * from './gamification';
export * from './community';

// Basic shared types
export type ThemeName = 'light' | 'dark' | 'pastel' | 'nature' | 'starry' | 'misty' | 'system' | 'deep-night';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'dm-sans' | 'atkinson' | 'serif';
export type NotificationFrequency = 'daily' | 'weekly' | 'flexible' | 'none';
export type NotificationType = 'minimal' | 'detailed' | 'full';
export type NotificationTone = 'minimalist' | 'poetic' | 'directive' | 'silent';
export type DynamicThemeMode = 'none' | 'time' | 'emotion' | 'weather';

// User preferences state for components
export interface UserPreferencesState extends UserPreferences {
  loading: boolean;
  error: string | null;
  emotionalCamouflage?: boolean;
}

// Export JournalEntry type if missing
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: number;
  tags?: string[];
  emotion?: string;
  created_at: string | Date;
  updated_at: string | Date;
}

// Add EmotionalTeamViewProps
export interface EmotionalTeamViewProps {
  className?: string;
}

// Add missing User type
export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  created_at?: string | Date;
  last_login?: string | Date;
  preferences?: UserPreferences;
}

// Add missing MoodData type
export interface MoodData {
  date: string | Date;
  value: number;
  emotion?: string;
}

// Add missing InvitationStats type
export interface InvitationStats {
  sent: number;
  accepted: number;
  pending: number;
  expired: number;
  conversion_rate: number;
}

// Add missing Badge type
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  unlocked: boolean;
  unlock_date?: string | Date;
}

// Add missing InvitationFormData and UserRole types
export interface InvitationFormData {
  email: string;
  role: UserRole;
  message?: string;
  expires_in?: number;
}

export type UserRole = 'user' | 'admin' | 'manager' | 'supervisor';
