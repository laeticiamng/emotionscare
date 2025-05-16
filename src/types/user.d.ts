
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'guest';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  privacyLevel: 'public' | 'friends' | 'private';
  musicVolume?: number;
  autoPlayMusic?: boolean;
  soundEffects?: boolean;
  animationLevel?: 'none' | 'minimal' | 'full';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  company?: string;
  department?: string;
  position?: string;
  preferences: UserPreferences;
  created_at: string;
  last_login?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  setUserRole: (role: UserRole) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  company?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: UserRole;
}

export interface ResetPasswordData {
  email: string;
}
