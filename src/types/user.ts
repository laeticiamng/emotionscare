
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'b2b-user' | 'b2b-admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: UserRole;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    notifications_enabled?: boolean;
    email_notifications?: boolean;
  };
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
}
