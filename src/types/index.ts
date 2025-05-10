
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
export type NotificationType = 'minimal' | 'detailed' | 'full';
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

// Admin UI types
export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  expired: number;
  recent_invitations: {
    id: string;
    email: string;
    status: string;
    created_at: string;
  }[];
  conversion_rate: number;
}

// Add UserRole enum
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  COACH = 'coach',
  PREMIUM = 'premium'
}

export interface InvitationFormData {
  email: string;
  role?: UserRole | string;
  message?: string;
  expires_at?: Date;
}

// Audio player types
export interface TrackInfoProps {
  track?: any;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: any;
  loadingTrack?: boolean;
  audioError?: Error | null;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
  showTimestamps?: boolean;
  className?: string;
}

// For EmotionalTeamView component
export interface EmotionalTeamViewProps {
  className?: string;
}
