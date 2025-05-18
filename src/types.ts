
export type {
  User,
  AuthUser,
  UserRole,
  UserWithStatus
} from './types/user';

export type {
  UserPreferences,
} from './types/preferences';

export type {
  UserPreferencesContextType,
} from './types/preferences';

export type {
  FontFamily,
  FontSize,
  ThemeName,
  Theme,
  ThemeContextType,
} from './types/theme';

export type {
  NotificationFrequency,
  NotificationTone,
  NotificationPreference,
} from './types/notification';

export type { UserModeType } from './types/userMode';

export type { 
  KpiCardProps, 
  DraggableKpiCardsGridProps, 
  GlobalOverviewTabProps,
  DashboardWidgetConfig,
  GamificationData,
  KpiCardStatus,
  KpiDelta
} from './types/dashboard';

export type { SidebarContextType } from './types/sidebar';

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
} from './types/music';

export type {
  Badge,
  Challenge
} from './types/badge';

export type {
  ChatMessage,
  ChatConversation,
  ChatResponse,
  CoachCharacterProps,
  CoachMessageProps,
  CoachChatProps
} from './types/coach';

export type {
  MoodData,
  AudioPlaylist,
  AudioTrack,
  AudioProcessorProps,
  EmotionalData
} from './types/audio';

export type {
  Story
} from './types/Story';

export type {
  Emotion,
  EmotionResult,
  LiveVoiceScannerProps,
  TeamOverviewProps,
  EmotionalTeamViewProps
} from './types/emotion';

export type {
  JournalEntry
} from './types/journal';

export type {
  VRSessionTemplate,
  VRSession,
  VRSessionWithMusicProps,
  VRSessionHistoryProps
} from './types/vr';

// B2B Admin dashboard types
export type {
  TeamSummary,
  AdminAccessLog,
  DashboardWidget
} from './types/dashboard';

export type {
  AnonymizedEmotion,
  TeamAnalytics,
  KpiMetric
} from './types/analytics';

export type {
  SegmentOption,
  SegmentDimension,
  SegmentContextType
} from './types/segment';
