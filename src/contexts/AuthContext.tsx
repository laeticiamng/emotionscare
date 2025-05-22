
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import authService from '@/services/auth-service';
import { AuthErrorCode } from '@/utils/authErrors';
import { supabase } from '@/integrations/supabase/client';
import { logSessionRedirect } from '@/utils/securityLogs';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  isLoading: boolean; // Added to match usage in components
  error: string | null;
  login: (email: string, password: string, remember?: boolean) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  sendMagicLink?: (email: string) => Promise<boolean>;
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
    // Verify existing session on mount via Supabase
    const checkAuthStatus = async () => {
      try {
        const { user } = await authService.getCurrentUser();

        if (user) {
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        setUser(null);
        setIsAuthenticated(false);
        if (typeof window !== 'undefined') {
          logSessionRedirect(null, window.location.pathname, 'session_lost');
        }
      } else {
        const { user } = await authService.getCurrentUser();
        if (user) {
          setUser(user);
          setIsAuthenticated(true);
        }
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, remember = true): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      const { user, error } = await authService.signIn({ email, password });

      if (error || !user) {
        throw error || new Error('Invalid credentials');
      }

      // If the user does not want to be remembered, remove stored session after login
      if (!remember && typeof window !== 'undefined') {
        const storageKey = Object.keys(localStorage).find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
        if (storageKey) {
          const session = localStorage.getItem(storageKey);
          sessionStorage.setItem(storageKey, session || '');
          localStorage.removeItem(storageKey);
        }
      }

      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === AuthErrorCode.TOO_MANY_ATTEMPTS) {
        setError("Trop de tentatives de connexion. Veuillez patienter.");
      } else {
        setError('Identifiants invalides');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      const { user, error } = await authService.signUp({ name, email, password, role: 'b2c' });

      if (error || !user) {
        throw error || new Error('Registration failed');
      }

      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error: any) {
      console.error('Registration error:', error);
      setError('Une erreur est survenue lors de l\'inscription');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);

    try {
      const { error } = await authService.signOut();

      if (error) throw error;

      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('userMode');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Erreur lors de la déconnexion');
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
      if (!user) {
        throw new Error('No user found');
      }

      const { success, error } = await authService.updateUserProfile(user.id, userData);

      if (!success || error) throw error;

      const updatedUser = { ...user, ...userData };
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
      if (!user) {
        throw new Error('No user found');
      }

      const { success, error } = await authService.updateUserPreferences(user.id, preferences);

      if (!success || error) throw error;

      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...preferences }
      };
      setUser(updatedUser);
    } catch (error) {
      console.error('Update preferences error:', error);
      setError('Failed to update preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendMagicLink = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { success, error } = await authService.sendMagicLink(email);
      if (!success || error) throw error;
      return true;
    } catch (error) {
      console.error('Magic link error:', error);
      setError('Impossible d\'envoyer le lien de connexion');
      return false;
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
    updatePreferences,
    sendMagicLink
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
