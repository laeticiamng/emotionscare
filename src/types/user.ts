
import { Theme, FontSize, FontFamily } from '@/contexts/ThemeContext';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user' | 'coach' | 'therapist' | 'employee' | 'manager' | 'wellbeing_manager' | 'analyst';
  avatar_url?: string;
  avatar?: string;  // Added for compatibility
  image?: string;   // Added for compatibility
  position?: string;
  department?: string;
  joined_at?: string;
  created_at?: string;
  createdAt?: string;
  bio?: string;
  onboarded?: boolean;
  emotional_score?: number;
  anonymity_code?: string;
  team_id?: string;
  status?: 'active' | 'inactive' | 'pending' | 'blocked';
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language: string;
  notifications: boolean;
  soundEnabled?: boolean;
  privacyLevel?: 'private' | 'friends' | 'public';
  privacy?: 'public' | 'private' | 'friends';
  dashboardLayout?: 'compact' | 'standard' | 'expanded';
  onboardingCompleted?: boolean;
  
  // Additional preference fields used in components
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
}

export interface UserPreferencesState extends UserPreferences {
  isLoading: boolean;
  isEditing: boolean;
  hasChanges: boolean;
  originalValues: UserPreferences;
}

export interface ThemeSettings {
  name: ThemeName;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: FontFamily;
  fontSize?: FontSize;
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  animations?: boolean;
}

export type ThemeName = Theme;
export type { FontSize, FontFamily };

// Add UserRole enum
export enum UserRole {
  USER = 'user',
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  ADMIN = 'admin',
  WELLBEING_MANAGER = 'wellbeing_manager',
  COACH = 'coach',
  ANALYST = 'analyst'
}

// Add InvitationVerificationResult
export interface InvitationVerificationResult {
  isValid: boolean;
  email?: string;
  role?: string;
  error?: string;
  message?: string; // Add message property
  invitationId?: string;
  expiresAt?: string;
  data?: { // Add data property to maintain compatibility with existing code
    email?: string;
    role?: string;
  };
}
