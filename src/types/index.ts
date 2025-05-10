
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
export * from './navigation';
export * from './progress-bar';
export * from './track-info';
export * from './group';
export * from './vr-session-music';

// Basic shared types
export type ThemeName = 'light' | 'dark' | 'pastel' | 'nature' | 'starry' | 'misty' | 'system' | 'deep-night';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'dm-sans' | 'atkinson' | 'serif';
export type NotificationFrequency = 'daily' | 'weekly' | 'flexible' | 'none';
export type NotificationType = 'minimal' | 'detailed' | 'full';
export type NotificationTone = 'minimalist' | 'poetic' | 'directive' | 'silent';
export type DynamicThemeMode = 'none' | 'time' | 'emotion' | 'weather';

// User preferences state that components are looking for
export interface UserPreferencesState extends UserPreferences {
  loading: boolean;
  error: string | null;
  emotionalCamouflage?: boolean;
  notification_frequency?: NotificationFrequency;
  notification_type?: NotificationType;
  notification_tone?: NotificationTone;
  email_notifications?: boolean;
  push_notifications?: boolean;
}

// Add EmotionalTeamViewProps that is needed by EmotionalTeamView component
export interface EmotionalTeamViewProps {
  className?: string;
}

// Make sure MusicContextType is complete
export interface MusicContextType {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  getTracksForEmotion: (emotion: string) => Promise<MusicTrack[]>;
  playTrack: (track: MusicTrack) => void;
  play: (track?: MusicTrack) => void;
  pauseTrack: () => void;
  pause: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  loadingTrack: boolean;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  playlists: MusicPlaylist[];
  loadPlaylistById: (id: string) => void;
  initializeMusicSystem: () => Promise<void>;
  error: string | null;
  currentEmotion?: string;
}
