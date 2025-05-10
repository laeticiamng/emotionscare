
// Add or update this file as needed
export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  GUEST = 'guest',
  USER = 'user',
  STAFF = 'staff',
  THERAPIST = 'therapist',
  HRMANAGER = 'hrmanager'
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
  notifications_enabled?: boolean;
  notification_frequency?: string;
  notification_type?: string;
  notification_tone?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  emotionalCamouflage?: boolean;
}
