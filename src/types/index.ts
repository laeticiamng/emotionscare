
// Central export file for all types
export * from './types';

// Specific re-exports for backward compatibility
export type { 
  Emotion,
  EmotionResult,
  EnhancedEmotionResult,
  EmotionalTeamViewProps,
  EmotionalData
} from './types';

export type {
  MusicTrack,
  MusicPlaylist,
  TrackInfoProps,
  VolumeControlProps,
  ProgressBarProps,
  MusicContextType,
  MusicDrawerProps
} from './types';

export type {
  VRSession,
  VRSessionTemplate,
  VRHistoryListProps,
  VRSessionWithMusicPropsType,
  VRTemplateGridProps,
  VRSessionWithMusicProps
} from './types';

export type {
  Challenge,
  Badge,
  GamificationStats,
  LeaderboardEntry
} from './types';

export type {
  UserRole,
  User,
  UserPreferences,
  UserPreferencesState,
  AuthContextType,
  UserModeContextType,
  ThemeContextType,
  ThemeButtonProps,
  SidebarContextType,
  Theme,
  FontFamily,
  FontSize
} from './types';

// Additional type re-exports
export type {
  Notification,
  NotificationFrequency,
  NotificationType,
  NotificationTone,
  NotificationPreference
} from './types';

export type {
  Period,
  ChatMessage,
  Story,
  JournalEntry,
  MoodData,
  EmotionPrediction,
  Recommendation,
  InvitationStats,
  InvitationData,
  InvitationFormData,
  InvitationVerificationResult,
  EmotionalData
} from './types';

// Add missing export for EmotionMusicParams
export type { EmotionMusicParams } from './types';

