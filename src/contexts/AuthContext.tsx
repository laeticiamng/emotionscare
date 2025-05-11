
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  updateUser: async () => {},
  error: null,
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulation d'une vérification d'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // En production, cela interrogerait une API ou vérifierait localement
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("User found in localStorage:", parsedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          console.log("No user found in localStorage");
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    // Simulation d'une API de connexion
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Attempting login with:", { email });
      
      // Validation simple
      if (!email || !password) {
        throw new Error("L'email et le mot de passe sont requis");
      }
      
      // Simulation de délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Créer un utilisateur de demo (en production, cela viendrait de l'API)
      const mockUser: User = {
        id: '1',
        name: 'Utilisateur Test',
        email: email,
        role: email.includes('admin') ? 'admin' : 'user',
        avatar_url: '',
        preferences: {
          theme: 'system',
          fontSize: 'medium',
          fontFamily: 'inter',
          language: 'fr',
          notifications: true,
          soundEnabled: true
        },
        onboarded: true
      };
      
      // Stocker l'utilisateur
      localStorage.setItem('user', JSON.stringify(mockUser));
      console.log("User stored in localStorage:", mockUser);
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return mockUser;
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || "Erreur de connexion");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // En production, cela enverrait une requête à l'API
      localStorage.removeItem('user');
      console.log("User removed from localStorage");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Attempting registration with:", { email, name });
      
      // Validation simple
      if (!email || !password || !name) {
        throw new Error("Tous les champs sont requis");
      }
      
      // Simulation d'enregistrement
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user',
        onboarded: false
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log("New user stored in localStorage:", newUser);
      
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (error: any) {
      console.error('Register error:', error);
      setError(error.message || "Erreur d'enregistrement");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    setIsLoading(true);
    
    try {
      // En production, cela enverrait une mise à jour à l'API
      if (user) {
        const updatedUser = {
          ...user,
          ...userData,
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log("User updated in localStorage:", updatedUser);
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        register,
        updateUser,
        error,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
