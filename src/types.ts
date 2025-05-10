
// Export all types from various modules
export * from './types/user';
export * from './types/emotion';
export * from './types/chat';
export * from './types/journal';
export * from './types/mood';
export * from './types/vr';
export * from './types/invitation';
export * from './types/badge';
// Fix the ambiguous export by being specific with what we export
export type { UseAudioPlayerReturn, UseAudioPlayerStateReturn, AudioPlayerState } from './types/audio-player';
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

// Re-export additional specific types
export { UserRole } from './types/user';
export type { EmotionalTeamViewProps, EnhancedEmotionResult } from './types/emotion';
export type { Emotion, EmotionResult } from './types/emotion';
export type { ChatMessage, ChatConversation } from './types/chat';
export type { JournalEntry } from './types/journal';
export type { MoodData } from './types/mood';
export type { VRSession, VRSessionTemplate, VRSessionWithMusicProps } from './types/vr';
export type { InvitationStats, InvitationFormData } from './types/invitation';
export type { Badge } from './types/badge';
export type { MusicTrack, MusicPlaylist, MusicRecommendationCardProps, MusicDrawerProps, MusicContextType } from './types/music';
export type { User, UserPreferences, UserPreferencesState } from './types/user';
export type { NotificationFrequency, NotificationType, NotificationTone } from './types/notification';
export type { ProgressBarProps } from './types/progress-bar';
export type { TrackInfoProps, VolumeControlProps } from './types/track-info';
export type { Report } from './types/report';
export type { AudioPreference } from './types/audio-player';
