
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '@/types/user';

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({}),
  register: async () => ({}),
  logout: async () => {},
  resetPassword: async () => ({}),
  updateUser: async () => ({})
});

export const useAuth = () => useContext(AuthContext);

// Mock user data for testing
const MOCK_USER: User = {
  id: 'user-123',
  email: 'user@example.com',
  name: 'Test User',
  role: 'b2c',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a stored user session
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedSession = localStorage.getItem('session');
        
        if (storedUser && storedSession) {
          setUser(JSON.parse(storedUser));
          setSession(JSON.parse(storedSession));
        } else {
          // For demo purposes, auto-login with mock user
          // In a real app, you would check with Supabase or other auth provider
          // setUser(MOCK_USER);  // Uncomment for automatic login
          // setSession({ token: 'mock-session-token' });  // Uncomment for automatic login
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock login - replace with real auth in production
      const mockUser = { ...MOCK_USER, email };
      const mockSession = { token: 'mock-session-token', expiresAt: Date.now() + 3600000 };
      
      setUser(mockUser);
      setSession(mockSession);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('session', JSON.stringify(mockSession));
      
      return { user: mockUser, session: mockSession };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, data: any = {}) => {
    try {
      setIsLoading(true);
      
      // Mock registration - replace with real auth in production
      const mockUser = { 
        ...MOCK_USER, 
        email,
        name: data.name || 'New User',
        role: data.role || 'b2c'
      };
      const mockSession = { token: 'mock-session-token', expiresAt: Date.now() + 3600000 };
      
      setUser(mockUser);
      setSession(mockSession);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('session', JSON.stringify(mockSession));
      
      return { user: mockUser, session: mockSession };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Clear user data
      setUser(null);
      setSession(null);
      
      // Remove from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('session');
      localStorage.removeItem('user-mode'); // Also clear user mode
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      // Mock password reset - replace with real implementation
      console.log('Password reset requested for:', email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Update user function
  const updateUser = async (data: Partial<User>) => {
    try {
      if (!user) throw new Error('No user to update');
      
      // Update user
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { user: updatedUser };
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  // Compute isAuthenticated based on user and session
  const isAuthenticated = !!user && !!session;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
