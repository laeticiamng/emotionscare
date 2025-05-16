
import { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  preferences?: UserPreferences;
  created_at?: string;
}

export type UserRole = 'user' | 'admin' | 'b2c' | 'b2b_user' | 'b2b_admin';

export type FontFamily = "system" | "serif" | "sans-serif" | "monospace" | "sans" | "inter" | "rounded";
export type FontSize = "small" | "medium" | "large" | "x-large" | "sm" | "md" | "lg" | "xl";
export type ThemeName = "light" | "dark" | "pastel" | "system";

export interface UserPreferences {
  theme?: ThemeName;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
  soundEnabled?: boolean;
  notifications?: {
    enabled: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    inAppEnabled?: boolean;
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    types?: {
      system?: boolean;
      emotion?: boolean;
      coach?: boolean;
      journal?: boolean;
      community?: boolean;
      achievement?: boolean;
    };
    frequency?: string;
  };
  privacy?: {
    shareData: boolean;
    anonymizeReports: boolean;
    profileVisibility: string;
  };
}

export interface InvitationVerificationResult {
  valid: boolean;
  expired: boolean;
  teamId?: string;
  teamName?: string;
  role?: string;
  invitedBy?: string;
}

export type Period = 'day' | 'week' | 'month' | 'year' | '24h' | '7d' | '30d' | '90d' | '12m';
export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface Story {
  id: string;
  title: string;
  content: string;
  date?: Date;
  type?: "onboarding" | "achievement" | "tip" | "update";
  seen?: boolean;
  cta?: {
    label: string;
    route: string;
  };
}

// Additional types
export interface NotificationPreferences {
  enabled: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  types?: {
    system?: boolean;
    emotion?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
    achievement?: boolean;
  };
  frequency: string;
}
