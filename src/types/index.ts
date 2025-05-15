
// Central export file for all types
import { 
  Theme, 
  FontFamily, 
  FontSize, 
  ThemeContextType,
  ThemeButtonProps 
} from './theme';

import { 
  User, 
  UserRole, 
  UserPreferences,
  AuthContextType
} from './user';

import { 
  Emotion, 
  EmotionResult, 
  EnhancedEmotionResult, 
  VoiceEmotionScannerProps,
  EmotionalTeamViewProps
} from './emotion';

import { 
  Notification, 
  NotificationFrequency, 
  NotificationType, 
  NotificationPreference,
  NotificationFilter
} from './notification';

import { 
  MusicTrack, 
  MusicPlaylist, 
  MusicContextType,
  MusicDrawerProps,
  TrackInfoProps,
  ProgressBarProps,
  VolumeControlProps
} from './music';

import { 
  VRSession, 
  VRSessionTemplate,
  VRSessionWithMusicProps,
  VRHistoryListProps
} from './vr';

import { 
  SidebarContextType
} from './types';

import { 
  GamificationStats, 
  Challenge, 
  Badge, 
  Period 
} from './gamification';

import {
  TeamOverviewProps
} from './scan';

// Export everything as a unified API
export {
  // Theme related types
  Theme, FontFamily, FontSize, ThemeContextType, ThemeButtonProps,
  
  // User related types
  User, UserRole, UserPreferences, AuthContextType,
  
  // Emotion related types
  Emotion, EmotionResult, EnhancedEmotionResult, 
  VoiceEmotionScannerProps, EmotionalTeamViewProps,
  
  // Notification related types
  Notification, NotificationFrequency, NotificationType, 
  NotificationPreference, NotificationFilter,
  
  // Music related types
  MusicTrack, MusicPlaylist, MusicContextType, MusicDrawerProps,
  TrackInfoProps, ProgressBarProps, VolumeControlProps,
  
  // VR related types
  VRSession, VRSessionTemplate, VRSessionWithMusicProps, VRHistoryListProps,
  
  // Sidebar related types
  SidebarContextType,
  
  // Gamification related types
  GamificationStats, Challenge, Badge, Period,
  
  // Scan related types
  TeamOverviewProps
};

// Export additional commonly used types
export * from './types';
