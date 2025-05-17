
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserPreferences } from '@/types/user';
import { NotificationType } from '@/types/notification';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
  clearError?: () => void;
  error?: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {
    throw new Error('AuthContext not initialized');
  },
  logout: () => {},
  register: async () => {},
  updateUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check for existing user session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // In a real app, this would check for a session token in localStorage or cookies
        // and validate it with the backend
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      // In a real app, this would make an API call to authenticate
      // Simulate different user roles based on email for testing purposes
      let role = 'b2c';
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('b2b-admin')) {
        role = 'b2b_admin';
      } else if (email.includes('b2b-user') || email.includes('collaborateur')) {
        role = 'b2b_user';
      }
      
      // Set up notification types with all required properties
      const notificationTypes: Record<NotificationType, boolean> = {
        system: true,
        emotion: true,
        coach: true,
        journal: true,
        community: true,
        achievement: true,
        badge: true,
        challenge: true,
        reminder: true,
        info: true,
        warning: true,
        error: true,
        success: true,
        streak: true,
        urgent: true
      };
      
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0],
        email,
        role: role as any,
        preferences: {
          theme: 'system',
          fontSize: 'medium',
          fontFamily: 'system',
          reduceMotion: false,
          colorBlindMode: false,
          autoplayMedia: true,
          soundEnabled: true,
          notifications: {
            enabled: true,
            emailEnabled: true,
            pushEnabled: false,
            inAppEnabled: true,
            types: notificationTypes,
            frequency: 'immediate',
          },
          privacy: {
            shareData: true,
            anonymizeReports: false,
            profileVisibility: 'public',
          },
        },
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const register = useCallback(async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Set up notification types with all required properties
      const notificationTypes: Record<NotificationType, boolean> = {
        system: true,
        emotion: true,
        coach: true,
        journal: true,
        community: true,
        achievement: true,
        badge: true,
        challenge: true,
        reminder: true,
        info: true,
        warning: true,
        error: true,
        success: true,
        streak: true,
        urgent: true
      };
      
      // In a real app, this would make an API call to register
      const mockUser: User = {
        id: '1',
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'b2c',
        preferences: {
          theme: 'system',
          fontSize: 'medium',
          fontFamily: 'system',
          reduceMotion: false,
          colorBlindMode: false,
          autoplayMedia: true,
          soundEnabled: true,
          notifications: {
            enabled: true,
            emailEnabled: true,
            pushEnabled: false,
            inAppEnabled: true,
            types: notificationTypes,
            frequency: 'immediate',
          },
          privacy: {
            shareData: true,
            anonymizeReports: false,
            profileVisibility: 'public',
          },
        },
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userData: User) => {
    setIsLoading(true);
    try {
      // In a real app, this would make an API call to update user data
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        updateUser,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
