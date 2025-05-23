
/**
 * Types pour les utilisateurs
 */

export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  avatar?: string;
  avatarUrl?: string;
  avatar_url?: string;
  created_at?: string;
  preferences?: {
    theme?: string;
    language?: string;
    notifications_enabled?: boolean;
    email_notifications?: boolean;
    [key: string]: any;
  };
  company?: {
    id?: string;
    name?: string;
    role?: string;
    department?: string;
    [key: string]: any;
  };
  metadata?: {
    [key: string]: any;
  };
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData?: object) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile?: (data: object) => Promise<void>;
}
