
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPreferences, UserRole } from '@/types';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  signOut: () => void; // Alias for logout for compatibility
  updateUser: (updatedUser: User) => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => Promise.resolve({}),
  logout: () => {},
  signOut: () => {},
  updateUser: () => Promise.resolve(),
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on initial render
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    // Mock login logic
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: UserRole.ADMIN,
      department: 'Engineering',
      avatar: '/avatars/user1.png',
      position: 'Senior Developer',
      joined_at: new Date('2023-01-15').toISOString(),
      onboarded: true
    };

    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = async (updatedUser: User): Promise<void> => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login,
      logout,
      signOut: logout, // Add signOut as an alias for logout
      updateUser,
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
