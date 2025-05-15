import { ReactNode } from "react";

// User types
export type UserRole = 'admin' | 'manager' | 'wellbeing_manager' | 'coach' | 'team' | 'employee' | 'personal' | 'b2b_admin' | 'b2b-admin' | 'b2b_user' | 'b2b-user' | 'b2c' | 'user';

export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type ThemeName = Theme;
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'merriweather' | 'system' | 'system-ui' | 'sans-serif' | 'serif' | 'mono' | 'rounded';

// Add Period type
export type Period = 'day' | 'week' | 'month' | 'year' | string;

// Add UserModeType
export type UserModeType = 'b2b_admin' | 'b2b_user' | 'b2c' | 'personal' | string;

export interface User {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  avatar?: string;
  avatar_url?: string;
  onboarded?: boolean;
  preferences?: UserPreferences;
  job_title?: string;
  position?: string;
  created_at?: string;
  status?: 'active' | 'inactive' | 'pending';
  department?: string;
  joined_at?: string;
  emotional_score?: number;
}

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language: string;
  notifications: NotificationPreference;
  email_notifications?: boolean;
  push_notifications?: boolean;
  privacy?: {
    profileVisibility?: 'private' | 'team' | 'public';
  };
  profileVisibility?: 'private' | 'team' | 'public';
  accessibility?: {
    highContrast: boolean;
    reduceAnimations: boolean;
    largeText: boolean;
  };
  analytics_consent?: boolean;
  marketing_consent?: boolean;
  sound?: boolean;
  notifications_enabled?: boolean;
  privacyLevel?: 'strict' | 'balanced' | 'open';
  fullAnonymity?: boolean;
  soundEnabled?: boolean;
  onboardingCompleted?: boolean;
  dashboardLayout?: string;
  [key: string]: any; // For flexibility
}

export interface UserPreferencesState extends UserPreferences {
  loading: boolean;
  error: string | null;
}

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  frequency: NotificationFrequency;
  types?: NotificationType[];
  tone?: NotificationTone;
  quiet_hours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'none';
export type NotificationType = 'all' | 'emotions' | 'coach' | 'journal' | 'community' | 'system';
export type NotificationTone = 'professional' | 'friendly' | 'minimal';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  date: string;
  action_url?: string;
  icon?: string;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (font: FontFamily) => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  isDarkMode?: boolean;
}

export interface ThemeButtonProps {
  theme?: Theme;
  onClick?: () => void;
  collapsed?: boolean;
}

export interface InvitationVerificationResult {
  valid: boolean;
  email?: string;
  role?: UserRole;
  expired?: boolean;
  message: string;
}

// Team types
export interface TeamOverviewProps {
  users: User[];
  onUserClick?: (userId: string) => void;
  period?: string;
  dateRange?: { start: Date; end: Date };
  onRefresh?: () => void;
  userId?: string;
  teamId?: string;
  className?: string;
}

// VR Types
export interface VoiceEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  userId?: string;
  maxDuration?: number;
  onCancel?: () => void;
}

// Add Challenge type definition
export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  points: number;
  completions: number;
  progress?: number;
  total?: number;
  type: 'daily' | 'weekly' | 'one-time';
  category: 'emotion' | 'journal' | 'community' | 'coach' | 'activity';
  status?: 'complete' | 'in-progress' | 'not-started' | 'completed';
  completed?: boolean;
  target?: number;
  reward?: number | string;
  title?: string;
}

// Add GamificationStats type definition with all needed properties
export interface GamificationStats {
  points: number;
  level: number;
  rank?: string;
  badges: number | Badge[];
  completedChallenges: number;
  totalChallenges: number;
  streak: number;
  graph?: {
    date: string;
    points: number;
  }[];
  
  // Additional properties
  nextLevel?: number;
  pointsToNextLevel?: number;
  nextLevelPoints?: number;
  challenges?: Challenge[];
  totalPoints?: number;
  currentLevel?: number;
  progressToNextLevel?: number;
  streakDays?: number;
  lastActivityDate?: string;
  activeChallenges?: number;
  badgesCount?: number;
  recentAchievements?: any[];
  leaderboard?: any[];
  streaks?: {
    current: number;
    longest: number;
    lastActivity: string;
  };
}

// Add Badge type definition
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  imageUrl?: string;
  icon?: string;
  threshold?: number;
  type?: string;
  image?: string;
  level?: number | string;
}

// Add LeaderboardEntry type definition
export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
  isCurrentUser?: boolean;
  department?: string;
  level?: number;
}

// Add this type definition for Period
export type Period = 'day' | 'week' | 'month' | 'year' | string;

// Add or update EmotionalTeamViewProps
export interface EmotionalTeamViewProps {
  departmentId?: string;
  teamId?: string;
  users?: User[];
  anonymized?: boolean;
  onUserClick?: (userId: string) => void;
  period?: Period;
  userId?: string;
  className?: string;
  dateRange?: { start: Date; end: Date };
  onRefresh?: () => void;
}

// Add UserModeType
export type UserModeType = 'b2b_admin' | 'b2b_user' | 'b2c' | 'personal' | string;

// Add music-related types that were missing
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  duration?: number;
  emotion?: string;
  cover?: string;
  cover_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  description?: string;
  emotion?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  progress: number;
  duration: number;
  seek: (time: number) => void;
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  setCurrentPlaylist: (playlist: MusicPlaylist | null) => void;
  addToQueue: (track: MusicTrack) => void;
  queue: MusicTrack[];
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
  openDrawer?: boolean;
  setOpenDrawer?: (open: boolean) => void;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  side?: 'left' | 'right' | 'top' | 'bottom';
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface TrackInfoProps {
  track?: MusicTrack;
  className?: string;
  compact?: boolean;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: Error | null;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  className?: string;
  onChange?: (volume: number) => void;
  showLabel?: boolean;
}

// Emotion types
export interface Emotion {
  id: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
  category?: string;
  intensity?: number;
}

export interface EmotionResult {
  emotion: string;
  score?: number;
  intensity?: number;
  date?: string;
  timestamp?: string;
  triggers?: string[];
  recommendations?: string[];
}
