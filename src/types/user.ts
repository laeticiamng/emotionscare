
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  GUEST = 'guest',
  ANALYST = 'analyst',
  WELLBEING_MANAGER = 'wellbeing_manager'
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  avatar_url?: string;
  image?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  role?: UserRole;
  department?: string;
  emotional_score?: number;
  anonymity_code?: string;
  position?: string;
  joined_at?: string | Date;
  onboarded?: boolean;
  team_id?: string; // Add team_id property
}

export interface UserPreferences {
  theme: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms?: boolean;
  };
  language: string;
  fontSize: string;
  autoplayVideos: boolean;
  showEmotionPrompts: boolean;
  privacyLevel: string;
  dataCollection: boolean;
  font_size?: string; // For backward compatibility
  notifications_enabled?: boolean; // For backward compatibility
  reminder_time?: string; // For reminder time property
  accent_color?: string; // For accent color property
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => void;
  theme?: string;
  fontSize?: string;
  notifications?: boolean;
  notificationFrequency?: string;
  notificationType?: string;
  notificationTone?: string;
  notifications_enabled?: boolean;
  notification_frequency?: string;
  notification_type?: string;
  notification_tone?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  emotionalCamouflage?: boolean;
}
