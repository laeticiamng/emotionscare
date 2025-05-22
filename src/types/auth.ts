
/**
 * User mode determines the application context and available features
 * - b2c: Individual user experience
 * - b2b_user: Business user (employee) experience
 * - b2b_admin: Business administrator experience
 */
export type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
  company?: string;
  department?: string;
  position?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  preferences?: Record<string, any>;
  createdAt?: string | Date;
  lastLogin?: string | Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  mode?: UserMode;
  rememberMe?: boolean;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
  acceptTerms: boolean;
}
