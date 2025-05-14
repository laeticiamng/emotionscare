
export type UserRole = 'admin' | 'manager' | 'employee' | 'coach' | 'wellbeing_manager' | 'b2c' | 'user';

export type ThemeName = 'light' | 'dark' | 'system';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type FontSize = 'small' | 'medium' | 'large';

export interface UserPreferencesState {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  reduceMotion: boolean;
  highContrast: boolean;
}

export interface UserPreferences extends UserPreferencesState {
  language: string;
  timezone: string;
  notifications?: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: string;
    types: Record<string, boolean>;
    tone: string;
    quietHours?: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  privacy?: {
    profileVisibility: 'public' | 'private' | 'team';
    shareEmotionalData: boolean;
    allowCoaching: boolean;
  };
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  onboardingCompleted?: boolean;
  musicPreferences?: {
    autoplay: boolean;
    volume: number;
    preferredGenres: string[];
  };
  notifications_enabled?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at?: string;
  joined_at?: string;
  onboarded?: boolean;
  preferences: UserPreferences;
  avatar_url?: string;
  avatar?: string;
  emotional_score?: number;
  position?: string;
  department?: string;
}

export interface InvitationVerificationResult {
  isValid: boolean;
  role?: UserRole;
  email?: string;
  error?: string;
}
