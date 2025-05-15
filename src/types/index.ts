
// Central export file for all types
import { Theme, FontFamily, FontSize, ThemeContextType, ThemeButtonProps } from './theme';
import { User, UserRole, UserPreferences, AuthContextType } from './user';
import { Emotion, EmotionResult, EnhancedEmotionResult, VoiceEmotionScannerProps, EmotionalTeamViewProps, TeamOverviewProps } from './emotion';
import { Notification, NotificationFrequency, NotificationType, NotificationPreference, NotificationFilter, NotificationTone, NotificationBadge } from './notification';
import { MusicTrack, MusicPlaylist, MusicContextType, MusicDrawerProps, TrackInfoProps, ProgressBarProps, VolumeControlProps } from './music';
import { VRSession, VRSessionTemplate, VRSessionWithMusicProps, VRHistoryListProps, VRTemplateGridProps } from './vr';
import { SidebarContextType, UserModeType, UserModeContextType } from './types';
import { GamificationStats, Challenge, Badge, Period } from './gamification';
import { JournalEntry } from './journal';
import { UseAudioPlayerStateReturn } from './audio-player';

// Export everything
export {
  // Theme related
  Theme, FontFamily, FontSize, ThemeContextType, ThemeButtonProps,
  
  // User related
  User, UserRole, UserPreferences, AuthContextType,
  
  // Emotion related
  Emotion, EmotionResult, EnhancedEmotionResult, VoiceEmotionScannerProps, 
  EmotionalTeamViewProps, TeamOverviewProps,
  
  // Notification related
  Notification, NotificationFrequency, NotificationType, NotificationPreference,
  NotificationFilter, NotificationTone, NotificationBadge,
  
  // Music related
  MusicTrack, MusicPlaylist, MusicContextType, MusicDrawerProps,
  TrackInfoProps, ProgressBarProps, VolumeControlProps,
  
  // VR related
  VRSession, VRSessionTemplate, VRSessionWithMusicProps, VRHistoryListProps,
  VRTemplateGridProps,
  
  // Sidebar related
  SidebarContextType, UserModeType, UserModeContextType,
  
  // Gamification related
  GamificationStats, Challenge, Badge, Period,
  
  // Journal related
  JournalEntry,
  
  // Audio Player related
  UseAudioPlayerStateReturn
};

// Export any commonly used utility types or interfaces
export interface Story {
  id: string;
  title: string;
  content: string;
  type: string;
  seen: boolean;
  emotion?: string;
  image?: string;
  cta?: {
    label: string;
    route: string;
    text?: string;
    action?: string;
  };
}

export interface MoodData {
  date: string;
  originalDate?: string;
  value: number;
  mood?: string;
  sentiment: number;
  anxiety: number;
  energy: number;
}

export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: string;
  sender_type?: string;
  timestamp?: string;
  conversation_id?: string;
  role?: string;
}

export interface EmotionPrediction {
  predictedEmotion: string;
  emotion: string;
  probability: number;
  confidence: number;
  triggers: string[];
  recommendations: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category?: string;
  priority: number;
  confidence: number;
  actionUrl?: string;
  actionLabel?: string;
  type?: 'activity' | 'content' | 'insight';
}

// Re-export types from the ./types file
export * from './types';
