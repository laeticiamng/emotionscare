
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/user';

const initialState: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => null,
  logout: async () => {},
  clearError: () => {},
  updateUser: async () => {}  // Add updateUser implementation
};

export const AuthContext = createContext<AuthContextType>(initialState);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock login function for demonstration
  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: '1',
        name: 'Test User',
        email: email,
        role: 'b2c',
        avatar_url: '/avatars/default.png',
        avatar: '/avatars/default.png', // Add avatar property
        created_at: new Date().toISOString(),
        joined_at: new Date().toISOString(), // Add joined_at
        department: 'Marketing', // Add department
        position: 'Manager', // Add position
        onboarded: true // Add onboarded
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mock logout function
  const logout = async (): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };
  
  // Clear error state
  const clearError = (): void => {
    setError(null);
  };
  
  // Add updateUser function
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError('Failed to update user data.');
    }
  };
  
  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Authentication check failed', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    updateUser
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
