
export type UserRole = 'user' | 'admin' | 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  avatar_url?: string; // Alias pour compatibilité
  avatar?: string; // Alias pour compatibilité
  preferences?: UserPreferences;
  created_at?: string;
  position?: string;
  department?: string;
  joined_at?: string | Date;
  lastActive?: string | Date;
  isOnline?: boolean;
  onboarded?: boolean;
  emotional_score?: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system' | 'pastel';
  fontSize?: 'small' | 'medium' | 'large' | 'x-large';
  fontFamily?: 'system' | 'serif' | 'sans-serif' | 'monospace';
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
  soundEnabled?: boolean;
  shareData?: boolean;
  allowAnalytics?: boolean;
  showProfile?: boolean;
  shareActivity?: boolean;
  allowMessages?: boolean;
  allowNotifications?: boolean;
  anonymizeReports?: boolean;
  language?: string;
  notifications_enabled?: boolean;
  privacy?: {
    showProfile?: boolean;
    shareActivity?: boolean;
    allowMessages?: boolean;
    allowNotifications?: boolean;
  };
  sound?: {
    volume?: number;
    effects?: boolean;
    music?: boolean;
  } | boolean;
}
