
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
  emotional_score?: number | {
    joy: number;
    calm: number;
    focus: number;
    anxiety: number;
  };
  notes?: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system" | "pastel";
  fontSize?: string;
  fontFamily?: string;
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
  notifications?: {
    enabled?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    inAppEnabled?: boolean;
    types?: {
      system?: boolean;
      emotion?: boolean;
      coach?: boolean;
      journal?: boolean;
      community?: boolean;
      achievement?: boolean;
    };
    frequency?: string;
  };
  privacy?: {
    showProfile?: boolean;
    shareActivity?: boolean;
    allowMessages?: boolean;
    allowNotifications?: boolean;
    shareData?: boolean;
    allowAnalytics?: boolean;
  };
  sound?: {
    volume?: number;
    effects?: boolean;
    music?: boolean;
  } | boolean;
}

export interface NotificationPreferences {
  enabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  types?: {
    system?: boolean;
    emotion?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
    achievement?: boolean;
  };
  frequency?: string;
}
