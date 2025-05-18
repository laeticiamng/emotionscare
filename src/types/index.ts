
// Re-export all types for easy imports
export * from './user';
export * from './auth';
export * from './badge';
export * from './chat';
export * from './dashboard';
export * from './music';
export * from './notification';
export * from './preferences';
export * from './theme';
export * from './userMode';
export * from './emotions';
export * from './journal';
export * from './Story';
export * from './sidebar';
export * from './vr';

// Export specific type aliases 
export type { 
  KpiCardProps, 
  DraggableKpiCardsGridProps, 
  GlobalOverviewTabProps,
  DashboardWidgetConfig,
  GamificationData,
  LeaderboardEntry,
} from './dashboard';

export type {
  User,
  UserPreferences,
  UserRole,
  UserWithStatus
} from './user';

export type {
  UserPreferencesContextType,
} from './preferences';

export type {
  FontFamily,
  FontSize,
  ThemeName,
  Theme,
  ThemeContextType,
} from './theme';

export type {
  NotificationFrequency,
  NotificationTone,
  NotificationPreference,
} from './notification';

export type {
  MusicTrack,
  MusicPlaylist,
  MusicContextType,
  MusicDrawerProps,
  ProgressBarProps,
  VolumeControlProps,
  MusicControlsProps,
  MusicLibraryProps,
  EmotionMusicParams,
  TrackInfoProps
} from './music';

export type {
  Badge,
  Challenge
} from './badge';

export type {
  ChatMessage,
  ChatConversation,
  ChatResponse
} from './chat';
