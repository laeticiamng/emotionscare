import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SimpleAuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const SimpleAuthContext = createContext<SimpleAuthContextType>({
  isAuthenticated: false,
  user: null,
  role: null,
  loading: true,
  signIn: async () => {},
  signOut: () => {},
});

export const useSimpleAuth = () => useContext(SimpleAuthContext);

export const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('simple_auth_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      setRole(userData.role || 'consumer');
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simple mock authentication
    const mockUser = {
      id: 'user-123',
      email,
      role: email.includes('manager') ? 'manager' : 
            email.includes('employee') ? 'employee' : 'consumer',
      name: 'Demo User'
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    setRole(mockUser.role);
    localStorage.setItem('simple_auth_user', JSON.stringify(mockUser));

    // Navigate based on role
    const dashboardRoute = mockUser.role === 'consumer' ? '/app/home' :
                          mockUser.role === 'employee' ? '/app/collab' :
                          mockUser.role === 'manager' ? '/app/rh' : '/app/home';
    
    navigate(dashboardRoute, { replace: true });
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem('simple_auth_user');
    navigate('/', { replace: true });
  };

  const value = {
    isAuthenticated,
    user,
    role,
    loading,
    signIn,
    signOut,
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};