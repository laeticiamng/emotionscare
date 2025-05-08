import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';
import { loginUser, logoutUser, getCurrentUser } from '@/data/mockUsers';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Update the mock user objects to include created_at
const mockAdminUser: User = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
  avatar_url: 'https://i.pravatar.cc/150?img=1',
  joined_at: new Date().toISOString(),
  anonymity_code: 'ADMIN123',
  emotional_score: 85,
  onboarded: true,
  created_at: new Date().toISOString(), // Added required property
  preferences: {
    theme: 'light',
    fontSize: 'medium',
    backgroundColor: '#ffffff',
    accentColor: '#007bff',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  }
};

const mockNewUser: User = {
  id: '2',
  email: 'new@example.com',
  name: 'New User',
  role: 'user',
  avatar_url: 'https://i.pravatar.cc/150?img=2',
  joined_at: new Date().toISOString(),
  anonymity_code: 'NEW456',
  emotional_score: 70,
  onboarded: false,
  created_at: new Date().toISOString(), // Added required property
  preferences: {
    theme: 'light',
    fontSize: 'medium',
    backgroundColor: '#ffffff',
    accentColor: '#007bff',
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
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await loginUser(email, password);
      setUser(user);
      navigate('/dashboard');
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
      await logoutUser();
      setUser(null);
      navigate('/login');
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

  const value: AuthContextProps = {
    user,
    isLoading,
    login,
    logout,
    signOut,
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
