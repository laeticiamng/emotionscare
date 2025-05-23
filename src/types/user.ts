
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  company?: string;
  team?: string;
  avatar_url?: string;
  created_at?: string;
  last_login?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: 'fr' | 'en';
    notifications?: boolean;
  };
}

export interface UserAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
}
