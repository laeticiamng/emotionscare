
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>; // Ajout de la fonction signOut
  updateUser?: (user: User) => Promise<void>; // Ajout de updateUser
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  signOut: async () => {},
  updateUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if user is already logged in (e.g. from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo purposes, simulate successful login with mock data
      // In a real app, this would verify credentials with a backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'user-1',
        name: 'Demo User',
        email: email,
        role: UserRole.EMPLOYEE,  // Utilisation de l'enum
        team_id: 'team-1',
        department: 'Product',
        joined_at: new Date().toISOString(),
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo purposes, simulate successful registration
      // In a real app, this would create a new user via API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: name,
        email: email,
        role: UserRole.USER,  // Utilisation de l'enum
        joined_at: new Date().toISOString(),
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Clear user data and local storage
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Ajout de la fonction signOut comme alias de logout
  const signOut = async () => {
    await logout();
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate password reset email
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would trigger a password reset email
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Ajout de la fonction updateUser
  const updateUser = async (updatedUser: User) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call to update user
      await new Promise(resolve => setTimeout(resolve, 800));
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        resetPassword,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
