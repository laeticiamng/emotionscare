
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  avatar_url?: string; // For backward compatibility
  avatarUrl?: string; // For backward compatibility
  displayName?: string; // For backward compatibility
  company?: string;
  department?: string;
  position?: string;
  createdAt?: Date | string;
  created_at?: Date | string; // For backward compatibility
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  register: (name: string, email: string, password: string) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  clearError?: () => void;
  updateUser?: (userData: Partial<AuthUser>) => Promise<void>;
}
