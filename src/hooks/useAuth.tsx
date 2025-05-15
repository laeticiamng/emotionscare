
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { User, UserRole } from '@/types';

// Create a context for authentication
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: User) => Promise<User>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
  updateUser: async (user) => user,
});

// Mock user for development
const mockUser: User = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  created_at: new Date().toISOString(),
  avatar_url: '/images/avatars/avatar1.png',
  preferences: {
    theme: 'system',
    fontSize: 'medium',
    fontFamily: 'system',
    reduceMotion: false,
    colorBlindMode: false,
    autoplayMedia: true,
    soundEnabled: true,
  },
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock login function
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockUserResponse: User = {
        id: '123',
        name: 'John Doe',
        email: email,
        role: 'user',
        created_at: new Date().toISOString(),
        avatar_url: '/images/avatars/avatar1.png',
        preferences: {
          theme: 'system',
          fontSize: 'medium',
          fontFamily: 'system',
          reduceMotion: false,
          colorBlindMode: false,
          autoplayMedia: true,
          soundEnabled: true,
        },
      };
      
      setUser(mockUserResponse);
      localStorage.setItem('user', JSON.stringify(mockUserResponse));
    } catch (err) {
      setError('Failed to login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mock register function
  const register = useCallback(async (email: string, password: string, name: string, role: UserRole = 'user') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockUserResponse: User = {
        id: '456',
        name: name,
        email: email,
        role: role,
        created_at: new Date().toISOString(),
        preferences: {
          theme: 'system',
          fontSize: 'medium',
          fontFamily: 'system',
          reduceMotion: false,
          colorBlindMode: false,
          autoplayMedia: true,
          soundEnabled: false,
        },
      };
      
      setUser(mockUserResponse);
      localStorage.setItem('user', JSON.stringify(mockUserResponse));
    } catch (err) {
      setError('Failed to register');
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mock logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // Update user
  const updateUser = useCallback(async (updatedUser: User): Promise<User> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.error('Update user error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check for user in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }
    
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default useAuth;
