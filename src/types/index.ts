
// Central export file for all types used in the application
// All components should import their types from this file

// Theme types
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

// User types
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

// UserMode types
export type {
  UserModeType,
  UserModeContextType
} from './userMode';

// Sidebar types
export type {
  SidebarContextType
} from './sidebar';

// Music types
export type {
  MusicTrack,
  MusicPlaylist,
  MusicContextType,
  MusicDrawerProps,
  TrackInfoProps,
  ProgressBarProps,
  EmotionMusicParams,
  Track,
  VolumeControlProps
} from './music';

// Notification types
export type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationFrequency,
  NotificationFilter,
  NotificationBadge,
  NotificationPreference,
  NotificationItemProps,
  NotificationChannels,
  NotificationTone,
  NotificationSettings
} from './notification';

// Emotion types
export type {
  Emotion,
  EmotionResult,
  EnhancedEmotionResult,
  VoiceEmotionScannerProps,
  LiveVoiceScannerProps,
  EmotionalTeamViewProps,
  TeamOverviewProps
} from './emotion';

// Dashboard types
export type {
  DraggableKpiCardsGridProps,
  KpiCardProps,
  DashboardWidgetConfig,
  GlobalOverviewTabProps,
  ChartData,
  DashboardStats,
  GamificationData,
  GridPosition
} from './dashboard';

// Gamification types
export type {
  GamificationStats,
  Badge,
  Challenge,
  Period,
  LeaderboardEntry
} from './gamification';

// VR types
export type {
  VRSessionTemplate,
  VRSession,
  VRHistoryListProps,
  VRSessionHistoryProps,
  VRSessionWithMusicProps
} from './vr';

// Chat types
export type {
  ChatMessage,
  ChatResponse,
  ChatResponseType,
  ChatConversation,
  ChatParticipant
} from './chat';

// Audio types
export type {
  AudioTrack,
  AudioPlayerState,
  AudioPlayerContextType
} from './audio';

// Journal types
export type {
  JournalEntry
} from './journal';

// Activity types
export type {
  ActivityTabView,
  ActivityFiltersState,
  AnonymousActivity,
  ActivityStats
} from './activity';

// Community types
export type {
  Post,
  Comment,
  CommunityStats
} from './community';

// Calendar types
export type {
  CalendarEvent,
  CalendarEventType,
  RecurrenceRule,
  CalendarSettings
} from './calendar';

// AI types
export type {
  AIAssistant,
  AIInteraction,
  AIMessage,
  AIRecommendation
} from './ai';

// Group types
export type {
  Group,
  GroupMember,
  GroupPost
} from './group';

// Mood types
export type {
  MoodData,
  MoodTrend,
  MoodInsight,
  MoodStatistics
} from './mood';

// UI types
export type {
  Toast,
  ToastAction
} from './ui';

// Export additional types needed for backward compatibility
export * from './types';
