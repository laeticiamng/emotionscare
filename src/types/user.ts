
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  preferences?: UserPreferences;
  role?: UserRole;
  is_premium?: boolean;
  last_login?: string;
  streak_days?: number;
}

export type UserRole = 'user' | 'admin' | 'coach' | 'premium';

export interface UserPreferences {
  theme: ThemeName;
  fontSize: FontSize;
  fontFamily: FontFamily;
  notificationsEnabled: boolean;
  notificationFrequency: NotificationFrequency;
  notificationType: NotificationType; 
  notificationTone: NotificationTone;
  reminderTime: string;
  dynamicTheme: DynamicThemeMode;
  emotionalCamouflage?: boolean;
  channels: {
    journal: boolean;
    breathing: boolean;
    music: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface InvitationFormData {
  email: string;
  name?: string;
  role: UserRole;
  message?: string;
  expiresAt?: Date;
}
