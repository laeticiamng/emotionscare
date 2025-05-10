
export type UserRole = 'admin' | 'user' | 'manager' | 'employee' | 'guest';

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
  position?: string; // Add position prop
  joined_at?: string | Date; // Add joined_at
  onboarded?: boolean; // Add onboarded prop
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
  theme?: string; // Add theme
  fontSize?: string; // Add fontSize
  notifications?: boolean; // Add notifications
  notificationFrequency?: string; // Add notificationFrequency
  notificationType?: string; // Add notificationType
  notificationTone?: string; // Add notificationTone
  notifications_enabled?: boolean; // Add notifications_enabled
  notification_frequency?: string; // Add notification_frequency
  notification_type?: string; // Add notification_type
  notification_tone?: string; // Add notification_tone
  email_notifications?: boolean; // Add email_notifications
  push_notifications?: boolean; // Add push_notifications
  emotionalCamouflage?: boolean; // Add emotionalCamouflage
}

