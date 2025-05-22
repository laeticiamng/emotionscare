
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const defaultState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextProps>({
  ...defaultState,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultState);

  useEffect(() => {
    // Check if user is already logged in (in local storage)
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error as Error,
        });
      }
    };

    checkAuth();
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      // Simulating API call
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Mock successful login after delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create mock user data
      const user: User = {
        id: '123',
        email,
        name: email.split('@')[0], // Use part of email as name
        role: email.includes('admin') ? 'b2b_admin' : 
              email.includes('b2b') ? 'b2b_user' : 'b2c',
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error as Error,
      });
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    
    // Reset auth state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const register = async (userData: any) => {
    try {
      // Simulating API call
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Mock successful registration after delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user
      const user: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        role: userData.role || 'b2c',
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
