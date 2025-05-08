
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

// Add updateUser method to the AuthContextProps interface
export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<User>;
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => Promise<User>;
  signOut: () => Promise<void>; // Added signOut alias for logout
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { return {} as User },
  logout: async () => {},
  register: async () => { return {} as User },
  setUser: () => {},
  updateUser: async () => { return {} as User },
  signOut: async () => {} // Added signOut
});

export const useAuth = () => useContext(AuthContext);

// Implement actual AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Mock login implementation
  const login = async (email: string, password: string): Promise<User> => {
    // In a real app, you would call an API here
    const mockUser: User = {
      id: '1',
      email,
      name: 'Demo User',
      role: 'user',
      avatar_url: '/avatars/1.jpg',
      joined_at: new Date().toISOString(),
      anonymity_code: 'USER123',
      emotional_score: 75,
      onboarded: true,
      preferences: {
        theme: 'light',
        fontSize: 'medium',
        backgroundColor: '#ffffff',
        accentColor: '#7C3AED',
        notifications: {
          email: true,
          push: true,
          sms: false,
        }
      }
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    return mockUser;
  };
  
  // Mock register implementation
  const register = async (email: string, password: string, name: string): Promise<User> => {
    // In a real app, you would call an API here
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      avatar_url: '/avatars/default.jpg',
      joined_at: new Date().toISOString(),
      anonymity_code: `USER${Math.floor(Math.random() * 1000)}`,
      emotional_score: 50,
      onboarded: false,
      preferences: {
        theme: 'light',
        fontSize: 'medium',
        backgroundColor: '#ffffff',
        accentColor: '#7C3AED',
        notifications: {
          email: true,
          push: true,
          sms: false,
        }
      }
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    return mockUser;
  };
  
  // Mock logout implementation
  const logout = async (): Promise<void> => {
    // In a real app, you would call an API here
    setUser(null);
    setIsAuthenticated(false);
  };
  
  // Update user details
  const updateUser = async (userData: Partial<User>): Promise<User> => {
    if (!user) throw new Error('No user logged in');
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    return updatedUser;
  };
  
  // Add signOut as an alias for logout for API consistency
  const signOut = logout;
  
  // Check for existing user session on mount
  useEffect(() => {
    const checkSession = async () => {
      // In a real app, you would check with your auth provider here
      // For now, we'll just set loading to false
      setIsLoading(false);
    };
    
    checkSession();
  }, []);
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      register,
      setUser,
      updateUser,
      signOut // Include the signOut method
    }}>
      {children}
    </AuthContext.Provider>
  );
};
