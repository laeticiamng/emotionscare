
import { Theme, FontFamily, FontSize } from '@/contexts/ThemeContext';

export type UserRole = 
  | 'user' 
  | 'admin' 
  | 'manager' 
  | 'employee' 
  | 'wellbeing_manager' 
  | 'coach' 
  | 'analyst';

export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
  avatar_url?: string;
  avatar?: string;
  image?: string;
  preferences?: UserPreferences;
  onboarded?: boolean;
  bio?: string; // Added missing bio property
  
  // Propriétés supplémentaires utilisées dans l'application
  department?: string;
  position?: string;
  created_at?: string;
  createdAt?: string;
  joined_at?: string;
  emotional_score?: number;
  anonymity_code?: string;
  team_id?: string;
  isActive?: boolean;
}

// Export the FontFamily and FontSize types directly
export type { FontFamily, FontSize };
export type ThemeName = Theme;

// Re-exporting UserPreferences
export interface UserPreferences {
  theme: ThemeName;
  language: string;
  fontSize: FontSize;
  fontFamily: FontFamily;
  notifications: boolean;
  soundEnabled: boolean;
  privacyLevel: 'private' | 'friends' | 'public';
  onboardingCompleted: boolean;
  dashboardLayout: 'compact' | 'standard' | 'expanded';
  
  // Propriétés supplémentaires utilisées dans l'application
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  privacy?: string;
  autoplayVideos?: boolean;
  dataCollection?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
}

// Alias for UserPreferencesState
export type UserPreferencesState = UserPreferences;

// Add InvitationVerificationResult type
export interface InvitationVerificationResult {
  valid: boolean;
  expired?: boolean;
  alreadyAccepted?: boolean;
  error?: string;
  invitation?: {
    id: string;
    email: string;
    role: string;
    expiresAt: string;
  };
}
