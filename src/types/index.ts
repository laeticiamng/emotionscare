
// Re-export all types from various modules
export * from './user';
export * from './emotion';
export * from './chat';
export * from './journal';
export * from './mood';
export * from './vr';
export * from './invitation';
export * from './badge';
export * from './audio-player';
export * from './music';
export * from './scan';
export * from './gamification';
export * from './community';
export * from './navigation';
export * from './progress-bar';
export * from './track-info';
export * from './group';
export * from './vr-session-music';
export * from './notification';
export * from './preferences';
export * from './report';

// Basic shared types
export type ThemeName = 'light' | 'dark' | 'pastel' | 'nature' | 'starry' | 'misty' | 'system' | 'deep-night';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'dm-sans' | 'atkinson' | 'serif';
export type DynamicThemeMode = 'none' | 'time' | 'emotion' | 'weather';

// Re-export additional specific types
export { UserRole } from './user';
export type { EmotionalTeamViewProps, EnhancedEmotionResult } from './emotion';
export type { Emotion, EmotionResult } from './emotion';
export type { ChatMessage, ChatConversation } from './chat';
export type { JournalEntry } from './journal';
export type { MoodData } from './mood';
export type { VRSession, VRSessionTemplate, VRSessionWithMusicProps } from './vr';
export type { InvitationStats, InvitationFormData } from './invitation';
export type { Badge } from './badge';
export type { MusicTrack, MusicPlaylist, MusicRecommendationCardProps, MusicDrawerProps, MusicContextType } from './music';
export type { User, UserPreferences, UserPreferencesState } from './user';
export type { NotificationFrequency, NotificationType, NotificationTone } from './notification';
export type { ProgressBarProps } from './progress-bar';
export type { TrackInfoProps, VolumeControlProps } from './track-info';
export type { Report } from './report';
export type { UseAudioPlayerReturn, UseAudioPlayerStateReturn } from './audio-player';
