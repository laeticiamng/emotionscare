
// Central export file for all types
export * from './types';

// Export specific types from ThemeContext for direct import
export type { 
  Theme, 
  FontFamily, 
  FontSize,
  ThemeContextType 
} from '@/contexts/ThemeContext';

// Specific re-exports for backward compatibility
export type { 
  Emotion,
  EmotionResult,
  EnhancedEmotionResult,
  EmotionalTeamViewProps,
  EmotionalData,
  SidebarContextType,
  ThemeButtonProps,
  AuthContextType,
  UserModeContextType,
  UserModeType,
} from './types';

export type {
  MusicTrack,
  MusicPlaylist,
  TrackInfoProps,
  VolumeControlProps,
  ProgressBarProps,
  MusicContextType,
  MusicDrawerProps,
  EmotionMusicParams
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
} from './gamification';

export type {
  UserRole,
  User,
  UserPreferences,
  UserPreferencesState,
  Period,
  InvitationVerificationResult,
  ThemeName
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
  EmotionalData
} from './types';
