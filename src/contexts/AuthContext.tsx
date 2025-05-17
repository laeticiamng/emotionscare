
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { normalizeUserMode } from '@/utils/userModeHelpers';
import { AuthContextType, UserPreferences } from '@/types/auth';
import { User, UserRole } from '@/types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const clearError = () => {
    setError(null);
  };

  // Add debug logging to track authentication state
  useEffect(() => {
    console.log('[AuthContext] Authentication state:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Check for existing user session in localStorage
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        // Normalize the user role to ensure consistency
        if (parsedUser.role) {
          parsedUser.role = normalizeUserMode(parsedUser.role) as UserRole;
        }
        
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('[AuthContext] Restored user session:', parsedUser);
      }
    } catch (error) {
      console.error('[AuthContext] Error restoring session:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      clearError();
      setIsLoading(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine role based on email for demo purposes
      let role: UserRole = 'b2c';
      if (email.includes('admin')) {
        role = 'b2b_admin';
      } else if (email.includes('b2b') || email.includes('collaborateur')) {
        role = 'b2b_user';
      }
      
      // Mock user data
      const userData: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role,
        created_at: new Date().toISOString(),
        preferences: {
          theme: 'system',
          language: 'fr',
          notifications_enabled: true,
          email_notifications: true,
          soundEnabled: true,
          reduceMotion: false,
          colorBlindMode: false,
          autoplayMedia: true
        }
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('user_role', role);
      localStorage.setItem('userMode', role);
      
      console.log('[AuthContext] User logged in:', userData);
      
      return userData;
    } catch (err: any) {
      const error = new Error(err.message || 'Failed to login');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      clearError();
      setIsLoading(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear stored data
      localStorage.removeItem('user');
      localStorage.removeItem('user_role');
      localStorage.removeItem('userMode');
      
      console.log('[AuthContext] User logged out');
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !"
      });
      
      navigate('/');
    } catch (err: any) {
      const error = new Error(err.message || 'Failed to logout');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<User> => {
    try {
      clearError();
      setIsLoading(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Default role for new users
      const role = 'b2c';
      
      // Create user
      const userData: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role,
        created_at: new Date().toISOString(),
        preferences: {
          theme: 'system',
          language: 'fr',
          notifications_enabled: true,
          email_notifications: true,
          soundEnabled: true,
          reduceMotion: false,
          colorBlindMode: false,
          autoplayMedia: true
        }
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('user_role', role);
      localStorage.setItem('userMode', role);
      
      console.log('[AuthContext] User registered:', userData);
      
      return userData;
    } catch (err: any) {
      const error = new Error(err.message || 'Failed to register');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (user) {
        // Update user data
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        console.log('[AuthContext] User updated:', updatedUser);
        
        toast({
          title: "Profil mis à jour",
          description: "Votre profil a été mis à jour avec succès."
        });
      }
    } catch (error: any) {
      setError(error);
      toast({
        title: "Erreur de mise à jour",
        description: "Il y a eu une erreur lors de la mise à jour de votre profil.",
        variant: "destructive"
      });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
