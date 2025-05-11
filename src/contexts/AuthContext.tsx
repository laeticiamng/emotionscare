
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (user: User) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  updateUser: async () => {},
  login: async () => false,
  logout: () => {},
  signOut: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si l'utilisateur est connecté au chargement de l'application
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const updateUser = async (userData: User) => {
    try {
      // In a real application, we would send this to an API
      setUser(prevUser => ({
        ...prevUser,
        ...userData
      }));
      
      // Update local storage
      if (userData.id) {
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          const parsedUser = JSON.parse(currentUser);
          localStorage.setItem('user', JSON.stringify({
            ...parsedUser,
            ...userData
          }));
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Simuler un délai d'authentification
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simuler une connexion réussie pour la démonstration
      // (dans une implémentation réelle, nous utiliserions une API)
      const mockUser: User = {
        id: '123456',
        name: 'Utilisateur Test',
        email,
        role: email.includes('admin') ? 'admin' : 'user',
        avatar: '/images/avatar.png',
        avatar_url: '/images/avatar.png',
        onboarded: true,
        preferences: {
          theme: 'light',
          notifications: {
            email: true,
            push: true,
            sms: false
          }
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Add signOut function as an alias to logout
  const signOut = () => {
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        updateUser,
        login,
        logout,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
