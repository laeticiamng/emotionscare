// Export all types from various files to provide a unified interface

// User related types
export type {
  User,
  UserPreferences,
  UserRole,
  AuthContextType,
  UserPreferencesContextType,
  UserPreferencesState,
  DashboardLayout,
  InvitationVerificationResult,
} from './user';

// Theme related types
export type {
  Theme,
  ThemeContextType,
  ThemeButtonProps,
  FontFamily,
  FontSize,
  ThemeName
} from './theme';

// Music related types
export type {
  MusicTrack,
  MusicPlaylist,
  MusicContextType,
  MusicDrawerProps,
  Track,
  ProgressBarProps,
  TrackInfoProps,
  VolumeControlProps,
  MusicLibraryProps
} from './music';

// Notification related types
export type {
  Notification,
  NotificationPreferences,
  NotificationPreference,
  NotificationFrequency,
  NotificationType,
  NotificationTone,
  NotificationFilter,
  NotificationItemProps,
  NotificationChannels
} from './notification';

// Gamification related types
export type {
  Challenge,
  GamificationStats,
  LeaderboardEntry,
  Badge
} from './gamification';

// Audio player related types
export type {
  UseAudioPlayerStateReturn,
  AudioTrack,
  AudioPlayerContextType
} from './audio-player';

// VR related types
export type {
  VRSession,
  VRSessionTemplate,
  VRHistoryListProps,
  VRSessionHistoryProps,
  VRSessionWithMusicProps
} from './vr';

// Progress bar related types
export type {
  ProgressBarProps as ProgressProps
} from './progress-bar';

// Track info related types
export type {
  TrackInfoProps as TrackProps,
  VolumeControlProps as VolumeProps
} from './track-info';

// Sidebar related types
export type { SidebarContextType } from './sidebar';

// Other shared types
export type {
  Period,
  UserModeType,
  UserModeContextType,
  JournalEntry
} from './types';

// Dashboard related types
export type {
  KpiCardProps,
  DraggableKpiCardsGridProps,
  GlobalOverviewTabProps,
  DashboardWidgetConfig,
  GamificationData
} from './dashboard';

// Emotion related types
export type {
  Emotion,
  EmotionResult,
  EnhancedEmotionResult,
  EmotionalTeamViewProps,
  LiveVoiceScannerProps,
  VoiceEmotionScannerProps,
  TeamOverviewProps
} from './emotion';

// Export additional types needed for backward compatibility
export * from './types';
