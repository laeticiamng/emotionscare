export type UserRole = 'user' | 'admin' | 'manager' | 'wellbeing_manager' | 'coach' | 'employee' | 'b2c' | 'b2b_user' | 'b2b_admin' | 'moderator';

export type Theme = 'light' | 'dark' | 'system';
export type ThemeName = Theme | string;

export type FontSize = 'small' | 'medium' | 'large' | 'x-large' | 'xx-large' | 'extra-large';
export type FontFamily = 'default' | 'serif' | 'mono' | 'sans';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  avatar_url?: string;
  role: UserRole;
  created_at?: string;
  joined_at?: string;
  preferences?: UserPreferences;
  onboarded?: boolean;
  department?: string;
  position?: string;
  emotional_score?: number;
}

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  notifications: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: string;
  };
  autoplayVideos: boolean;
  dataCollection: boolean;
  highContrast?: boolean;
  reduceAnimations?: boolean;
  soundEffects?: boolean;
  colorAccent?: string;
  language: string;
  privacyLevel: string;
  onboardingCompleted?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
  notifications_enabled?: boolean;
  privacy?: {
    anonymousMode?: boolean;
    dataSharing?: boolean;
    profileVisibility?: 'public' | 'team' | 'private';
  };
  dashboardLayout?: string;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  loading: boolean;
  error: string | null;
}

export interface InvitationVerificationResult {
  isValid: boolean;
  invitation?: {
    id: string;
    email: string;
    role: string;
    expires_at: string;
  };
  error?: string;
  message?: string;
}
