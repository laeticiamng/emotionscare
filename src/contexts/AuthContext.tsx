
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/types';

export interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<User>;
}

// Create context with default values
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  updateUserProfile: async () => ({} as User),
});

// Create custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Mock authentication functions
const mockLogin = async (email: string, password: string) => {
  // This is simulating an API call that would return a user
  return new Promise<User>((resolve, reject) => {
    setTimeout(() => {
      // Simulating user lookup with hardcoded credentials
      if (email === 'user@example.com' && password === 'password') {
        resolve({
          id: 'usr_123456789',
          name: 'Test User',
          email: 'user@example.com',
          role: 'user',
          onboarded: true,
          anonymity_code: 'abc123',
          avatar: '/placeholder.svg'
        });
      } else if (email === 'admin@example.com' && password === 'password') {
        resolve({
          id: 'adm_123456789',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          onboarded: true,
          anonymity_code: 'adm123',
          avatar: '/placeholder.svg'
        });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000);
  });
};

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Mock login implementation
  const login = async (email: string, password: string) => {
    try {
      const userData = await mockLogin(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  };

  // Mock logout implementation
  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Mock registration implementation
  const register = async (email: string, password: string, name: string) => {
    // This is a mock - in production we would call an API to register the user
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const newUser = {
          id: `usr_${Math.random().toString(36).substring(2, 12)}`,
          name,
          email,
          role: 'user',
          onboarded: false,
          anonymity_code: Math.random().toString(36).substring(2, 10),
          avatar: '/placeholder.svg'
        };
        
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(newUser));
        resolve();
      }, 1000);
    });
  };

  // Mock update user profile implementation
  const updateUserProfile = async (data: Partial<User>): Promise<User> => {
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        if (!user) {
          reject(new Error('No user is authenticated'));
          return;
        }

        const updatedUser = {
          ...user,
          ...data
        };

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        resolve(updatedUser);
      }, 500);
    });
  };

  // Check for existing user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      login,
      logout,
      register,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
