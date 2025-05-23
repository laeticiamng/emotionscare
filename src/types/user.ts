
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatarUrl?: string;
  company?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData?: object) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
