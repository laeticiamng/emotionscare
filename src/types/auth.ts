
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string; // Added missing property
  company?: string;
  department?: string;
  position?: string;
  createdAt?: Date | string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  register: (name: string, email: string, password: string) => Promise<AuthUser | null>;
  logout: () => Promise<void>; // Added missing property
  clearError?: () => void;
  updateUser?: (userData: Partial<AuthUser>) => Promise<void>; // Added missing property
}
