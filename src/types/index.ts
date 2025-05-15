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
  LeaderboardEntry
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

// Other shared types
export type {
  Period,
  Badge,
  UserModeType,
  UserModeContextType,
  JournalEntry
} from './types';

// Re-export SidebarContextType
export type { SidebarContextType } from './sidebar';

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
