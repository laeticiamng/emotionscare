
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';

export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>; // Added for compatibility with MobileNavigation
  updateUserProfile: (user: User) => Promise<User>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>; // Optional for compatibility
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signOut: async () => {},
  login: async () => ({ id: '', name: '', email: '', role: '', anonymity_code: '', onboarded: false }),
  logout: async () => {},
  updateUserProfile: async (user: User) => user,
  setUser: () => {},
  setIsAuthenticated: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Mock login function
  const login = async (email: string, password: string): Promise<User> => {
    // Simulate API call
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: email,
      role: 'user',
      onboarded: true,
      anonymity_code: 'ABC123',
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    return mockUser;
  };

  // Mock function to update user profile
  const updateUserProfile = async (updatedUser: User): Promise<User> => {
    setUser(updatedUser);
    return updatedUser;
  };

  // Mock sign out function
  const signOut = async (): Promise<void> => {
    setUser(null);
    setIsAuthenticated(false);
  };
  
  // Alias for signOut for compatibility
  const logout = signOut;

  const value = {
    user,
    isAuthenticated,
    isLoading,
    signOut,
    login,
    logout,
    updateUserProfile,
    setUser,
    setIsAuthenticated,
    setIsLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
