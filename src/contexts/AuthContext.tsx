
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, AuthContextType } from '@/types/user';

// Valeur par défaut du contexte
const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { throw new Error('Non implémenté') },
  register: async () => { throw new Error('Non implémenté') },
  logout: async () => { throw new Error('Non implémenté') },
  resetPassword: async () => { throw new Error('Non implémenté') },
};

// Création du contexte
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Hook pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);

// Clé pour le stockage local
const AUTH_STORAGE_KEY = 'emotions-care-auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Charger l'utilisateur depuis le stockage local au montage
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulation d'une API - à remplacer par une vraie API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérification simplifiée - à remplacer par une validation réelle
      if (!email || !password) {
        throw new Error('Email et mot de passe requis');
      }
      
      // Simulation d'authentification réussie
      const userData: User = {
        id: 'user-' + Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'b2b_admin' : 
              email.includes('b2b') ? 'b2b_user' : 'b2c',
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      
      toast.success('Connexion réussie');
      return Promise.resolve();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la connexion');
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (email: string, password: string, userData: object = {}): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulation d'une API - à remplacer par une vraie API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérification simplifiée - à remplacer par une validation réelle
      if (!email || !password) {
        throw new Error('Email et mot de passe requis');
      }
      
      // Simulation d'inscription réussie
      const newUser: User = {
        id: 'user-' + Date.now().toString(),
        email,
        name: userData && 'name' in userData ? String(userData.name) : email.split('@')[0],
        role: userData && 'role' in userData ? String(userData.role) : 'b2c',
        ...(userData as any),
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      
      toast.success('Inscription réussie');
      return Promise.resolve();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'inscription');
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async (): Promise<void> => {
    try {
      // Simulation d'une API - à remplacer par une vraie API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      
      toast.success('Déconnexion réussie');
      return Promise.resolve();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la déconnexion');
      return Promise.reject(error);
    }
  };

  // Fonction de réinitialisation de mot de passe
  const resetPassword = async (email: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulation d'une API - à remplacer par une vraie API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email) {
        throw new Error('Email requis');
      }
      
      toast.success('Si un compte existe avec cet email, un lien de réinitialisation a été envoyé');
      return Promise.resolve();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la réinitialisation du mot de passe');
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
