
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
    role?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: object) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // For now, we'll just simulate an auth check
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate login request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData = {
        id: '123456',
        email: email,
        user_metadata: {
          name: email.split('@')[0],
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        },
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error : new Error('Failed to login'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (email: string, password: string, userData: object) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate register request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const newUser = {
        id: '123456',
        email: email,
        user_metadata: {
          name: email.split('@')[0],
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          ...userData,
        },
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Register error:', error);
      setError(error instanceof Error ? error : new Error('Failed to register'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Simulate logout request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      setError(error instanceof Error ? error : new Error('Failed to logout'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
