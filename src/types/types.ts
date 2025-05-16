
// Create or update this file to include the Story interface
// This is a minimal implementation to fix the error

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
  type?: 'article' | 'news' | 'blog' | 'resource';
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface UserPreferences {
  theme?: string;
  notifications?: boolean;
}

export type FontFamily = "system" | "serif" | "sans-serif" | "monospace";
export type FontSize = "small" | "medium" | "large";
export type ThemeName = "light" | "dark" | "system";
export type UserRole = "admin" | "user" | "manager";

export interface InvitationVerificationResult {
  valid: boolean;
  email?: string;
  expires?: Date;
  role?: UserRole;
  teamId?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export type UserModeType = "standard" | "advanced" | "developer";
