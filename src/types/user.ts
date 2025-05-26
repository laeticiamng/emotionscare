
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: UserRole;
  department?: string;
  job_title?: string;
  emotional_score?: number;
  created_at: string;
  updated_at: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  email_notifications: boolean;
  notifications_enabled: boolean;
  sound_enabled?: boolean;
  reduce_motion?: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  social_links?: Record<string, string>;
  privacy_settings?: PrivacySettings;
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'friends';
  show_activity: boolean;
  show_location: boolean;
  allow_messages: boolean;
}

export interface UserStats {
  total_sessions: number;
  total_time: number;
  streak_days: number;
  last_active: string;
  achievements: string[];
}
