
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const mockUser: User = {
  id: "user-001",
  email: "user@example.com",
  name: "John Doe",
  role: "user",
  createdAt: new Date().toISOString(),
  isActive: true
};

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation de chargement initial des données utilisateur
    const checkAuthStatus = async () => {
      try {
        // Dans une vraie application, vérifier le token JWT
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simule une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dans une vraie application, appeler l'API d'authentification
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    setIsLoading(true);
    try {
      // Simule une requête API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dans une vraie application, appeler l'API de déconnexion
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simule une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dans une vraie application, appeler l'API d'inscription
      const newUser = {
        ...mockUser,
        email,
        name
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default useAuth;
