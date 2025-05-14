
export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'roboto' | 'lato' | 'poppins' | 'montserrat';
export type UserRole = 'admin' | 'user' | 'manager' | 'guest' | 'b2b_admin' | 'b2b_user' | 'b2c';

export interface User {
  id: string;
  email: string;
  role?: UserRole;
  name?: string;
  created_at?: string;
  avatar_url?: string;
  preferences?: UserPreferences;
  onboarded?: boolean;
  department?: string;
  position?: string;
  joined_at?: string;
  emotional_score?: number;
  bio?: string;
  anonymity_code?: string;
  avatar?: string;
  team_id?: string;
  job_title?: string;
  image?: string;
}

export interface UserPreferences {
  theme: Theme;
  fontSize: FontSize;
  fontFamily?: FontFamily;
  notifications: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: string;
  };
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
  language?: string;
  privacy?: string;
  notifications_enabled?: boolean;
  privacyLevel?: string;
}

export interface UserPreferencesState {
  isLoading: boolean;
  error: string | null;
  preferences: UserPreferences;
}

export interface InvitationVerificationResult {
  isValid: boolean;
  data?: {
    email: string;
    role: string;
    expires_at: string;
  };
  error?: string;
}
