
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, AuthContextType } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import { AuthError, AuthErrorCode } from '@/utils/authErrors';
import { recordLoginAttempt } from '@/utils/security';

// Contexte par défaut
const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => null,
  register: async () => null,
  logout: async () => {},
};

// Création du contexte
const AuthContext = createContext<AuthContextType>(defaultContext);

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Effet pour charger l'utilisateur au démarrage
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Charge l'utilisateur depuis le localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string): Promise<AuthUser | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Pour des raisons de sécurité, simuler un délai pour empêcher le timing attack
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

      // Simulation d'une API de connexion (à remplacer par une vraie API)
      if (email && password) {
        // Simulation de succès/échec
        const succeed = email.includes('@') && password.length >= 4;
        
        // Enregistre la tentative de connexion
        recordLoginAttempt(email, succeed);

        if (!succeed) {
          throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS, 'Invalid credentials');
        }

        // Utilisateur simulé
        const mockUser: AuthUser = {
          id: 'user-' + Date.now(),
          name: email.split('@')[0],
          email: email,
          role: email.includes('admin') ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
        };

        // Stocke l'utilisateur dans localStorage
        localStorage.setItem('user', JSON.stringify(mockUser));

        // Met à jour l'état
        setUser(mockUser);
        setIsAuthenticated(true);
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${mockUser.name}!`,
        });

        return mockUser;
      }

      throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS, 'Missing email or password');
    } catch (err) {
      console.error('Login error:', err);
      const authError = err instanceof AuthError ? err : new AuthError(AuthErrorCode.UNKNOWN, 'Une erreur est survenue');
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (name: string, email: string, password: string): Promise<AuthUser | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulation d'une API d'inscription (à remplacer par une vraie API)
      if (name && email && password) {
        // Simulation de délai 
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Utilisateur simulé
        const mockUser: AuthUser = {
          id: 'user-' + Date.now(),
          name: name,
          email: email,
          role: 'user',
          createdAt: new Date().toISOString(),
        };

        // Stocke l'utilisateur dans localStorage
        localStorage.setItem('user', JSON.stringify(mockUser));

        // Met à jour l'état
        setUser(mockUser);
        setIsAuthenticated(true);
        
        toast({
          title: "Compte créé avec succès",
          description: `Bienvenue, ${name}!`,
        });

        return mockUser;
      }

      throw new Error('Missing required fields');
    } catch (err) {
      console.error('Register error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Supprime l'utilisateur du localStorage
      localStorage.removeItem('user');

      // Met à jour l'état
      setUser(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour effacer les erreurs
  const clearError = () => setError(null);

  // Valeur du contexte
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
