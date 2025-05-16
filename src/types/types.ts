
export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  role?: UserRole;
  preferences?: UserPreferences;
}

export type UserRole = "admin" | "user" | "b2b_user" | "b2b_admin" | "guest";

export interface UserPreferences {
  theme?: "light" | "dark" | "system" | "pastel";
  fontSize?: "small" | "medium" | "large";
  fontFamily?: "system" | "serif" | "sans-serif" | "monospace";
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
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
    },
    frequency?: string;
  };
  privacy?: {
    shareData: boolean;
    anonymizeReports: boolean;
    profileVisibility: "public" | "private" | "friends";
  };
  soundEnabled?: boolean;
}

export type ThemeName = "light" | "dark" | "system" | "pastel";
export type FontFamily = "system" | "serif" | "sans-serif" | "monospace";
export type FontSize = "small" | "medium" | "large";

export interface InvitationVerificationResult {
  valid: boolean;
  message: string;
  role?: UserRole;
}

export interface NotificationPreferences {
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
  },
  frequency?: string;
}

export type Period = "day" | "week" | "month" | "year";
export type UserModeType = "light" | "dark" | "system";

export interface Story {
  id: string;
  title: string;
  content: string;
  date: Date;
  seen: boolean;
  type?: string;
  cta?: {
    label: string;
    route: string;
  };
}
