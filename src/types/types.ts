
// Create or update this file to include the Story interface and other types

export type Period = '1d' | '7d' | '30d' | '90d' | 'custom';

export interface Story {
  id: string;
  title: string;
  content: string;
  image?: string;
  date: Date | string;
  author?: string;
  category?: string;
  tags?: string[];
  type?: 'article' | 'news' | 'blog' | 'resource' | 'onboarding';
  seen?: boolean;
  cta?: {
    label: string;
    route: string;
  };
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface UserPreferences {
  theme?: string;
  notifications?: boolean | {
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
  fontSize?: string;
  fontFamily?: string;
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
  language?: string;
  privacy?: {
    shareData?: boolean;
    anonymizeReports?: boolean;
    profileVisibility?: string;
    showProfile?: boolean;
    shareActivity?: boolean;
    allowMessages?: boolean;
    allowNotifications?: boolean;
  };
}

export type FontFamily = "system" | "serif" | "sans-serif" | "monospace" | "sans" | "inter" | "rounded";
export type FontSize = "small" | "medium" | "large" | "x-large" | "sm" | "md" | "lg" | "xl";

export type UserRole = "admin" | "user" | "manager";

export interface InvitationVerificationResult {
  valid: boolean;
  email?: string;
  expires?: Date;
  role?: UserRole;
  teamId?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  email?: boolean;
  push?: boolean;
  inApp?: boolean;
  frequency?: 'immediate' | 'daily' | 'weekly';
  types?: Record<string, boolean>;
}

export type UserModeType = "standard" | "advanced" | "developer";
