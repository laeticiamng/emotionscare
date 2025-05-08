
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

// Add updateUser method to the AuthContextProps interface
export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  setUser: () => {},
  updateUser: async () => { return {} as User; }
});

export const useAuth = () => useContext(AuthContext);
