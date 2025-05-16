
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  updateUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would make an API call to authenticate
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
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
            types: {
              system: true,
              emotion: true,
              coach: true,
              journal: true,
              community: true,
              achievement: true,
            },
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
      // In a real app, this would make an API call to register
      const mockUser: User = {
        id: '1',
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role: 'user',
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
            types: {
              system: true,
              emotion: true,
              coach: true,
              journal: true,
              community: true,
              achievement: true,
            },
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
