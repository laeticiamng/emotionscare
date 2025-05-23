
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'b2c' | 'b2b_user' | 'b2b_admin';
  preferences?: Record<string, any>;
  metadata?: Record<string, any>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: string, metadata?: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erreur de vérification d\'authentification:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Simuler une connexion utilisateur
  const login = async (email: string, password: string) => {
    // Dans une application réelle, vous appelleriez votre API d'authentification ici
    try {
      // Exemple de données utilisateur simulées
      let mockUser: User;
      
      if (email.includes('admin')) {
        mockUser = {
          id: 'admin-123',
          name: 'Admin User',
          email,
          role: 'b2b_admin',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        };
      } else if (email.includes('b2b') || email.includes('collaborateur') || email.includes('entreprise')) {
        mockUser = {
          id: 'b2b-user-456',
          name: 'B2B User',
          email,
          role: 'b2b_user',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=b2b',
        };
      } else {
        mockUser = {
          id: 'b2c-789',
          name: 'B2C User',
          email,
          role: 'b2c',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=b2c',
        };
      }
      
      // Stocker l'utilisateur dans localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return mockUser;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw new Error('Email ou mot de passe incorrect');
    }
  };
  
  // Simuler l'inscription d'un utilisateur
  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: string = 'b2c',
    metadata?: Record<string, any>
  ) => {
    try {
      // Dans une application réelle, vous appelleriez votre API d'inscription ici
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: (role as 'b2c' | 'b2b_user' | 'b2b_admin'),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        metadata
      };
      
      // Stocker l'utilisateur dans localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw new Error('Échec de l\'inscription. Veuillez réessayer.');
    }
  };
  
  // Simuler la déconnexion
  const logout = async () => {
    try {
      // Dans une application réelle, vous appelleriez votre API de déconnexion ici
      localStorage.removeItem('user');
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  };
  
  // Simuler une réinitialisation de mot de passe
  const resetPassword = async (email: string) => {
    try {
      // Dans une application réelle, vous appelleriez votre API de réinitialisation de mot de passe ici
      // Pour l'instant, simulons simplement un délai pour montrer que la demande est traitée
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aucune action réelle n'est prise ici dans notre simulation
      return;
    } catch (error) {
      console.error('Erreur de réinitialisation de mot de passe:', error);
      throw new Error('Échec de l\'envoi des instructions de réinitialisation.');
    }
  };
  
  // Mettre à jour le profil utilisateur
  const updateUserProfile = async (data: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }
      
      // Dans une application réelle, vous appelleriez votre API de mise à jour de profil ici
      const updatedUser = {
        ...user,
        ...data
      };
      
      // Mettre à jour l'utilisateur dans localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      throw new Error('Échec de la mise à jour du profil.');
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
    updateUserProfile,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
