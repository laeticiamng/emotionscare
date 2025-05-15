
// Central export file for all types
export * from './types';

// Specific re-exports to maintain compatibility with existing imports
export type { 
  Emotion,
  EmotionResult,
  EnhancedEmotionResult,
  EmotionalTeamViewProps
} from './types';

export type {
  MusicTrack,
  MusicPlaylist,
  TrackInfoProps,
  VolumeControlProps,
  ProgressBarProps
} from './types';

export type {
  VRSession,
  VRSessionTemplate,
  VRHistoryListProps,
  VRSessionWithMusicPropsType,
  VRTemplateGridProps
} from './types';

export type {
  Challenge,
  Badge,
  GamificationStats
} from './types';

export type {
  UserRole,
  User,
  UserPreferences,
  UserPreferencesState,
  AuthContextType,
  UserModeContextType,
  ThemeContextType,
  ThemeButtonProps
} from './types';

// Additional types that may be needed
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
  LeaderboardEntry,
  FontFamily,
  FontSize,
  ThemeName,
  EmotionalData
} from './types';
