
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  user_metadata?: any;
  firstName?: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Vérifier l'état d'authentification au démarrage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      // Simulation d'une API d'authentification
      const response = await new Promise<{ user: User }>((resolve) => {
        setTimeout(() => {
          resolve({
            user: {
              id: 'user-123',
              email: credentials.email,
              name: 'Demo User',
              role: credentials.email.includes('admin') ? 'b2b_admin' : credentials.email.includes('b2b') ? 'b2b_user' : 'b2c',
              created_at: new Date().toISOString(),
              firstName: 'Demo',
            },
          });
        }, 1000);
      });

      const { user } = response;
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${user.name}!`,
      });
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants invalides",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  const logout = () => {
    signOut();
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    signOut,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
