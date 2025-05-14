
import { NotificationPreference } from './notification';

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large';
export type FontFamily = 'system' | 'serif' | 'sans-serif' | 'monospace' | 'rounded';
export type PrivacyLevel = 'high' | 'medium' | 'low' | 'balanced';
export type UserRole = 'admin' | 'user' | 'coach' | 'manager' | 'guest' | 'b2c' | 'b2b_user' | 'b2b_admin' | 'wellbeing_manager' | 'employee' | 'moderator' | 'analyst';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  displayName?: string;
  avatar?: string;
  avatar_url?: string;
  image?: string;
  role: UserRole;
  created_at?: string;
  createdAt?: string; // This makes createdAt optional to fix compatibility issues
  lastLoginAt?: string;
  organizations?: string[];
  teams?: string[];
  preferences?: UserPreferences;
  isOnboarded?: boolean;
  onboarded?: boolean;
  isActive?: boolean;
  metadata?: Record<string, any>;
  department?: string;
  emotional_score?: number;
  anonymity_code?: string;
  team_id?: string;
}

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language: string;
  notifications: NotificationPreference;
  autoplayVideos: boolean;
  dataCollection: boolean;
  accessibilityFeatures: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  dashboardLayout: string;
  onboardingCompleted: boolean;
  privacyLevel: PrivacyLevel;
  soundEnabled?: boolean;
  fullAnonymity?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  setPreference: (key: string, value: any) => void;
  setPreferences: (preferences: UserPreferences) => void;
  resetPreferences: () => void;
  loading: boolean;
  error: Error | null;
}

export interface InvitationVerificationResult {
  valid: boolean;
  email?: string;
  role?: UserRole;
  message?: string;
  expiresAt?: string;
}
