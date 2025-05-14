
import { NotificationPreference } from './notification';

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large';
export type FontFamily = 'system' | 'serif' | 'sans-serif' | 'monospace' | 'rounded';
export type PrivacyLevel = 'high' | 'medium' | 'low' | 'balanced';
export type UserRole = 'admin' | 'user' | 'coach' | 'manager' | 'guest';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  image?: string; // Ajout de 'image' pour compatibilité
  role: UserRole;
  createdAt: string;
  lastLoginAt?: string;
  organizations?: string[];
  teams?: string[];
  preferences?: UserPreferences;
  isOnboarded?: boolean;
  isActive?: boolean;
  metadata?: Record<string, any>;
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
