
import { NotificationPreference } from './notification';

export type ThemeName = "system" | "dark" | "light" | "pastel";
export type FontFamily = "system" | "serif" | "sans-serif" | "monospace"; 
export type FontSize = "small" | "medium" | "large" | "x-large";
export type Period = "day" | "week" | "month" | "year";
export type UserModeType = "personal" | "work" | "relax" | "focus";

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
    anonymizeReports: boolean;
    profileVisibility: string;
  };
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
    },
    frequency: "daily",
    tone: "friendly"
  },
  privacy: {
    shareData: true,
    anonymizeReports: false,
    profileVisibility: "public"
  }
};
