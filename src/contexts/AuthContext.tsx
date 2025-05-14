import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<User>;
  register: (email: string, password: string, name: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => Promise.resolve(null),
  logout: () => Promise.resolve(),
  updateUser: () => Promise.resolve({} as User),
  register: () => Promise.resolve(),
  error: null,
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté lors du chargement initial
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.info('User found in localStorage:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const clearError = () => {
    setError(null);
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      // Simulation d'une connexion
      const user: User = {
        id: '1',
        name: 'Utilisateur Test',
        email,
        role: 'user',
        avatar_url: '',
        preferences: {
          theme: 'system',
          fontSize: 'medium',
          fontFamily: 'inter',
          language: 'fr',
          notifications: {
            enabled: false,
            emailEnabled: false,
            pushEnabled: false,
            frequency: 'daily'
          },
          privacyLevel: 'private',
          onboardingCompleted: false,
          dashboardLayout: 'standard'
        },
        onboarded: true
      };

      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      setError('Erreur de connexion. Veuillez vérifier vos identifiants.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Mock registration logic
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: 'user',
        preferences: {
          theme: 'system',
          fontSize: 'medium',
          fontFamily: 'inter',
          language: 'fr',
          notifications: {
            enabled: false,
            emailEnabled: false,
            pushEnabled: false,
            frequency: 'daily'
          },
          privacyLevel: 'private',
          onboardingCompleted: false,
          dashboardLayout: 'standard'
        },
        onboarded: false
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updatedUser: User): Promise<User> => {
    // Mettre à jour l'utilisateur dans le stockage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    register,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
