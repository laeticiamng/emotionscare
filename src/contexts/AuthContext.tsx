
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
  updateUser: async () => {}
});

// Mock user data for development
const mockUserData = {
  id: '123',
  name: 'Demo User',
  email: 'demo@emotionscare.app',
  role: 'user',
  created_at: new Date().toISOString(),
  preferences: {
    theme: 'system',
    fontSize: 'medium',
    fontFamily: 'system',
    reduceMotion: false,
    colorBlindMode: false,
    autoplayMedia: true,
    soundEnabled: true,
    notifications: {
      email: true,
      push: true,
      sms: false,
      frequency: 'daily'
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
      setUser(mockUserData);
      localStorage.setItem('auth_session', 'mock_token');
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
        created_at: new Date().toISOString()
      };
      
      setUser(newUser);
      localStorage.setItem('auth_session', 'mock_token');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Registration failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updatePreferences = async (preferences: UserPreferences) => {
    if (!user) return;
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mettre à jour l'utilisateur avec les nouvelles préférences
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
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mettre à jour l'utilisateur
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
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
