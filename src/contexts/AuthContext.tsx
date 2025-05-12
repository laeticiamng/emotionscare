
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<User>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => Promise.resolve(null),
  logout: () => Promise.resolve(),
  updateUser: () => Promise.resolve({} as User),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          notifications: true,
          soundEnabled: true,
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
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('user');
    setUser(null);
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
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
