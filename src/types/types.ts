
import { UserRole } from "./user";
import { ThemeName, FontSize, FontFamily } from "./preferences";

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
  notifications?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  soundEnabled?: boolean;
  onboardingCompleted?: boolean;
  dashboardLayout?: string;
  privacyLevel?: string;
  notifications_enabled?: boolean;
  notificationPreferences?: NotificationPreferences;
  privacy?: {
    shareData: boolean;
    anonymizeReports?: boolean;
    profileVisibility: string;
    showProfile?: boolean;
    shareActivity?: boolean;
    allowMessages?: boolean;
    allowNotifications?: boolean;
  };
}

export type NotificationPreferences = {
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
  },
  frequency?: string;
};

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

export type Period = 'day' | 'week' | 'month' | 'year';
export type UserModeType = 'b2c' | 'b2b-collaborator' | 'b2b-admin';
export { UserRole } from './user'; // Exporter UserRole de user.ts

// Type pour la vérification des invitations
export interface InvitationVerificationResult {
  valid: boolean;
  message?: string;
  email?: string;
  role?: UserRole;
}
