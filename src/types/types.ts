import { ReactNode } from "react";

// User types
export type UserRole = 'admin' | 'manager' | 'wellbeing_manager' | 'coach' | 'team' | 'employee' | 'personal' | 'b2b_admin' | 'b2b-admin' | 'b2b_user' | 'b2b-user' | 'b2c' | 'user';

export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type ThemeName = Theme;
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large' | 'x-large' | 'xl';
export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'merriweather' | 'system' | 'system-ui' | 'sans-serif' | 'serif' | 'mono' | 'monospace' | 'rounded' | 'sans';

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
  createdAt?: string;
  status?: 'active' | 'inactive' | 'pending';
  department?: string;
  joined_at?: string;
  emotional_score?: number;
  last_seen?: string;
  last_active?: string;
  company_id?: string;
  team_id?: string;
  anonymity_code?: string;
  profile?: {
    bio?: string;
    company?: string;
    job_title?: string;
  };
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
    shareEmotionalData?: boolean;
    allowCoaching?: boolean;
    shareData?: boolean;
    anonymizeReports?: boolean;
    publicProfile?: boolean;
    showEmotionalScore?: boolean;
    shareJournalInsights?: boolean;
    anonymousDataContribution?: boolean;
    profileVisibility?: 'public' | 'private' | 'team';
  };
  profileVisibility?: 'private' | 'team' | 'public';
  accessibility?: {
    highContrast: boolean;
    reduceAnimations?: boolean;
    reducedMotion?: boolean;
    screenReader?: boolean;
    largeText?: boolean;
  };
  analytics_consent?: boolean;
  marketing_consent?: boolean;
  sound?: boolean;
  soundEnabled?: boolean;
  notifications_enabled?: boolean;
  privacyLevel?: 'strict' | 'balanced' | 'open' | 'high' | 'medium' | 'low';
  fullAnonymity?: boolean;
  onboardingCompleted?: boolean;
  dashboardLayout?: string;
  timezone?: string;
  dataCollection?: boolean;
  autoplayVideos?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  reduceMotion?: boolean;
  highContrast?: boolean;
  musicPreferences?: {
    autoplay: boolean;
    volume: number;
    preferredGenres: string[];
  };
  [key: string]: any; // For flexibility during development
}

export interface UserPreferencesState extends UserPreferences {
  loading: boolean;
  error: string | null;
  setPreferences?: (preferences: UserPreferences) => void;
  setSinglePreference?: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetPreferences?: () => void;
  setPreference?: (key: keyof UserPreferences, value: any) => void;
  savePreferences?: () => Promise<void>;
  isLoading?: boolean;
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
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  doNotDisturb?: boolean;
  doNotDisturbStart?: string;
  doNotDisturbEnd?: string;
}

export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'none' | 'immediate';
export type NotificationType = 'all' | 'emotions' | 'coach' | 'journal' | 'community' | 'system' | 'warning' | 'error' | 'success' | 'info' | 'achievement' | 'challenge' | 'reminder' | 'important';
export type NotificationTone = 'professional' | 'friendly' | 'minimal' | 'motivational' | 'direct' | 'calm';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  date?: string;
  timestamp?: string | Date;
  createdAt?: string;
  created_at?: string;
  action_url?: string;
  actionUrl?: string;
  icon?: string;
  sender_id?: string;
  recipient_id?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
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
  expires_at?: string;
  message?: string;
  teamId?: string;
  companyId?: string;
  error?: string;
  isValid?: boolean;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Added for compatibility
  signUp: (email: string, name: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  preferences: UserPreferencesState;
}

export interface UserModeContextType {
  userMode: UserModeType;
  setUserMode: (mode: UserModeType) => void;
  isB2BAdmin: boolean;
  isB2BUser: boolean;
  isB2C: boolean;
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
  departmentId?: string;
  anonymized?: boolean;
}

// VR Types
export interface VoiceEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  userId?: string;
  maxDuration?: number;
  onCancel?: () => void;
}

export interface VRSessionTemplate {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  duration: number;
  type?: string;
  thumbnail?: string;
  videoUrl?: string;
  emotion?: string;
  audio_url?: string;
  emotion_target?: string;
  lastUsed?: string | Date;
  preview_url?: string;
  is_audio_only?: boolean;
  benefits?: string[];
  difficulty?: string;
  theme?: string;
  tags?: string[];
  imageUrl?: string;
}

export interface VRSession {
  id: string;
  templateId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  completed: boolean;
  emotionBefore?: string;
  emotionAfter?: string;
  notes?: string;
  rating?: number;
  date?: string;
  startDate?: Date | string;
  startedAt?: string;
  duration_seconds?: number;
  is_audio_only?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
  isCompleted?: boolean;
}

export interface VRHistoryListProps {
  templates?: VRSessionTemplate[];
  sessions?: VRSession[];
  onSelectTemplate?: (template: VRSessionTemplate) => void;
  onSelectSession?: (session: VRSession) => void;
  loading?: boolean;
  onSelect?: (template: VRSessionTemplate) => void;
  title?: string;
  emptyMessage?: string;
  className?: string;
  limit?: number;
}

export interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  onComplete?: (sessionData: VRSession) => void;
  onExit?: () => void;
  session?: VRSession;
  onSessionComplete?: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
  sessionId?: string;
  templateId?: string;
}

// ========================
// Challenge / Gamification types
// ========================
export interface Challenge {
  id: string;
  name: string;
  title?: string;
  description: string;
  icon?: string;
  points: number;
  completions: number;
  progress?: number;
  total?: number;
  type: 'daily' | 'weekly' | 'one-time' | 'streak' | 'count';
  category: 'emotion' | 'journal' | 'community' | 'coach' | 'activity' | 'vr' | 'daily';
  status?: 'complete' | 'in-progress' | 'not-started' | 'completed' | 'ongoing';
  completed?: boolean;
  target?: number;
  reward?: number | string;
}

export interface GamificationStats {
  points: number;
  level: number;
  rank?: string;
  badges: Badge[];
  completedChallenges: number;
  totalChallenges: number;
  streak: number;
  graph?: {
    date: string;
    points: number;
  }[];
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

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
  isCurrentUser?: boolean;
  department?: string;
  level?: number;
  position?: number;
}

// ========================
// Emotion types
// ========================
export interface Emotion {
  id?: string;
  user_id?: string;
  date?: string | Date;
  emotion?: string;
  name?: string;
  color?: string;
  icon?: string;
  description?: string;
  category?: string;
  score?: number;
  confidence?: number;
  intensity?: number;
  text?: string;
  emojis?: string[] | string;
  transcript?: string;
  audio_url?: string;
  ai_feedback?: string;
  recommendations?: string[];
  triggers?: string[];
  feedback?: string;
  timestamp?: string;
  anxiety?: number;
  energy?: number;
  dominantEmotion?: string;
  primaryEmotion?: string;
  [key: string]: any;  // Allow for flexible extension
}

export interface EmotionResult {
  id?: string;
  user_id?: string;
  emotion: string;
  score?: number;
  confidence?: number;
  dominantEmotion?: string;
  primaryEmotion?: string;
  intensity?: number;
  text?: string;
  transcript?: string;
  emojis?: string[] | string;
  timestamp?: string;
  date?: string;
  triggers?: string[];
  feedback?: string;
  ai_feedback?: string;
  recommendations?: string[];
  audio_url?: string;
  [key: string]: any;  // Allow for flexible extension
}

export interface EnhancedEmotionResult extends EmotionResult {
  recommendations?: string[];
  insights?: string[];
  icon?: string;
  color?: string;
  textColor?: string;
  description?: string;
  category?: string;
  coping_strategies?: string[];
  relatedActivities?: {
    id: string;
    title: string;
    description: string;
    duration: number;
  }[];
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  departmentId?: string;
  users?: any[];
  anonymized?: boolean;
  onUserClick?: (userId: string) => void;
  period?: 'day' | 'week' | 'month' | 'year' | string;
  userId?: string;
  className?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  onRefresh?: () => void;
}

// ========================
// Music types
// ========================
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
  audio_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  cover?: string;
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
  onVolumeChange: (volume: number) => void;
  className?: string;
  onChange?: (volume: number) => void;
  showLabel?: boolean;
}

// ========================
// Other types
// ========================
export interface MoodData {
  date: string;
  originalDate?: string;
  value: number;
  mood?: string;
  sentiment: number;
  anxiety: number;
  energy: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  text?: string;
  mood: string;
  mood_score?: number;
  emotion?: string;
  date: Date | string;
  tags?: string[];
  ai_feedback?: string;
  user_id?: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  type: string;
  seen: boolean;
  emotion?: string;
  image?: string;
  cta?: {
    label: string;
    route: string;
    text?: string;
    action?: string;
  };
}

export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: string;
  sender_type?: string;
  timestamp?: string;
  conversation_id?: string;
  role?: string;
}

export interface EmotionPrediction {
  predictedEmotion: string;
  emotion: string;
  probability: number;
  confidence: number;
  triggers: string[];
  recommendations: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category?: string;
  priority: number;
  confidence: number;
  actionUrl?: string;
  actionLabel?: string;
  type?: 'activity' | 'content' | 'insight';
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  rejected: number;
  sent: number;
  completed: number;
  conversionRate: number;
  averageTimeToAccept: number;
  teams: Record<string, number>;
  recent_invites: InvitationData[];
}

export interface InvitationData {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired' | 'rejected';
  created_at: string;
  expires_at: string;
  accepted_at?: string;
  role: string;
}

export interface InvitationFormData {
  email: string;
  role: string;
  message?: string;
  expires_in_days: number;
}

// ========================
// Dashboard types
// ========================
export interface DashboardKpi {
  id: string;
  title: string;
  value: string | ReactNode;
  icon?: any; // LucideIcon, allowing flexibility
  subtitle?: string | ReactNode;
  delta?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
}

export interface DashboardShortcut {
  id: string;
  label: string;
  icon?: any; // LucideIcon
  route: string;
  action?: () => void;
  color?: string;
}

export interface ActivityStats {
  activity_type: string;
  total_count: number;
  percentage: number;
}

export interface ActivityFiltersState {
  searchTerm: string;
  activityType: string;
  startDate?: Date | string;
  endDate?: Date | string;
}

export type ActivityTabView = 'daily' | 'stats';

export interface AnonymousActivity {
  id: string;
  activity_type: string;
  category: string;
  count: number;
  timestamp_day: string;
}

export interface ChartData {
  date: string;
  value: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  averageScore: number;
  criticalAlerts: number;
  completion: number;
  productivity: {
    current: number;
    trend: number;
  };
  emotionalScore: {
    current: number;
    trend: number;
  };
}

export interface GamificationData {
  activeUsersPercent: number;
  totalBadges: number;
  badgeLevels: {
    level: string;
    count: number;
  }[];
  topChallenges: {
    name: string;
    completions: number;
  }[];
}

export interface KpiCardData {
  id: string;
  title: string;
  value: string | React.ReactNode;
  icon: any; // LucideIcon
  delta?: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: React.ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
}

export interface DraggableCardProps extends KpiCardData {
  handle?: boolean;
}
