
// ————————————————————————
// UserRole and UserModeType
// ————————————————————————
export type UserRole = 
  | 'b2c' 
  | 'b2b_user' 
  | 'b2b-user' 
  | 'b2b_admin' 
  | 'b2b-admin'
  | 'team'
  | 'admin'
  | 'manager'
  | 'wellbeing_manager'
  | 'coach'
  | 'employee'
  | 'user'
  | 'personal';

export type UserModeType = UserRole;

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
  avatar?: string;  // Adding for compatibility
  onboarded?: boolean;
  department?: string;
  position?: string;
  job_title?: string; // Added for B2BUserLayout
  anonymity_code?: string;
  emotional_score?: number;
  joined_at?: string;
  createdAt?: string;
  team_id?: string;
  status?: 'pending' | 'active'; // Added for useUserTableData
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
  dashboardLayout: 'standard' | 'compact' | 'focused';
  onboardingCompleted: boolean;
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  sound: boolean;
  notifications_enabled: boolean;
  privacy?: {
    profileVisibility?: 'public' | 'private' | 'team';
  };
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  aiSuggestions?: boolean;
  emotionalCamouflage?: boolean;
  language?: string;
  notifications?: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency?: string;
  };
  profileVisibility?: 'public' | 'private' | 'team';
  locale?: string;
  timeZone?: string;
  accessibilityFeatures?: string[];
  privacyLevel?: string;
}

// ————————————————————————
// Period & TeamView
// ————————————————————————
export type Period = 'day' | 'week' | 'month' | 'year' | 'quarter';

export interface TeamOverviewProps {
  userId: string;
  className?: string;
  onRefresh?: () => void;
  teamId?: string;
  period?: Period;
  dateRange?: {
    start: Date;
    end: Date;
  };
  users: Partial<User>[];
  onUserClick?: (userId: string) => void;
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  period?: Period;
  userId?: string;
  className?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  onRefresh?: () => void;
}

// ————————————————————————
// EmotionResult - Unified type for all emotion-related data
// ————————————————————————
export interface EmotionResult {
  id: string;
  emotion: string;
  score?: number;
  confidence?: number;
  intensity?: number;
  transcript?: string;
  date: string | null;
  emojis?: string[] | string;
  ai_feedback?: string;
  recommendations?: string[];
  category?: string;
  audio_url?: string;
  text?: string;
  user_id?: string;
  dominantEmotion?: string;
  source?: string;
  feedback?: string;
  timestamp?: string;
  name?: string; // Added for compatibility
  anxiety?: number; // Added for mockEmotions.ts compatibility
}

export interface EmotionalData {
  userId: string;
  emotion: string;
  intensity?: number;
  timestamp: string;
  source?: string;
  feedback?: string;
}

// Add EnhancedEmotionResult for backward compatibility
export type Emotion = EmotionResult;
export type EnhancedEmotionResult = EmotionResult;

// Voice Emotion Scanner Props
export interface VoiceEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
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
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: boolean;
  className?: string;
  compact?: boolean;
  track?: MusicTrack;
}

export interface VolumeControlProps {
  volume?: number;
  onChange?: (value: number) => void;
  onVolumeChange: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface ProgressBarProps {
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  className?: string;
  showTimestamps?: boolean;
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  progress?: number;
  variant?: string;
  showLabel?: boolean;
  formatTime?: (seconds: number) => string;
}

export interface MusicContextType {
  // Playback control
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  
  // Backward compatibility
  play?: (track: MusicTrack) => void;
  pause?: () => void;
  resumeTrack?: () => void;
  
  // Drawer control
  setOpenDrawer: (open: boolean) => void;
  openDrawer?: boolean;
  
  // Track & playlist state
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  playlists: MusicPlaylist[];
  loadPlaylistById: (id: string) => void;
  currentPlaylist: MusicPlaylist | null;
  
  // Emotion-based recommendation
  currentEmotion: string;
  setEmotion: (emotion: string) => void;
  
  // Volume & mute control
  isMuted: boolean;
  toggleMute: () => void;
  adjustVolume: (value: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  
  // System state
  isInitialized: boolean;
  initializeMusicSystem: () => void;
  error?: string | null;
  isPlaying?: boolean;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  
  // Metadata
  currentTrackDuration?: number;
  currentTime?: number;
  loading?: boolean;
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
  type?: string;
  thumbnail?: string;
  duration_seconds?: number;
  image?: string;
  level?: number;
}

export interface VRSession {
  id: string;
  userId?: string;
  templateId?: string;
  template?: VRSessionTemplate;  // Added for compatibility
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
  emotion_after?: string; // Added for useVRSession
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

export interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStartSession?: () => void;
  onBack?: () => void;
  heartRate?: number;
  showBackButton?: boolean;
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
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type Theme = ThemeName; // For backward compatibility

export interface ThemeButtonProps {
  theme?: Theme;
  onClick?: () => void;
  collapsed?: boolean;
}

export interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isDarkMode: boolean;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

// ————————————————————————
// UserMode
// ————————————————————————
export interface UserModeContextType {
  userMode: UserModeType;
  setUserMode: (mode: UserModeType) => void;
  mode?: UserModeType; // For backward compatibility
  setMode?: (mode: UserModeType) => void; // For backward compatibility
  isLoading?: boolean;
}

// ————————————————————————
// AuthContext
// ————————————————————————
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setPreferences: (prefs: UserPreferences | ((prev: UserPreferences) => UserPreferences)) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  logout?: () => Promise<void>; // Added for compatibility with existing components
  updateUser?: (data: Partial<User>) => Promise<void>; // Added for compatibility
  preferences?: UserPreferences;
  setSinglePreference?: (key: string, value: any) => void;
}

// ————————————————————————
// Gamification Types 
// ————————————————————————
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  imageUrl?: string;
  icon?: string;
  threshold?: number;
  type?: string;
  level?: number | string;
  image?: string;
  unlockedAt?: string;
  category?: string;
  dateEarned?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: string;
  category: string;
  progress?: number;
  target?: number;
  reward?: number;
  type?: string;
  name?: string;
  completed?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  score: number;
  avatar?: string;
  rank: number;
  change?: number;
  streak?: number;
}

export interface GamificationStats {
  level: number;
  points: number;
  badges: Badge[];
  streaks: {
    current: number;
    longest: number;
    lastActivity: string;
  };
  leaderboard: LeaderboardEntry[];
  nextLevel: number;
  pointsToNextLevel: number;
  nextLevelPoints: number;
  challenges?: Challenge[];
  rank?: string;
  streak?: number;
  totalPoints?: number;
  currentLevel?: number;
  progressToNextLevel?: number;
  streakDays?: number;
  lastActivityDate?: string;
  activeChallenges?: number;
  completedChallenges?: number;
  badgesCount?: number;
  recentAchievements?: any[];
}

// ————————————————————————
// Types from other files
// ————————————————————————
export interface NotificationFrequency { }
export interface NotificationType { }
export interface NotificationTone { }
export interface Notification { }
export interface NotificationPreference { }
export interface InvitationVerificationResult { }
export interface MoodData { }
export interface JournalEntry { }
export interface Story { }
export interface EmotionPrediction { }
export interface Recommendation { }
export interface InvitationStats { }
export interface InvitationData { }
export interface InvitationFormData { }

// Dashboard
export interface DashboardHeroData {
  greeting: string;
  subtitle: string;
  stats: {
    emotion: {
      current: string;
      score: number;
      previous?: string;
      trend?: 'up' | 'down' | 'stable';
      change?: number;
    };
    streak: {
      current: number;
      longest: number;
    };
    completion: {
      value: number;
      total: number;
    };
    badges: {
      count: number;
      latest?: string;
    };
  };
  recommendations: Recommendation[];
}
