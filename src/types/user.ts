
// User related types
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | string;

export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  avatar_url?: string;
  avatar?: string; // Add avatar property
  created_at?: string;
  joined_at?: string; // Add joined_at property
  department?: string; // Add department property
  position?: string; // Add position property
  onboarded?: boolean; // Add onboarded property
  preferences?: UserPreferences;
  emotional_score?: any;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system' | 'pastel';
  fontSize?: 'small' | 'medium' | 'large';
  fontFamily?: string;
  reduceMotion?: boolean;
  colorBlindMode?: boolean;
  autoplayMedia?: boolean;
  soundEnabled?: boolean;
  language?: string;
  notifications_enabled?: boolean;
  emotionalCamouflage?: boolean;
  aiSuggestions?: boolean;
  privacy?: {
    shareData?: boolean;
    allowAnalytics?: boolean;
    showProfile?: boolean; // Add showProfile property
    shareActivity?: boolean; // Add shareActivity property
    allowMessages?: boolean; // Add allowMessages property
  };
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'never';
    enabled?: boolean; // Add enabled property
    emailEnabled?: boolean; // Add emailEnabled property
    pushEnabled?: boolean; // Add pushEnabled property
    inAppEnabled?: boolean; // Add inAppEnabled property
    types?: {
      system?: boolean;
      emotion?: boolean;
      journal?: boolean;
      coach?: boolean;
      community?: boolean;
      achievement?: boolean;
    };
  };
}

export interface NotificationPreferences {
  email?: boolean;
  push?: boolean;
  sms?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'never';
  enabled?: boolean; // Add enabled property
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  types?: {
    system?: boolean;
    emotion?: boolean;
    journal?: boolean;
    coach?: boolean;
  };
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser?: (userData: Partial<User>) => Promise<void>; // Make sure updateUser is defined
}
