
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
} from './sidebar';

// Exports for music-related types
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

// Exports for notification types
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
  GridPosition
} from './dashboard';

// Exports for gamification types
export type {
  GamificationStats,
  Badge,
  Challenge,
  Period,
  LeaderboardEntry
} from './gamification';

// Re-exporting important types for backward compatibility
export * from './types';
