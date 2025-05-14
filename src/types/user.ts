
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  preferences: UserPreferences;
  avatar_url?: string;
  onboarded?: boolean;
  department?: string;
  position?: string;
  anonymity_code?: string;
  emotional_score?: number;
}

export interface UserPreferences {
  privacy?: 'public' | 'private' | 'team';
  notifications_enabled?: boolean;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  aiSuggestions?: boolean;
  emotionalCamouflage?: boolean;
  theme?: 'light' | 'dark' | 'system' | 'pastel';
  fontSize?: 'small' | 'medium' | 'large';
  fontFamily?: 'system' | 'serif' | 'sans-serif' | 'mono';
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
}

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
export type FontFamily = 'system' | 'serif' | 'sans-serif' | 'mono' | 'rounded';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface InvitationVerificationResult {
  valid: boolean;
  message: string;
  invitationDetails?: {
    id: string;
    email: string;
    role: string;
    expires_at: string;
    team_id?: string;
  };
}
