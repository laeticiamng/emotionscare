
// Export all types from various modules
export * from './types/user';
export * from './types/emotion';
export * from './types/chat';
export * from './types/journal';
export * from './types/mood';
export * from './types/vr';
export * from './types/invitation';
export * from './types/badge';
export * from './types/audio-player';
export * from './types/music';
export * from './types/scan';
export * from './types/gamification';
export * from './types/community';
export * from './types/navigation';
export * from './types/progress-bar';
export * from './types/track-info';
export * from './types/group';
export * from './types/vr-session-music';
export * from './types/notification';
export * from './types/preferences';
export * from './types/report';

// Basic shared types
export type ThemeName = 'light' | 'dark' | 'pastel' | 'nature' | 'starry' | 'misty' | 'system' | 'deep-night';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'dm-sans' | 'atkinson' | 'serif';
export type DynamicThemeMode = 'none' | 'time' | 'emotion' | 'weather';

// Re-export additional specific types
export { UserRole } from './types/user';
export { EmotionalTeamViewProps, EnhancedEmotionResult } from './types/emotion';
export { Emotion, EmotionResult } from './types/emotion';
export { ChatMessage, ChatConversation } from './types/chat';
export { JournalEntry } from './types/journal';
export { MoodData } from './types/mood';
export { VRSession, VRSessionTemplate, VRSessionWithMusicProps } from './types/vr';
export { InvitationStats, InvitationFormData } from './types/invitation';
export { Badge } from './types/badge';
export { MusicTrack, MusicPlaylist, MusicRecommendationCardProps, MusicDrawerProps } from './types/music';
export { User, UserPreferences, UserPreferencesState } from './types/user';
export { NotificationFrequency, NotificationType, NotificationTone } from './types/notification';
export { ProgressBarProps } from './types/progress-bar';
export { TrackInfoProps, VolumeControlProps } from './types/track-info';
export { Report } from './types/report';
export { UseAudioPlayerReturn, UseAudioPlayerStateReturn } from './types/audio-player';
