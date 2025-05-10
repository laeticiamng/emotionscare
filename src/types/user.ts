
// Add or update this file as needed
export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  GUEST = 'guest',
  USER = 'user',
  STAFF = 'staff',
  THERAPIST = 'therapist',
  HRMANAGER = 'hrmanager',
  ANALYST = 'analyst',
  WELLBEING_MANAGER = 'wellbeing_manager'
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  avatar?: string;
  avatar_url?: string;
  department?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  emotional_score?: number;
  anonymity_code?: string;
  team_id?: string;
  position?: string;
  joined_at?: string;
  onboarded?: boolean;
  preferences?: UserPreferences; // Add this property to fix User type errors
}

export interface UserPreferences {
  theme: string;
  fontSize: string;
  language: string;
  notifications: boolean;
  autoplayVideos: boolean;
  showEmotionPrompts: boolean;
  privacyLevel: string;
  dataCollection: boolean;
  
  // Additional properties needed
  font_size?: string;
  reminder_time?: string;
  marketing_emails?: boolean;
  feature_announcements?: boolean;
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  accent_color?: string;
  
  // Premium features
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
  notificationType?: string;
  notificationFrequency?: string;
  notificationTone?: string;
  reminderTime?: string;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  isLoading: boolean;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  theme: string;
  fontSize: string;
  language: string;
  notifications: boolean;
  autoplayVideos: boolean;
  showEmotionPrompts: boolean;
  privacyLevel: string;
  dataCollection: boolean;
  
  // Additional properties needed
  notificationsEnabled?: boolean;
  notificationFrequency?: string;
  notificationType?: string;
  notificationTone?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  fullAnonymity?: boolean;
}
