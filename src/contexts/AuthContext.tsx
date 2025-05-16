
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string; // Added this property
  avatar_url?: string; // Added this property
  preferences?: any; // Added this property
  position?: string; // Added this property
  department?: string; // Added this property
  joined_at?: string; // Added this property
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser?: (userData: Partial<User>) => Promise<void>; // Added this method
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        name: 'Utilisateur Test',
        email,
        role: 'user',
        avatar: '/path/to/avatar.jpg',
        avatar_url: '/path/to/avatar.jpg',
        preferences: {
          theme: 'system',
          fontSize: 'medium',
          fontFamily: 'system',
          reduceMotion: false,
          colorBlindMode: false,
          autoplayMedia: true,
          soundEnabled: true,
        },
        position: 'Developer',
        department: 'Engineering',
        joined_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        name,
        email,
        role: 'user',
        avatar: '/path/to/avatar.jpg',
        avatar_url: '/path/to/avatar.jpg',
      });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
