
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

// Ajouter les types manquants
export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: UserRole;
  anonymity_code?: string;
  emotional_score?: number;
  last_activity?: string | Date;
  created_at?: string | Date;
}

export interface Emotion {
  id: string;
  user_id: string;
  date: string | Date;
  emotion: string;
  score?: number;
  confidence?: number;
  text?: string;
  transcript?: string;
  ai_feedback?: string;
  recommendations?: string[];
}

export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: number;
  score: number;
  feedback?: string;
  recommendations?: string[];
  transcript?: string;
  text?: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  conversation_id: string;
  content: string;
  timestamp: string | Date;
  is_read: boolean;
  sender_name?: string;
  is_ai?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string | Date;
  updated_at: string | Date;
  last_message?: string;
  last_message_time?: string | Date;
  messages?: ChatMessage[];
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string;
  mood_score?: number;
  tags?: string[];
  created_at: string | Date;
  updated_at: string | Date;
  is_private: boolean;
}

export interface MoodData {
  date: string | Date;
  value: number;
  label?: string;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}

export interface VRSession {
  id: string;
  user_id: string;
  template_id: string;
  started_at: string | Date;
  ended_at?: string | Date;
  duration: number;
  completed: boolean;
  emotional_state_before?: string;
  emotional_state_after?: string;
  emotional_score_before?: number;
  emotional_score_after?: number;
  notes?: string;
  template?: VRSessionTemplate;
}

export interface VRSessionTemplate {
  id: string;
  template_id: string;
  title: string;
  theme: string;
  description: string;
  duration: number;
  preview_url: string;
  is_audio_only?: boolean;
  category: string;
  benefits: string[];
  emotions: string[];
  popularity?: number;
  audio_url?: string;
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete?: (session: VRSession) => void;
  onExit?: () => void;
  initialTrack?: MusicTrack;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  level: number;
  requirements: string[];
  awarded_at?: string | Date;
  progress?: number;
  total_required?: number;
  image_url?: string;
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  coverUrl?: string;
  genre?: string;
  emotion?: string;
  audioUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  emotion?: string;
  genre?: string;
}

export interface TrackInfoProps {
  title?: string;
  artist?: string;
  coverUrl?: string;
  track?: MusicTrack;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: Error | null;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface MusicRecommendationCardProps {
  title: string;
  description?: string;
  emotion?: string;
  tracks: MusicTrack[];
  onPlayTrack: (track: MusicTrack) => void;
  isLoading?: boolean;
  className?: string;
}

export interface MusicDrawerProps {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (volume: number) => void;
  onProgressChange?: (progress: number) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  playlist?: MusicPlaylist | null;
  isLoading?: boolean;
  error?: Error | null;
}

export interface InvitationStats {
  sent: number;
  accepted: number;
  pending: number;
  expired: number;
  rejected?: number;
  conversion_rate: number;
  total: number;
  teams?: Record<string, any>;
  recent_invites?: any[];
}

export interface InvitationFormData {
  email: string;
  role: UserRole;
  message?: string;
  expires_in?: number;
}

export enum UserRole {
  EMPLOYEE = 'employee',
  ANALYST = 'analyst',
  WELLBEING_MANAGER = 'wellbeing_manager',
  ADMIN = 'admin'
}
