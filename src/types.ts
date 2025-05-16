
export type {
  User,
  UserPreferences,
  FontFamily,
  FontSize,
  ThemeName,
  InvitationVerificationResult,
  UserRole,
  NotificationPreferences,
  Period,
  UserModeType
} from './types/types';

export type {
  VRSessionTemplate,
  VRSession,
  VRHistoryListProps,
  VRSessionHistoryProps,
  VRSessionWithMusicProps
} from './types/vr';

// Export types from music
export type {
  MusicTrack,
  MusicPlaylist,
  MusicContextType,
  MusicDrawerProps,
  ProgressBarProps,
  VolumeControlProps,
  MusicControlsProps,
  MusicLibraryProps,
  EmotionMusicParams
} from './types/music';

// Export type from sidebar
export type { 
  SidebarContextType 
} from './types/sidebar';

// Export from dashboard
export type { 
  KpiCardProps, 
  DraggableKpiCardsGridProps, 
  GlobalOverviewTabProps,
  DashboardWidgetConfig,
  GamificationData
} from './types/dashboard';

export type {
  ChatMessage,
  MoodData,
  JournalEntry,
  Story,
  EmotionPrediction,
  Recommendation,
  InvitationStats,
  InvitationData,
  InvitationFormData,
  UserPreference
} from './types/other';
