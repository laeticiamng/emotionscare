
// Export all type definitions for application-wide use

// Core types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  team_id?: string;
  is_active?: boolean;
  last_login?: string;
  preferences?: UserPreferences;
  metadata?: Record<string, any>;
  department?: string;
  position?: string;
}

export interface UserPreferences {
  theme?: string;
  notifications_enabled?: boolean;
  font_size?: string;
  language?: string;
  [key: string]: any;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager', 
  USER = 'user',
  GUEST = 'guest',
  EMPLOYEE = 'employee',
  ANALYST = 'analyst',
  WELLBEING_MANAGER = 'wellbeing_manager'
}

export interface MoodData {
  date: string;
  score: number;
  emotion?: string;
  notes?: string;
  activities?: string[];
  user_id: string;
}

// Re-export all types from individual files
export * from './audio-player';
export * from './chat';
export * from './community';
export * from './emotion';
export * from './gamification';
export * from './invitation';
export * from './journal';
export * from './music';
export * from './navigation';
export * from './scan';
export * from './vr';
