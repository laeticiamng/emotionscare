
export interface AuthContextType {
  user: {
    id: string;
    name?: string;
    email: string;
    role?: string;
    [key: string]: any;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}
