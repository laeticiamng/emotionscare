
// ————————————————————————
// UserRole
// ————————————————————————
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin';

// ————————————————————————
// User
// ————————————————————————
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  preferences: UserPreferences;
  avatar_url?: string;
  avatar?: string;
  onboarded?: boolean;
  department?: string;
  position?: string;
  anonymity_code?: string;
  emotional_score?: number;
  joined_at?: string;
}

export interface UserData extends User {
  status: 'pending' | 'active';
  createdAt: string;
  location?: any;
}

// ————————————————————————
// UserPreferences
// ————————————————————————
export interface UserPreferences {
  privacy?: 'public' | 'private' | 'team';
  profileVisibility?: 'public' | 'private' | 'team';
  notifications_enabled?: boolean;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  aiSuggestions?: boolean;
  emotionalCamouflage?: boolean;
  language?: string;
  notifications?: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
  };
}

// ————————————————————————
// Period & TeamView
// ————————————————————————
export type Period = 'day' | 'week' | 'month' | 'year' | 'quarter';

export interface EmotionalTeamViewProps {
  userId: string;
  className?: string;
  onRefresh?: () => void;
  teamId?: string;
  period?: Period;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// ————————————————————————
// Emotion
// ————————————————————————
export interface Emotion {
  id?: string;
  emotion: string;
  score?: number;
  confidence?: number;
  intensity?: number;
  transcript?: string;
  date?: string;
  emojis?: string[];
  ai_feedback?: string;
  recommendations?: string[];
  category?: string;
  audio_url?: string;
  text?: string;
  user_id?: string;
  dominantEmotion?: string;
}

export interface EmotionResult extends Emotion {
  id?: string;
  emotion: string;
  confidence: number;
  intensity?: number;
  transcript?: string;
  date?: string;
  emojis?: string[];
  ai_feedback?: string;
  recommendations?: string[];
  category?: string;
  audio_url?: string;
  dominantEmotion?: string;
  text?: string;
  user_id?: string;
  score?: number;
}

export interface EnhancedEmotionResult extends EmotionResult {
  // Additional fields for enhanced results
}

// ————————————————————————
// MusicTrack
// ————————————————————————
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  audioUrl: string;
  coverUrl: string;
  cover?: string;
  cover_url?: string;
  audio_url?: string;
  emotion?: string;
  genre?: string;
  album?: string;
  year?: number;
  isPlaying?: boolean;
  isFavorite?: boolean;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title: string;
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  duration?: number;
  trackCount?: number;
  createdBy?: string;
  emotion?: string;
}

export interface MusicDrawerProps {
  open: boolean;
  onOpenChange: () => void;
  playlist: MusicPlaylist;
  currentTrack: MusicTrack;
}

export interface TrackInfoProps {
  title: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: boolean;
  className?: string;
  compact?: boolean;
}

export interface VolumeControlProps {
  onVolumeChange: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
  showTimestamps?: boolean;
}

export interface MusicContextType {
  // Playback control
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  
  // Drawer control
  setOpenDrawer: (open: boolean) => void;
  
  // Track & playlist state
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  playlists: MusicPlaylist[];
  loadPlaylistById: (id: string) => void;
  
  // Emotion-based recommendation
  currentEmotion: string;
  setEmotion: (emotion: string) => void;
  
  // Volume & mute control
  isMuted: boolean;
  toggleMute: () => void;
  adjustVolume: (value: number) => void;
  
  // System state
  isInitialized: boolean;
  initializeMusicSystem: () => void;
  error?: string | null;
  isPlaying?: boolean; // Ajouté pour corriger les erreurs
}

// ————————————————————————
// VR
// ————————————————————————
export interface VRSessionTemplate {
  id?: string;
  title: string;
  name?: string; // For backward compatibility
  description?: string;
  duration: number;
  audio_url?: string;
  videoUrl?: string;
  emotion_target?: string;
  emotion?: string;
  is_audio_only?: boolean;
  lastUsed?: string;
  completion_rate?: number;
  recommended_mood?: string;
  templateId?: string;
  emotions?: string[];
  benefits?: string[];
  difficulty?: string;
  tags?: string[];
  theme?: string;
  preview_url?: string;
}

export interface VRSession {
  id: string;
  userId?: string;
  templateId?: string;
  date?: string;
  startDate?: string;
  startedAt?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  duration_seconds?: number;
  is_audio_only?: boolean;
  completed?: boolean;
  isCompleted?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
}

export interface VRSessionWithMusicProps {
  session?: VRSessionTemplate;
  template?: VRSessionTemplate;
  onSessionComplete?: () => void;
  onComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  sessionId?: string;
  templateId?: string;
}

export interface VRHistoryListProps {
  userId?: string;
  limit?: number;
  showLoadMore?: boolean;
  onItemClick?: (session: VRSession) => void;
}

export interface VoiceEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
}

// ————————————————————————
// GÉNÉRAL
// ————————————————————————
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

// ————————————————————————
// ThemeContext
// ————————————————————————
export type FontFamily = 'system' | 'sans-serif' | 'serif' | 'mono' | 'rounded' | 'inter';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large' | 'sm' | 'md' | 'lg' | 'xl';
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

// ————————————————————————
// UserMode
// ————————————————————————
export type UserModeType = 'b2c' | 'b2b-user' | 'b2b-admin' | 'personal' | 'team' | 'b2b-collaborator' | 'anonymous';

export interface UserMode {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
}

// ————————————————————————
// Notification
// ————————————————————————
export type NotificationFrequency = 'daily' | 'weekly' | 'monthly' | 'never';
export type NotificationType = 'emotion' | 'journal' | 'vr' | 'system';
export type NotificationTone = 'neutral' | 'positive' | 'negative';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  tone?: NotificationTone;
  read: boolean;
  created_at: string;
  action_url?: string;
}

export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  frequency: NotificationFrequency;
}
