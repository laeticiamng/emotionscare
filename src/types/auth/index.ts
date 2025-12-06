// @ts-nocheck
// Unified Auth Types - Centralized exports
export type { User, UserMode } from '../auth';
export type { UserProfile } from '../api.d';

// Auth context and state types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

// Auth form types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  acceptTerms: boolean;
}

export interface AuthFormState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

// Social auth types
export type AuthProvider = 'google' | 'github' | 'facebook' | 'apple';

export interface SocialAuthProviderProps {
  provider: AuthProvider;
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
}

// Password reset types
export interface PasswordResetFormData {
  email: string;
}

export interface NewPasswordFormData {
  password: string;
  confirmPassword: string;
}