
import React, { createContext, useContext, useState } from 'react';
import { User, UserPreferences } from '@/types/types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser?: (userData: User) => Promise<void>;
  updatePreferences?: (preferences: UserPreferences) => Promise<void>;
}

// Créer un utilisateur de test
const testUser: User = {
  id: 'test-user-id',
  email: 'user@example.com',
  name: 'Test User',
  firstName: 'Test',
  lastName: 'User',
  role: 'b2c',
  preferences: {
    theme: 'light',
    fontSize: 'medium',
    fontFamily: 'system',
    reduceMotion: false,
    colorBlindMode: false,
    autoplayMedia: true,
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
    soundEnabled: true,
  },
};

// Créer le contexte avec des valeurs par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(testUser); // Utilisateur connecté pour la démo

  // Simuler une connexion
  const login = async (email: string, password: string): Promise<boolean> => {
    // Pour la démo, on accepte n'importe quels identifiants
    setUser(testUser);
    return true;
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
  };

  // Mettre à jour les informations utilisateur
  const updateUser = async (userData: User) => {
    setUser(userData);
  };

  // Mettre à jour uniquement les préférences
  const updatePreferences = async (preferences: UserPreferences) => {
    if (user) {
      setUser({
        ...user,
        preferences,
      });
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    updatePreferences,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
