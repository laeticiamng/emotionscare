
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
  channels: {
    journal: boolean;
    breathing: boolean;
    music: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  emotionalCamouflage?: boolean;
}

export interface UserPreferencesState extends UserPreferences {
  loading: boolean;
  error: string | null;
}

export interface InvitationFormData {
  email: string;
  name?: string;
  role: UserRole;
  message?: string;
  expiresAt?: Date;
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  conversion_rate: number;
  last_week: {
    sent: number;
    accepted: number;
  }
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date_unlocked?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}
