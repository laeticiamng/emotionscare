
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';

export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Added for ProtectedLayout
  signOut: () => Promise<void>; // Added for UserMenu
  updateUserProfile: (user: User) => Promise<User>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signOut: async () => {},
  updateUserProfile: async (user: User) => user,
  setUser: () => {},
  setIsAuthenticated: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const value = {
    user,
    isAuthenticated,
    isLoading,
    signOut,
    updateUserProfile,
    setUser,
    setIsAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
