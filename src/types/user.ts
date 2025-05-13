
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  language: string;
  notifications: boolean;
  soundEnabled: boolean;
  privacyLevel: 'private' | 'team' | 'public';
  onboardingCompleted: boolean;
  dashboardLayout: 'standard' | 'compact' | 'detailed';
}

export type UserRole = 'user' | 'admin' | 'b2c' | 'b2b_user' | 'b2b_admin' | 'moderator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  preferences: UserPreferences;
  onboarded: boolean;
  company_id?: string;
  department?: string;
  job_title?: string;
  created_at?: string;
  last_login?: string;
}
