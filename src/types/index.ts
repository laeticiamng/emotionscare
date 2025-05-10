
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
export { EmotionalTeamViewProps, EnhancedEmotionResult } from './emotion';
export { Emotion, EmotionResult } from './emotion';
export { ChatMessage, ChatConversation, InvitationVerificationResult } from './chat';
export { JournalEntry } from './journal';
export { MoodData } from './mood';
export { VRSession, VRSessionTemplate, VRSessionWithMusicProps } from './vr';
export { InvitationStats, InvitationFormData } from './invitation';
export { Badge } from './badge';
export { MusicTrack, MusicPlaylist, MusicRecommendationCardProps, MusicDrawerProps, MusicContextType } from './music';
export { User, UserPreferences, UserPreferencesState } from './user';
export { NotificationFrequency, NotificationType, NotificationTone } from './notification';
export { ProgressBarProps } from './progress-bar';
export { TrackInfoProps, VolumeControlProps } from './track-info';
export { Report } from './report';
export { UseAudioPlayerReturn, UseAudioPlayerStateReturn } from './audio-player';
