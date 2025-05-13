
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
  
  // Add missing properties referenced in components
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  privacy?: string;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
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
  
  // Add missing properties referenced in components
  avatar?: string;
  image?: string;
  position?: string;
  joined_at?: string;
  createdAt?: string;
  emotional_score?: number;
}
