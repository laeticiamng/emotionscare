
import { useState, useEffect, createContext, useContext } from 'react';

// Mock user data for development
const mockUserData = {
  id: '123',
  name: 'Demo User',
  email: 'demo@emotionscare.app',
  role: 'user' as const,
  created_at: new Date().toISOString(),
  preferences: {
    theme: 'system',
    fontSize: 'medium',
    fontFamily: 'system',
    reduceMotion: false,
    colorBlindMode: false,
    autoplayMedia: true,
    soundEnabled: true,
    notifications: {
      email: true,
      push: true,
      sms: false,
      frequency: 'daily'
    }
  }
};

// Auth context
const AuthContext = createContext<{
  user: typeof mockUserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<typeof mockUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Simulate loading user data on initial load
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For development, always load the mock user
        // In production, this would check session/token validity
        const hasSession = localStorage.getItem('auth_session');
        
        if (hasSession) {
          setUser(mockUserData);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Authentication failed'));
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock data and session
      setUser(mockUserData);
      localStorage.setItem('auth_session', 'mock_token');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mock logout function
  const logout = () => {
    localStorage.removeItem('auth_session');
    setUser(null);
  };
  
  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user (would come from API in production)
      const newUser = {
        ...mockUserData,
        id: `user-${Date.now()}`,
        name,
        email,
        created_at: new Date().toISOString(),
        preferences: {
          theme: 'system',
          fontSize: 'medium',
          fontFamily: 'system',
          reduceMotion: false,
          colorBlindMode: false,
          autoplayMedia: true,
          soundEnabled: true,
          notifications: {
            email: true,
            push: true,
            sms: false,
            frequency: 'daily'
          }
        }
      };
      
      setUser(newUser);
      localStorage.setItem('auth_session', 'mock_token');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Registration failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);

export default useAuth;
