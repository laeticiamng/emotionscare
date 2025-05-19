
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  isLoading: boolean; // Added to match usage in components
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  clearError?: () => void;
  updateUser?: (userData: Partial<User>) => Promise<User | null>; // Added to match usage in components
  updatePreferences?: (preferences: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is already logged in
    const checkAuthStatus = async () => {
      try {
        // Simulate authentication check
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate login API call
      console.log('Logging in with:', email, password);
      
      // For demo purposes, create a mock user
      const userData: User = {
        id: 'user-123',
        email: email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user',
        created_at: new Date().toISOString(),
        preferences: {
          theme: 'system',
          language: 'fr'
        }
      };
      
      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login. Please check your credentials.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate registration API call
      console.log('Registering with:', name, email, password);
      
      // For demo purposes, create a mock user
      const userData: User = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email: email,
        name: name,
        role: 'user',
        created_at: new Date().toISOString(),
        preferences: {
          theme: 'system',
          language: 'fr'
        }
      };
      
      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to register. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate logout API call
      localStorage.removeItem('user');
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Add updateUser function
  const updateUser = async (userData: Partial<User>): Promise<User | null> => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('No user found');
      }
      
      const currentUser = JSON.parse(storedUser);
      const updatedUser = { ...currentUser, ...userData };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      setError('Failed to update user. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add updatePreferences function
  const updatePreferences = async (preferences: any): Promise<void> => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('No user found');
      }
      
      const currentUser = JSON.parse(storedUser);
      const updatedUser = { 
        ...currentUser, 
        preferences: { ...currentUser.preferences, ...preferences } 
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update preferences error:', error);
      setError('Failed to update preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    isLoading: loading, // Add alias for isLoading
    error,
    login,
    register,
    logout,
    clearError,
    updateUser,
    updatePreferences
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
