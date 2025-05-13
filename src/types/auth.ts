
export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar_url?: string;
  onboarded?: boolean;
  job_title?: string;
  department?: string;
}

export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}
