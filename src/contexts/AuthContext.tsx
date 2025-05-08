
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase-client';
import { User, UserRole } from '@/types';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean; 
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  signOut: () => void;
  updateUser?: (userData: Partial<User>) => void;
  setUser?: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Example user data for development
const MOCK_ADMIN_USER: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: UserRole.ADMIN,
  emotional_score: 78,
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  preferences: {
    theme: 'light',
    language: 'fr',
    privacy_level: 'private',
    notifications_enabled: true,
    fontSize: '16px',
    backgroundColor: '#ffffff',
    accentColor: '#0284c7',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  }
};

const MOCK_USER: User = {
  id: '2',
  name: 'Regular User',
  email: 'user@example.com',
  role: UserRole.USER,
  emotional_score: 65,
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
  preferences: {
    theme: 'light',
    language: 'fr',
    privacy_level: 'private',
    notifications_enabled: true,
    fontSize: '16px',
    backgroundColor: '#ffffff',
    accentColor: '#0284c7',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Computed property for authentication status
  const isAuthenticated = user !== null;

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        setUser(user as unknown as User);
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      // Updated to match current Supabase API
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user as unknown as User);
      return data.user as unknown as User;
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Alias for logout to match the sign-out terminology
  const signOut = async () => {
    await logout();
  };
  
  // User update function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextProps = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    signOut,
    updateUser,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
