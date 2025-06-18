
export type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  role?: UserMode;
  department?: string;
  job_title?: string;
  emotional_score?: number;
  preferences?: UserPreferences;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: 'fr' | 'en';
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  privacy_settings?: PrivacySettings;
}

export interface PrivacySettings {
  camera_enabled?: boolean;
  microphone_enabled?: boolean;
  heart_rate_enabled?: boolean;
  gps_enabled?: boolean;
  social_sharing_enabled?: boolean;
  nft_enabled?: boolean;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  role?: UserMode;
}
