
export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  avatar_url?: string; // Legacy support
  avatar?: string; // Legacy support
  role?: UserRole;
  status?: 'active' | 'inactive' | 'pending';
  preferences?: UserPreferences;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  joinedAt?: string | Date;
  joined_at?: string | Date; // Legacy support
  lastLogin?: string | Date;
  verifiedEmail?: boolean;
  position?: string;
  department?: string;
  onboarded?: boolean;
  emotional_score?: number;
}

export type UserRole = 'admin' | 'user' | 'guest' | 'premium' | 'b2c' | 'b2b_user' | 'b2b_admin';

export interface UserPreferences {
  theme: "system" | "light" | "dark" | "pastel";
  fontSize: FontSize;
  fontFamily: FontFamily;
  reduceMotion: boolean;
  colorBlindMode: boolean;
  autoplayMedia: boolean;
  language?: string;
  notifications: NotificationPreferences;
  privacy: {
    shareData: boolean;
    anonymizeReports?: boolean;
    profileVisibility: string;
  };
  notifications_enabled?: boolean;
  soundEnabled: boolean;
}

export interface NotificationPreferences {
  enabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  email?: boolean;
  push?: boolean;
  types?: {
    system?: boolean;
    emotion?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
    achievement?: boolean;
  };
  frequency?: string;
}

export type FontFamily = "system" | "serif" | "sans-serif" | "monospace" | "sans" | "inter";
export type FontSize = "small" | "medium" | "large" | "x-large" | "sm" | "md" | "lg" | "xl";
export type ThemeName = "light" | "dark" | "system" | "pastel";

export interface Period {
  start: Date;
  end: Date;
}

export type UserModeType = 'normal' | 'focus' | 'relax' | 'sleep';

export interface InvitationVerificationResult {
  valid: boolean;
  email?: string;
  role?: string;
  message?: string;
}
