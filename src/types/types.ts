
// Emotion / EmotionResult
export interface EmotionResult {
  id?: string;
  emotion: string;
  confidence: number;
  intensity?: number;
  score?: number;
  transcript?: string;
  date?: string;
  timestamp?: string;
  text?: string;
  emojis?: string[];
  ai_feedback?: string;
  feedback?: string;
  recommendations?: string[];
  category?: string;
  audio_url?: string;
  user_id?: string;
}

export type Emotion = EmotionResult;

// Music
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  genre?: string;
  duration?: number;
  cover?: string;
  cover_url?: string;
  coverUrl?: string;
  audio_url?: string;
  audioUrl?: string;
  url?: string;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  emotion?: string;
}

export interface MusicDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
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
  compact?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  onChange?: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface ProgressBarProps {
  value?: number;
  max?: number;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  showTimestamps?: boolean;
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  progress?: number;
  formatTime?: (seconds: number) => string;
  onChange?: (value: number) => void;
}

// Notification
export interface NotificationType {
  id: string;
  type: string;
  message: string;
  read: boolean;
  date: string;
}

export interface NotificationFrequency {
  daily: boolean;
  weekly: boolean;
  monthly: boolean;
}

export interface NotificationTone {
  supportive: boolean;
  neutral: boolean;
  direct: boolean;
}

export interface NotificationPreference {
  enabled?: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  frequency?: string;
  types?: {
    system?: boolean;
    emotion?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
  };
  tone?: string;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface Notification {
  id: string;
  type: string;
  createdAt: string;
  body: string;
  read: boolean;
  title?: string;
  message?: string;
  date?: string;
}

// VR
export interface VRSession {
  id: string;
  userId: string;
  templateId: string;
  startDate: Date | string;
  duration: number;
  completed: boolean;
  emotion?: string;
}

export interface VRSessionTemplate {
  id?: string;
  name?: string;
  title?: string;
  theme?: string;
  duration: number;
  audio_url?: string;
  videoUrl?: string;
  preview_url?: string;
  emotion_target?: string;
  emotion?: string;
  is_audio_only?: boolean;
  lastUsed?: string;
  completion_rate?: number;
  recommended_mood?: string;
  templateId?: string;
  description?: string;
}

export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  session?: { 
    template?: VRSessionTemplate;
    templateId?: string;
  };
  onComplete?: () => void;
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  sessionId?: string;
  templateId?: string;
}

export interface VRHistoryListProps {
  userId: string;
  limit?: number;
  onSessionSelect?: (session: VRSession) => void;
}

// Admin – Premium View
export interface EmotionalTeamViewProps {
  teamId?: string;
  userId?: string;
  className?: string;
  period?: 'day' | 'week' | 'month';
  dateRange?: { start: Date; end: Date };
  onRefresh?: () => void;
}

// User and Auth
export type UserRole = 'user' | 'admin' | 'coach' | 'therapist';

export interface UserPreferences {
  dashboardLayout?: string;
  onboardingCompleted?: boolean;
  theme?: ThemeName;
  fontSize?: FontSize;
  language?: string;
  fontFamily?: FontFamily;
  sound?: boolean;
  notifications?: NotificationPreference;
}

export type ThemeName = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'system-ui' | 'serif' | 'mono';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  preferences: UserPreferences;
  avatar_url?: string;
  created_at?: string;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  setSinglePreference: (key: string, value: any) => void;
  resetPreferences: () => void;
  loading: boolean;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, name: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  preferences: UserPreferencesState;
  logout: () => Promise<void>;
}

export interface InvitationVerificationResult {
  valid: boolean;
  role?: string;
  email?: string;
  expired?: boolean;
  error?: string;
}

// General
export type Period = 'day' | 'week' | 'month';

// Music Context
export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  playlist: MusicPlaylist | null;
  loadPlaylist: (playlist: MusicPlaylist) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
}
