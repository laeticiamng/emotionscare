
// Types liés aux utilisateurs et à l'authentification

export type UserRole = 'admin' | 'user' | 'manager' | 'coach' | 'wellbeing_manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  avatar?: string; // Pour compatibilité
  department?: string;
  position?: string;
  created_at?: string;
  joined_at?: string;
  onboarded?: boolean;
  emotional_score?: number;
  teams?: string[];
  team_id?: string;
  status?: 'active' | 'inactive' | 'pending';
  last_login?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: string;
  font?: string;
  fontSize?: string;
  language?: string;
  notifications_enabled?: boolean;
  privacy?: {
    profileVisibility?: 'public' | 'private' | 'team' | string;
  };
  profileVisibility?: 'public' | 'private' | 'team' | string;
}

export interface UserPreferencesState {
  theme: string;
  font: string;
  fontSize: string;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  resetPassword?: (email: string) => Promise<void>;
}

export interface InvitationVerificationResult {
  valid: boolean;
  email?: string;
  role?: string;
  invited_by?: string;
  message?: string;
  expires_at?: string;
  error?: string;
}

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';
