
import type { UserPreferences } from './preferences';

export interface AuthContextType {
  user: {
    id: string;
    name?: string;
    email: string;
    role?: string;
    /** JWT d'accès retourné par l'API */
    accessToken?: string;
    /** Jeton de rafraîchissement pour prolonger la session */
    refreshToken?: string;
    preferences?: UserPreferences;
    [key: string]: any;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<any>;
  updatePreferences?: (preferences: Partial<UserPreferences>) => Promise<void>;
  updateUser?: (user: any) => Promise<void>;
  clearError?: () => void;
}
