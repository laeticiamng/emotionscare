
import { NotificationPreference } from './notification';

export type ThemeName = "system" | "dark" | "light" | "pastel";
export type FontFamily = "system" | "serif" | "sans-serif" | "sans" | "rounded" | "monospace" | "mono"; 
export type FontSize = "small" | "medium" | "large" | "x-large" | "xs" | "sm" | "md" | "lg" | "xl";
export type Period = "day" | "week" | "month" | "year";
export type UserModeType = "personal" | "work" | "relax" | "focus";
export type PrivacyLevel = 'strict' | 'balanced' | 'relaxed' | 'public' | 'private' | 'friends' | 'organization';
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'formal' | 'friendly' | 'minimal' | 'direct' | 'professional' | 'motivational' | 'neutral' | 'casual';

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  reduceMotion: boolean;
  colorBlindMode: boolean;
  autoplayMedia: boolean;
  soundEnabled: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  notifications: NotificationPreference;
  privacy?: {
    shareData: boolean;
    anonymizeReports?: boolean;
    profileVisibility: string;
    showProfile?: boolean;
    shareActivity?: boolean;
    allowMessages?: boolean;
    allowNotifications?: boolean;
    anonymousMode?: boolean;
  };
  language?: string;
  haptics?: boolean;
  dataCollection?: boolean;
  privacyLevel?: PrivacyLevel;
  animations?: boolean;
  soundEffects?: boolean;
  dashboardLayout?: string;
  onboardingCompleted?: boolean;
  notifications_enabled?: boolean;
  [key: string]: any;
}

export type NotificationPreferences = NotificationPreference;

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  fontSize: "medium",
  fontFamily: "system",
  reduceMotion: false,
  colorBlindMode: false,
  autoplayMedia: true,
  soundEnabled: true,
  notifications: {
    enabled: true,
    emailEnabled: true,
    pushEnabled: true,
    inAppEnabled: true,
    email: true,
    push: true,
    sms: false,
    types: {
      system: true,
      emotion: true,
      coach: true,
      journal: true,
      community: true,
      achievement: true,
      badge: true,
      challenge: true,
      reminder: true,
      info: true,
      warning: true,
      error: true,
      success: true,
      streak: true,
      urgent: true
    },
    frequency: "daily",
    tone: "friendly"
  },
  privacy: {
    shareData: true,
    anonymizeReports: false,
    profileVisibility: "public",
    anonymousMode: false
  },
  privacyLevel: 'balanced',
  dashboardLayout: 'default',
  onboardingCompleted: false,
};
