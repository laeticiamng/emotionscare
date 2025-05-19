
// Re-export all types from respective type files

export type {
  User,
  AuthUser,
  UserRole,
  UserWithStatus
} from './types/user';

export type {
  UserPreferences,
  UserPreferencesFormProps,
  UserPreferencesContextType,
} from './types/preferences';

export type {
  FontFamily,
  FontSize,
  ThemeName,
  Theme,
  ThemeContextType,
  ThemeOption,
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
  DashboardWidget,
  GamificationData,
  KpiCardStatus,
  KpiDelta,
  KpiCardsGridProps,
  TeamSummary,
  AdminAccessLog
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
  EmotionalTeamViewProps,
  EmotionRecommendation,
  TextEmotionScannerProps,
  EmojiEmotionScannerProps,
  VoiceEmotionScannerProps
} from './types/emotion';

export type {
  MoodEvent,
  Prediction,
  PredictionRecommendation,
  EmotionalLocation,
  SanctuaryWidget,
  EmotionalSynthesis,
  OrchestrationEvent
} from '@types/orchestration';

export type {
  JournalEntry
} from './types/journal';

export type {
  VRSessionTemplate,
  VRSession,
  VRSessionWithMusicProps,
  VRSessionHistoryProps,
  VRTemplateDetailProps
} from './types/vr';

export type {
  SegmentOption,
  SegmentDimension,
  SegmentContextType
} from './types/segment';

export type {
  AnonymizedEmotion,
  TeamAnalytics,
  KpiMetric
} from './types/analytics';

export type {
  ScanType,
  ScanResult,
  ScanHistoryItem,
  EmotionGamificationStats
} from './types/scan';
