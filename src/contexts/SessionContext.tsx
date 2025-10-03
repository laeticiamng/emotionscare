// @ts-nocheck

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface SessionContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  role: string | null;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
  role: null,
  loading: true,
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Vérifier l'état d'authentification au démarrage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simuler une vérification d'authentification
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setRole(parsedUser.role || 'user');
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Auth check error - silent
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      // Simulation d'une API d'authentification
      const response = await new Promise<{ user: any }>((resolve) => {
        setTimeout(() => {
          resolve({
            user: {
              id: 'user-123',
              email: credentials.email,
              name: 'Demo User',
              role: credentials.email.includes('admin') ? 'admin' : 'user',
            },
          });
        }, 1000);
      });

      const { user } = response;
      setUser(user);
      setRole(user.role);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${user.name}!`,
        variant: "success",
      });
      
      navigate('/');
    } catch (error: any) {
      // Login error
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants invalides",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/');
    
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    role,
    loading,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
