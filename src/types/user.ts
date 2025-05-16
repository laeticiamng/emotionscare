
export interface User {
  id: string;
  name?: string;
  email: string;
  role: 'user' | 'admin' | 'b2c' | 'b2b_user' | 'b2b_admin';
  avatarUrl?: string;
  preferences?: UserPreferences;
  created_at?: string;
  position?: string; // Added
  department?: string; // Added
  joined_at?: string | Date; // Added
  lastActive?: string | Date;
  isOnline?: boolean;
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
  anonymizeReports?: boolean; // Added
  sound?: {
    volume?: number;
    effects?: boolean;
    music?: boolean;
  } | boolean;
}
