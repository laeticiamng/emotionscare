
import { ThemeName, FontSize } from './theme';
import { NotificationPreference } from './notification';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar_url?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  emailVerified?: boolean;
  isAdmin?: boolean;
  company?: string;
  position?: string;
  preferences?: UserPreferences;
  active?: boolean;
  status?: 'active' | 'inactive' | 'pending' | 'blocked';
  lastLoginDate?: string;
  totalSessions?: number;
}

export type UserRole = 'admin' | 'user' | 'coach' | 'therapist' | 'b2b' | 'b2c';

export interface UserPreferences {
  theme: ThemeName;
  fontSize?: FontSize;
  fontFamily?: string;
  useSystemTheme?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
  soundEffects?: boolean;
  language?: string;
  timeZone?: string;
  dateFormat?: string;
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  
  // Ajout des propriétés manquantes
  notifications?: NotificationPreference[];
  dashboardLayout?: Record<string, any>;
  onboardingCompleted?: boolean;
  showTips?: boolean;
}
