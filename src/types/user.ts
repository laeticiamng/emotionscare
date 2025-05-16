
// User related types
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | string;

export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  avatar_url?: string;
  created_at?: string;
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
  };
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'never';
  };
}

export interface NotificationPreferences {
  email?: boolean;
  push?: boolean;
  sms?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'never';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser?: (userData: Partial<User>) => Promise<void>;
}
