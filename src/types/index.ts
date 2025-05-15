// Central export file for all types used in the application
// All components should import their types from this file

// Exports for theme-related types
export type {
  Theme,
  FontSize,
  FontFamily,
  ThemeContextType,
  ThemeButtonProps,
  ThemeSwitcherProps,
  ColorPalette,
  ThemeName
} from './theme';

// Exports for user-related types
export type {
  User,
  UserRole,
  UserPreferences,
  UserPreferencesState,
  AuthContextType,
  InvitationVerificationResult,
  DashboardLayout,
  NotificationPreferences
} from './user';

// Exports for user mode types
export type {
  UserModeType,
  UserModeContextType,
  JournalEntry
} from './types';

// Exports for sidebar types
export type {
  SidebarContextType,
  SidebarProps
} from './sidebar';

// Exports for music-related types
export type {
  MusicTrack,
  MusicPlaylist,
  MusicContextType,
  MusicDrawerProps,
  TrackInfoProps,
  ProgressBarProps,
  VolumeControlProps,
  EmotionMusicParams,
  Track
} from './music';

// Exports for notification types
export type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationFrequency,
  NotificationTone,
  NotificationFilter,
  NotificationBadge,
  NotificationPreference,
  NotificationItemProps,
  NotificationChannels
} from './notification';

// Exports for VR-related types
export type {
  VRSession,
  VRSessionTemplate,
  VRHistoryListProps,
  VRSessionWithMusicProps,
  VRTemplateGridProps,
  VRSessionWithMusicPropsType,
  VRSessionHistoryProps
} from './vr';

// Exports for emotion types
export type {
  Emotion,
  EmotionResult,
  EnhancedEmotionResult,
  VoiceEmotionScannerProps,
  LiveVoiceScannerProps,
  EmotionalTeamViewProps,
  TeamOverviewProps
} from './emotion';

// Exports for dashboard types
export type {
  DraggableKpiCardsGridProps,
  KpiCardProps,
  DashboardWidgetConfig,
  GlobalOverviewTabProps,
  ChartData,
  DashboardStats,
  GamificationData,
  GridPosition,
  TeamOverviewProps as DashboardTeamOverviewProps
} from './dashboard';

// Exports for gamification types
export type {
  GamificationStats,
  Badge,
  Challenge,
  Period,
  LeaderboardEntry
} from './gamification';

// Exports for audio player types
export type {
  UseAudioPlayerStateReturn,
  EnhancedMusicVisualizerProps
} from './audio-player';

// Exports for chart types
export type {
  ChartConfig,
  ChartContextProps
} from './chart';

// Exports for activity logs types
export type {
  ActivityTabView,
  ActivityFiltersState,
  AnonymousActivity,
  ActivityStats
} from './activity-logs/types';

// Exports for coaching types
export type {
  CoachMessage,
  CoachEvent,
  CoachAction,
  EmotionalData,
  EmotionalTrend,
  CoachNotification
} from './coach';

// Generic types used throughout the application
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

export interface MoodData {
  date: string;
  originalDate?: string;
  value: number;
  mood?: string;
  sentiment: number;
  anxiety: number;
  energy: number;
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

// Re-exporting important types for backward compatibility
export * from './types';
