
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
  
  // Add premium features properties
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
}

export type UserRole = 'user' | 'admin' | 'b2c' | 'b2b_user' | 'b2b_admin' | 'moderator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  preferences?: UserPreferences;
  onboarded?: boolean;
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
  team_id?: string;
  anonymity_code?: string;
}

export interface UserPreferencesState {
  theme: 'light' | 'dark' | 'system' | 'pastel';
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'inter' | 'roboto' | 'poppins' | 'montserrat' | 'raleway';
  notifications: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
  // Add other fields as needed
}

export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'montserrat' | 'raleway';
export type FontSize = 'small' | 'medium' | 'large';
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export interface InvitationVerificationResult {
  isValid: boolean;
  message: string;
  role?: UserRole;
  email?: string;
}
