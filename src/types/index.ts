
// Central export file for all types
import { Theme, FontFamily, FontSize, ThemeContextType, ThemeButtonProps } from './theme';
import { User, UserRole, UserPreferences, AuthContextType, UserPreferencesState } from './user';
import { Emotion, EmotionResult, EnhancedEmotionResult, EmotionalData, EmotionPrediction, EmotionalTeamViewProps } from './emotion';
import { 
  Notification, 
  NotificationFrequency, 
  NotificationType, 
  NotificationTone, 
  NotificationPreference,
  NotificationBadge,
  NotificationFilter
} from './notification';
import { MusicTrack, MusicPlaylist, MusicContextType, MusicDrawerProps } from './music';
import { VRSession, VRSessionTemplate, VRHistoryListProps, VRSessionWithMusicProps, VRTemplateGridProps } from './vr';
import { SidebarContextType } from './types';
import { GamificationStats, Challenge, Badge, Period } from './gamification';
import { UserModeType, UserModeContextType } from './types';
import { AIAssistant, AIInteraction, AIMessage, AIRecommendation } from './ai';
import { TeamOverviewProps } from './scan';
import { VoiceEmotionScannerProps } from './emotion';

// Export everything
export {
  // Theme related types
  Theme, FontFamily, FontSize, ThemeContextType, ThemeButtonProps,
  
  // User related types
  User, UserRole, UserPreferences, UserPreferencesState, AuthContextType,
  
  // Emotion related types
  Emotion, EmotionResult, EnhancedEmotionResult, EmotionalData, EmotionPrediction,
  EmotionalTeamViewProps, VoiceEmotionScannerProps,
  
  // Notification related types
  Notification, NotificationFrequency, NotificationType, NotificationTone, 
  NotificationPreference, NotificationBadge, NotificationFilter,
  
  // Music related types
  MusicTrack, MusicPlaylist, MusicContextType, MusicDrawerProps,
  
  // VR related types
  VRSession, VRSessionTemplate, VRHistoryListProps, VRSessionWithMusicProps,
  VRTemplateGridProps,
  
  // Sidebar related types
  SidebarContextType,
  
  // Gamification related types
  GamificationStats, Challenge, Badge, Period,
  
  // User mode related types
  UserModeType, UserModeContextType,
  
  // AI related types
  AIAssistant, AIInteraction, AIMessage, AIRecommendation,
  
  // Scan related types
  TeamOverviewProps
};

// Export additional types used in the application
export * from './types';
