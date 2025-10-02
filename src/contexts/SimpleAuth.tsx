import React, { createContext, useContext, useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  [key: string]: unknown;
}

interface SimpleAuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<void>;
  signOut: () => void;
}

const SimpleAuthContext = createContext<SimpleAuthContextType>({
  isAuthenticated: false,
  user: null,
  role: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
});

export const useSimpleAuth = () => useContext(SimpleAuthContext);

export const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Commencer avec false pour éviter de bloquer les champs

  useEffect(() => {
    setLoading(true); // Activer le loading pendant la vérification
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('simple_auth_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setRole(userData.role || 'consumer');
      } catch (error) {
        logger.error('Error parsing stored user data', error as Error, 'AUTH');
        localStorage.removeItem('simple_auth_user');
      }
    }
    setLoading(false); // Désactiver le loading à la fin
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simple mock authentication
      const mockUser = {
        id: 'user-123',
        email,
        role: email.includes('manager') ? 'manager' : 
              email.includes('employee') ? 'employee' : 'consumer',
        name: 'Demo User'
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      setRole(mockUser.role);
      localStorage.setItem('simple_auth_user', JSON.stringify(mockUser));

      logger.info('Connexion réussie, redirection', { role: mockUser.role }, 'AUTH');
      
      window.location.href = '/app/home';
      
    } catch (error) {
      logger.error('SignIn error', error as Error, 'AUTH');
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    setLoading(true);
    try {
      // Simple mock registration - in real app, this would call your API
      const mockUser: User = {
        id: 'user-' + Date.now(),
        email,
        role: metadata?.segment === 'b2b' ? 'employee' : 'consumer',
        name: (metadata?.full_name as string) || 'Nouvel utilisateur',
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      setRole(mockUser.role);
      localStorage.setItem('simple_auth_user', JSON.stringify(mockUser));

      logger.info('Inscription réussie, redirection', { role: mockUser.role }, 'AUTH');

      setTimeout(() => {
        window.location.replace('/app/home');
      }, 500);
    } catch (error) {
      logger.error('SignUp error', error as Error, 'AUTH');
      setLoading(false);
      throw error;
    }
  };

  const signOut = () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      setRole(null);
      localStorage.removeItem('simple_auth_user');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      logger.error('SignOut error', error as Error, 'AUTH');
    }
  };

  const value = {
    isAuthenticated,
    user,
    role,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};