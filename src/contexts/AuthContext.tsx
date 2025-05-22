
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '@/types/user';

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  updateUser: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // For development purposes, check if we have a user in localStorage
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For development purposes, simulate authentication
      const mockUser: User = {
        id: 'user-123',
        email,
        name: 'Demo User',
        role: 'b2c',
        preferences: {
          theme: 'system',
          language: 'fr',
          notifications_enabled: true,
          email_notifications: true,
        }
      };
      
      // Store in localStorage for now (will be replaced with Supabase auth)
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_token', 'mock-token-12345');
      
      // Mark that we just logged in for transition effects
      sessionStorage.setItem('just_logged_in', 'true');
      
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Remove stored auth data
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name?: string) => {
    try {
      setIsLoading(true);
      
      // For development purposes, simulate registration
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email,
        name: name || email.split('@')[0],
        role: 'b2c',
        preferences: {
          theme: 'system',
          language: 'fr',
          notifications_enabled: true,
          email_notifications: true,
        }
      };
      
      // Store in localStorage for now (will be replaced with Supabase auth)
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_token', 'mock-token-' + Math.random().toString(36).substr(2, 9));
      
      // Mark that we just registered/logged in for transition effects
      sessionStorage.setItem('just_logged_in', 'true');
      
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user function
  const updateUser = async (updates: Partial<User>) => {
    try {
      setIsLoading(true);
      
      if (!user) throw new Error('No user logged in');
      
      // Update user with new data
      const updatedUser = { ...user, ...updates };
      
      // Update localStorage
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        login,
        logout,
        register,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
