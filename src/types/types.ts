
import { UserRole } from "./user";
import { ThemeName, FontSize, FontFamily, NotificationPreferences as NotificationPrefs } from "./preferences";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
  avatarUrl?: string;
  role?: UserRole;
  preferences?: UserPreferences;
  onboarded?: boolean;
  department?: string;
  position?: string;
  created_at?: string;
  joined_at?: string;
  emotional_score?: number;
}

export interface UserPreferences {
  theme?: ThemeName;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
  language?: string;
  notifications?: NotificationPrefs;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  soundEnabled?: boolean;
  onboardingCompleted?: boolean;
  dashboardLayout?: string;
  privacyLevel?: string;
  notifications_enabled?: boolean;
  notificationPreferences?: NotificationPrefs;
  ambientSound?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  displayName?: string;
  pronouns?: string;
  biography?: string;
  avatarUrl?: string;
  fullAnonymity?: boolean;
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
}

export type NotificationPreferences = NotificationPrefs;

export interface Story {
  id: string;
  title: string;
  content: string;
  date: Date;
  seen: boolean;
  type?: string;
  emotion?: string;
  image?: string;
  cta?: {
    label: string;
    route: string;
  };
}

export type Period = 'day' | 'week' | 'month' | 'year';
export type UserModeType = 'b2c' | 'b2b-collaborator' | 'b2b-admin';
export { UserRole } from './user';

// Type for invitation verification
export interface InvitationVerificationResult {
  valid: boolean;
  message?: string;
  email?: string;
  role?: UserRole;
}
