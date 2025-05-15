
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

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
  avatarUrl?: string;
  onboarded?: boolean;
  preferences?: UserPreferences;
  jobTitle?: string;
  position?: string;
  createdAt?: string;
  status?: 'active' | 'inactive' | 'pending';
  department?: string;
  joinedAt?: string;
  emotionalScore?: number;
  lastSeen?: string;
  lastActive?: string;
  companyId?: string;
  teamId?: string;
  anonymityCode?: string;
  profile?: {
    bio?: string;
    company?: string;
    jobTitle?: string;
  };
  // For backward compatibility
  avatar_url?: string;
  job_title?: string;
  created_at?: string;
  joined_at?: string;
  emotional_score?: number;
  last_seen?: string;
  last_active?: string;
  company_id?: string;
  team_id?: string;
  anonymity_code?: string;
}

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language: string;
  notifications: NotificationPreference;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
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
  };
  profileVisibility?: 'private' | 'team' | 'public';
  accessibility?: {
    highContrast: boolean;
    reduceAnimations?: boolean;
    reducedMotion?: boolean;
    screenReader?: boolean;
    largeText?: boolean;
  };
  analyticsConsent?: boolean;
  marketingConsent?: boolean;
  sound?: boolean;
  soundEnabled?: boolean;
  notificationsEnabled?: boolean;
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
  // For backward compatibility
  email_notifications?: boolean;
  push_notifications?: boolean;
  analytics_consent?: boolean;
  marketing_consent?: boolean;
  notifications_enabled?: boolean;
  onboarding_completed?: boolean;
  dashboard_layout?: string;
  data_collection?: boolean;
  autoplay_videos?: boolean;
  emotional_camouflage?: boolean;
  ai_suggestions?: boolean;
  reduce_motion?: boolean;
  high_contrast?: boolean;
  [key: string]: any; // For flexibility during development
}

export interface UserPreferencesState {
  preferences: UserPreferences;
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
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  doNotDisturb?: boolean;
  doNotDisturbStart?: string;
  doNotDisturbEnd?: string;
  // For backward compatibility
  quiet_hours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'none' | 'immediate';
export type NotificationType = 'all' | 'emotions' | 'emotion' | 'coach' | 'journal' | 'community' | 'system' | 'warning' | 'error' | 'success' | 'info' | 'achievement' | 'challenge' | 'reminder' | 'important';
export type NotificationTone = 'professional' | 'friendly' | 'minimal' | 'motivational' | 'direct' | 'calm';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  date?: string;
  timestamp?: string | Date;
  createdAt?: string;
  actionUrl?: string;
  icon?: string;
  senderId?: string;
  recipientId?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  // For backward compatibility
  user_id?: string;
  action_url?: string;
  created_at?: string;
  sender_id?: string;
  recipient_id?: string;
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

export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  isMobile?: boolean;
}

export interface InvitationVerificationResult {
  valid: boolean;
  email?: string;
  role?: UserRole;
  expired?: boolean;
  expiresAt?: string;
  message?: string;
  teamId?: string;
  companyId?: string;
  error?: string;
  isValid?: boolean;
  // For backward compatibility
  expires_at?: string;
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
  emotionTarget?: string; // Added this property
  audioUrl?: string;
  lastUsed?: string | Date;
  previewUrl?: string;
  isAudioOnly?: boolean;
  benefits?: string[];
  difficulty?: string;
  theme?: string;
  tags?: string[];
  imageUrl?: string;
  completionRate?: number;
  recommendedMood?: string;
  category?: string; // Added to fix errors
  emotions?: string[]; // Added to fix errors
  // For backward compatibility
  emotion_target?: string;
  preview_url?: string;
  is_audio_only?: boolean;
  image_url?: string;
  audio_url?: string;
  completion_rate?: number;
  recommended_mood?: string;
  video_url?: string;
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
  durationSeconds?: number;
  isAudioOnly?: boolean;
  heartRateBefore?: number;
  heartRateAfter?: number;
  isCompleted?: boolean;
  emotions?: string[]; // Added to fix errors
  // For backward compatibility
  template_id?: string;
  user_id?: string;
  start_time?: string;
  end_time?: string;
  emotion_before?: string;
  emotion_after?: string;
  started_at?: string;
  duration_seconds?: number;
  is_audio_only?: boolean;
  heart_rate_before?: number;
  heart_rate_after?: number;
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

export interface VRSessionWithMusicPropsType {
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

// Alias for VRSessionWithMusicProps
export interface VRSessionWithMusicProps extends VRSessionWithMusicPropsType {}

export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelect: (template: VRSessionTemplate) => void;
  filter?: string;
  className?: string;
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
  completions?: number;
  progress?: number;
  total?: number;
  type: 'daily' | 'weekly' | 'one-time' | 'streak' | 'count' | 'completion' | string;
  category: 'emotion' | 'journal' | 'community' | 'coach' | 'activity' | 'vr' | 'daily' | 'mindfulness' | 'scan' | string;
  status?: 'complete' | 'in-progress' | 'not-started' | 'completed' | 'ongoing' | 'active' | string;
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
  rewards?: string[]; // Added to fix errors
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  awardedAt?: Date | string;
  icon?: string;
  unlocked?: boolean;
  level?: string | number;
  threshold?: number;
  points?: number;
  userId?: string;
  iconUrl?: string;
  totalRequired?: number;
  category?: string;
  // For backward compatibility
  image_url?: string;
  awarded_at?: Date | string;
  image?: string;
  dateEarned?: string;
  user_id?: string;
  icon_url?: string;
  total_required?: number;
  type?: string; // Added to fix Badge type issues
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
  userId?: string;
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
  audioUrl?: string;
  aiFeedback?: string;
  recommendations?: string[];
  triggers?: string[];
  feedback?: string;
  timestamp?: string;
  anxiety?: number;
  energy?: number;
  dominantEmotion?: string;
  primaryEmotion?: string;
  source?: string; // Added to fix EmotionData source property
  // For backward compatibility
  user_id?: string;
  audio_url?: string;
  ai_feedback?: string;
  [key: string]: any;  // Allow for flexible extension
}

export interface EmotionResult {
  id?: string;
  userId?: string;
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
  aiFeedback?: string;
  recommendations?: string[];
  audioUrl?: string;
  source?: string; // Added for compatibility
  // For backward compatibility
  user_id?: string;
  ai_feedback?: string;
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
  copingStrategies?: string[];
  relatedActivities?: {
    id: string;
    title: string;
    description: string;
    duration: number;
  }[];
  // For backward compatibility
  coping_strategies?: string[];
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

export interface EmotionalData {
  id?: string;
  emotion: string;
  intensity: number;
  timestamp: Date | string;
  context?: string;
  userId?: string; 
  source?: string;
  feedback?: string;
  // For backward compatibility
  user_id?: string;
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
  // For backward compatibility
  cover?: string;
  cover_url?: string;
  audio_url?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  description?: string;
  emotion?: string;
  // For backward compatibility
  cover?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack?: () => void;
  previousTrack?: () => void; // For compatibility
  volume: number;
  isMuted?: boolean;
  toggleMute?: () => void;
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

export interface TrackListProps {
  tracks: MusicTrack[];
  currentTrack: MusicTrack;
  onSelect: (track: MusicTrack) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
  onChange?: (volume: number) => void;
  showLabel?: boolean;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  className?: string;
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
  moodScore?: number;
  emotion?: string;
  date: Date | string;
  tags?: string[];
  aiFeedback?: string;
  userId?: string;
  // For backward compatibility
  mood_score?: number;
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
  senderType?: string;
  timestamp?: string;
  conversationId?: string;
  role?: string;
  // For backward compatibility
  sender_type?: string;
  conversation_id?: string;
}

export interface EmotionPrediction {
  predictedEmotion: string;
  emotion: string;
  probability: number;
  confidence: number;
  triggers: string[];
  recommendations: string[];
  name?: string; // Added to fix errors
  intensity?: number; // Added to fix errors
  score?: number; // Added to fix errors
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
  // For backward compatibility
  action_url?: string;
  action_label?: string;
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
  recentInvites: InvitationData[];
  // For backward compatibility
  recent_invites?: InvitationData[];
  conversion_rate?: number;
  average_time_to_accept?: number;
}

export interface InvitationData {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired' | 'rejected';
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
  role: string;
  // For backward compatibility
  created_at?: string;
  expires_at?: string;
  accepted_at?: string;
}

export interface InvitationFormData {
  email: string;
  role: string;
  message?: string;
  expiresInDays: number;
  // For backward compatibility
  expires_in_days?: number;
}

// ========================
// Dashboard types
// ========================
export interface DashboardKpi {
  id: string;
  title: string;
  value: string | ReactNode;
  icon?: LucideIcon; // LucideIcon, allowing flexibility
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
  icon?: LucideIcon;
  route: string;
  action?: () => void;
  color?: string;
}

// KPI Card Types
export interface KpiCardData {
  id: string;
  title: string;
  value: string | React.ReactNode;
  icon: LucideIcon;
  delta?: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: React.ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
}

// Props for our draggable card component
export interface DraggableCardProps extends KpiCardData {
  handle?: boolean;
}

// Dashboard activity types
export type ActivityTabView = 'daily' | 'stats';

export interface ActivityFiltersState {
  searchTerm: string;
  activityType: string;
  startDate?: Date | string;
  endDate?: Date | string;
}

export interface AnonymousActivity {
  id: string;
  activity_type: string;
  category: string;
  count: number;
  timestamp_day: string;
}

export interface ActivityStats {
  activity_type: string;
  total_count: number;
  percentage: number;
}

// Used for hooks that return void
export type UseGamificationReturn = {
  badges: Badge[];
  challenges: Challenge[];
  stats: GamificationStats;
  completeChallenge: (challengeId: string) => void;
  isLoading?: boolean;
  loading?: boolean;
  error?: string | null;
  refresh?: () => void;
};

export interface EmotionScanSectionProps {
  collapsed: boolean;
  onToggle: () => void;
  userId?: string;
  latestEmotion?: {
    emotion: string;
    score: number;
  };
  userMode?: string;
}

// Charts types
export interface ChartConfig {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<"light" | "dark", string> }
  );
}

export interface ChartContextProps {
  config: ChartConfig;
}

export interface DashboardWidgetConfig {
  id: string;
  type: string;
  position: number;
  title?: string;
  settings?: {
    title?: string;
    value?: string;
    trend?: string;
    [key: string]: any;
  };
  [key: string]: any;
}
