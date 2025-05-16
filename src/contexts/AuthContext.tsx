
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, UserPreferences } from '@/types/auth';

// Créer le contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  updatePreferences: async () => {},
  updateUser: async () => {},
  clearError: () => {}
});

// Mock user data for development
const mockUserData = {
  id: '123',
  name: 'Demo User',
  email: 'demo@emotionscare.app',
  role: 'user',
  created_at: new Date().toISOString(),
  preferences: {
    theme: 'system' as "system" | "dark" | "light" | "pastel",
    fontSize: 'medium',
    fontFamily: 'system',
    reduceMotion: false,
    colorBlindMode: false,
    autoplayMedia: true,
    soundEnabled: true,
    emotionalCamouflage: false,
    aiSuggestions: true,
    notifications: {
      enabled: true,
      emailEnabled: true,
      pushEnabled: true,
      inAppEnabled: true,
      types: {
        system: true,
        emotion: true,
        coach: true,
        journal: true,
        community: true,
        achievement: true
      },
      frequency: 'daily',
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      shareData: true,
      anonymizeReports: false,
      profileVisibility: 'public'
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<typeof mockUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const hasSession = localStorage.getItem('auth_session');
        
        if (hasSession) {
          setUser(mockUserData);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Authentication failed'));
        setUser(null);
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validation de l'email/mot de passe pour la démo
      if (password.length < 3) {
        throw new Error("Le mot de passe doit avoir au moins 3 caractères");
      }
      
      // En mode démo, accepte toutes les combinaisons avec un mot de passe valide
      const userData = {
        ...mockUserData,
        email: email,
        role: email.includes('admin') ? 'b2b_admin' : 
              email.includes('user') || email.includes('entreprise') ? 'b2b_user' : 
              'b2c'
      };
      
      setUser(userData);
      localStorage.setItem('auth_session', 'mock_token');
      return userData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('auth_session');
    setUser(null);
  };
  
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        ...mockUserData,
        id: `user-${Date.now()}`,
        name,
        email,
        created_at: new Date().toISOString(),
        role: email.includes('admin') ? 'b2b_admin' : 
              email.includes('user') || email.includes('entreprise') ? 'b2b_user' : 
              'b2c'
      };
      
      setUser(newUser);
      localStorage.setItem('auth_session', 'mock_token');
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Registration failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser({
        ...user,
        preferences: {
          ...user.preferences,
          ...preferences
        }
      });
      
      return;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update preferences'));
      throw err;
    }
  };
  
  const updateUser = async (updatedUser: any) => {
    if (!user) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser({
        ...user,
        ...updatedUser
      });
      
      return;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update user'));
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      logout,
      register,
      updatePreferences,
      updateUser,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
