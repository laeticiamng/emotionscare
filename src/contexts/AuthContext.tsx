
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<boolean>;
  logout: () => void;
  signOut: () => void; // Added for compatibility
  updateUser: (user: User) => Promise<boolean>;
}

const defaultUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user',
  preferences: {
    theme: 'light',
    fontSize: 'medium',
    font: 'inter',
  }
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  signOut: () => {}, // Added for compatibility
  updateUser: async () => false
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultUser); // Pour la démo, on utilise defaultUser
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulation d'authentification
      setUser(defaultUser);
      return true;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
  };

  // Adding signOut as an alias for logout for compatibility
  const signOut = (): void => {
    logout();
  };

  const updateUser = async (updatedUser: User): Promise<boolean> => {
    try {
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signOut, // Added for compatibility
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
