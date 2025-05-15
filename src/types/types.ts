// This file just contains the selected type definitions needed to fix errors

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  avatar?: string;
  role: UserRole;
  created_at: string;
  onboarded?: boolean;
  department?: string;
  position?: string;
  joined_at?: string;
  emotional_score?: number;
  preferences?: UserPreferences;
}

export type UserRole = 'user' | 'admin' | 'moderator' | 'guest' | 'professional' | 'b2b_admin' | 'b2b-admin';

export type UserModeType = 'individual' | 'professional' | 'b2b-admin' | 'b2b-user';

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  reduceMotion: boolean;
  colorBlindMode: boolean;
  autoplayMedia: boolean;
  dashboardLayout?: string;
  notifications: NotificationPreferences;
  privacy?: {
    shareData?: boolean;
    anonymizeReports?: boolean;
    publicProfile?: boolean;
    anonymousMode?: boolean;
    dataSharing?: boolean;
    profileVisibility?: 'team' | 'public' | 'private';
    showEmotionalScore?: boolean;
    shareJournalInsights?: boolean;
    anonymousDataContribution?: boolean;
    shareEmotionalData?: boolean;
  };
  displayName?: string;
  pronouns?: string;
  biography?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  channels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  frequency?: 'immediate' | 'daily' | 'weekly' | 'never';
  types?: Record<'system' | 'emotion' | 'journal' | 'coach' | 'community' | 'achievement', boolean>;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export type FontFamily = 'inter' | 'system' | 'mono' | 'rounded' | 'serif';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
export type ThemeName = 'light' | 'dark' | 'system';

export type Period = 'day' | 'week' | 'month' | 'year' | 'all';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  threshold?: number;
  type?: string;
  imageUrl?: string;
  image_url?: string;
  unlocked?: boolean; // Added for BadgeGrid
  category?: string;  // Added for BadgeGrid
}

export interface InvitationVerificationResult {
  valid: boolean;
  expired?: boolean;
  error?: string;
  invitation?: {
    email: string;
    role: string;
    expires_at: string;
  };
}
