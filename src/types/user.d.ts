
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin' | string;

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  avatar?: string;
  avatar_url?: string;
  avatarUrl?: string;
  created_at?: string;
  updated_at?: string;
  preferences?: UserPreferences;
  [key: string]: any;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  privacy?: {
    shareData?: boolean;
    showProfile?: boolean;
  };
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthContextType = {
  user: User | null;
  session: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, data?: any) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updateUser: (data: Partial<User>) => Promise<any>;
};
