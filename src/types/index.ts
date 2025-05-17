
// Centralisation des exports de types pour simplifier les imports

// Types de base
export type { User, UserPreferences } from './user';
export type { Theme, ThemeName, FontFamily, FontSize, ThemeContextType } from './theme';
export type { NotificationFrequency, NotificationType, NotificationPreference, NotificationTone } from './notification';
export type { SidebarContextType } from './sidebar';

// Types liés aux fonctionnalités
export type { Badge } from './badge';
export type { Challenge, ChallengeCollection } from './challenges';
export type { AudioTrack, AudioPlayerState, AudioContextValue } from './audio';

// Types liés aux interfaces utilisateur
export type { Toast, ToastProps, ToastActionElement } from './toast';

// Types de contextes
export type { CoachContextType, ChatMessage, Conversation } from './coach';
