import { UserPreferences } from './preferences';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  HR = 'hr',
  MANAGER = 'manager',
  GUEST = 'guest',
  EMPLOYEE = 'employee',
  ANALYST = 'analyst',
  WELLBEING_MANAGER = 'wellbeing_manager'
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole | string;
  preferences?: UserPreferences;
  createdAt?: string;
  updatedAt?: string;
  avatar?: string;
  avatar_url?: string; // Added for compatibility
  image?: string; // Added for compatibility
  department?: string;
  position?: string;
  bio?: string;
  isActive?: boolean;
  lastLogin?: string;
  team_id?: string;
  team_role?: string;
  isAnonymous?: boolean;
  manager_id?: string;
  phone?: string;
  badges?: string[];
  level?: number;
  points?: number;
  personal_data?: {
    [key: string]: any;
  };
  // Added missing fields
  emotional_score?: number;
  anonymity_code?: string;
  created_at?: string; // Keeping both versions for compatibility
  joined_at?: string;
  onboarded?: boolean;
  emotional_profile?: { // Adding the missing property
    primary_emotion?: string;
    intensity?: number;
    analysis?: any;
  };
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  isLoading?: boolean;
  error?: string | null;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<boolean>;
  resetPreferences: () => void;
  theme?: string;
  fontSize?: string;
  notifications_enabled?: boolean;
  notification_frequency?: string;
  notification_type?: string;
  notification_tone?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  emotionalCamouflage?: boolean;
}
