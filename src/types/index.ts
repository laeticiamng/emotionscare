
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

// Basic shared types
export type ThemeName = 'light' | 'dark' | 'pastel' | 'nature' | 'starry' | 'misty' | 'system' | 'deep-night';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'dm-sans' | 'atkinson' | 'serif';
export type NotificationFrequency = 'daily' | 'weekly' | 'flexible' | 'none';
export type NotificationType = 'minimal' | 'detailed' | 'full';
export type NotificationTone = 'minimalist' | 'poetic' | 'directive' | 'silent';
export type DynamicThemeMode = 'none' | 'time' | 'emotion' | 'weather';

// Progress bar interface
export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
  showTimestamps?: boolean;
  className?: string;
}

// Volume control interface
export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  showLabel?: boolean;
  className?: string;
}

// Track info interface
export interface TrackInfoProps {
  track?: any;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: any;
  loadingTrack?: boolean;
  audioError?: Error | null;
}
