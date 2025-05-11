
import { User } from './user';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  
  // Add missing properties
  isAuthenticated: boolean;
  updateUser: (user: User) => Promise<void>;
}
