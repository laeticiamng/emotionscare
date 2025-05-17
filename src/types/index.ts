// Central export of all types for the application
// User-related types
export type {
  User,
  UserPreferences,
  UserRole,
  UserPreferencesContextType,
} from './user';

// Theme and style types
export type {
  ThemeName,
  FontFamily,
  FontSize,
  Period,
  UserModeType,
} from './preferences';

// VR-related types
export type {
  VRSessionTemplate,
  VRSession,
  VRHistoryListProps,
  VRSessionHistoryProps,
  VRSessionWithMusicProps,
  VRTemplateGridProps
} from './vr';

// Music-related types
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

// Emotion and scan types
export type {
  Emotion,
  EmotionResult,
  LiveVoiceScannerProps,
  TeamOverviewProps,
  EmotionalTeamViewProps
} from './emotions';

// Badge and gamification types
export type {
  Badge
} from './badge';

export type {
  Challenge,
  ChallengeType,
  UserChallenge,
  ChallengeCompletion
} from './challenges';

// Theme context types
export type {
  Theme,
  ThemeContextType,
} from './theme';

// Notification types
export type {
  NotificationType,
  NotificationTone,
  NotificationPreference,
  NotificationFrequency,
  Notification,
  NotificationFilter,
  NotificationSettings
} from './notification';

// Sidebar types
export type { 
  SidebarContextType 
} from './sidebar';

// Dashboard types
export type { 
  KpiCardProps, 
  DraggableKpiCardsGridProps, 
  DraggableCardProps
} from './dashboard/admin/draggable/types';

export type {
  GlobalOverviewTabProps,
  DashboardWidgetConfig,
  GamificationData
} from './types';

// Chat and messaging types
export type {
  ChatMessage,
  ChatResponse,
  ChatResponseType,
  ChatConversation,
  ChatParticipant
} from './chat';

// Other common types
export type {
  MoodData,
  JournalEntry,
  EmotionPrediction,
  Recommendation
} from './other';

// Activity and usage types
export type {
  ActivityTabView,
  ActivityFiltersState,
  AnonymousActivity,
  ActivityStats
} from './activity';

// Audio player types
export type {
  AudioTrack,
  UseAudioPlayerStateReturn,
  AudioPlayerState,
  AudioPlayerContextType
} from './audio';

// Coach and AI types
export type {
  CoachMessage,
  CoachEvent,
  CoachAction,
  CoachCharacterProps,
  CoachChatProps,
  EmotionalData,
  EmotionalTrend,
  CoachNotification
} from './coach';

// Calendar types
export type {
  CalendarEvent,
  CalendarEventType,
  RecurrenceRule,
  CalendarSettings
} from './calendar';
