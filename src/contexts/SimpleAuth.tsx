import React, { createContext, useContext, useState, useEffect } from 'react';

interface SimpleAuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => void;
}

const SimpleAuthContext = createContext<SimpleAuthContextType>({
  isAuthenticated: false,
  user: null,
  role: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
});

export const useSimpleAuth = () => useContext(SimpleAuthContext);

export const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Commencer avec false pour éviter de bloquer les champs

  useEffect(() => {
    setLoading(true); // Activer le loading pendant la vérification
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('simple_auth_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setRole(userData.role || 'consumer');
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('simple_auth_user');
      }
    }
    setLoading(false); // Désactiver le loading à la fin
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
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

      console.log('✅ Connexion réussie, redirection...', mockUser);

      // Redirection immédiate sans setTimeout
      console.log('🔄 Redirection immédiate vers dashboard...');
      
      // Redirection immédiate avec window.location
      console.log('🔄 Redirection vers /app/home...');
      window.location.href = '/app/home';
      
    } catch (error) {
      console.error('SignIn error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    setLoading(true);
    try {
      // Simple mock registration - in real app, this would call your API
      const mockUser = {
        id: 'user-' + Date.now(),
        email,
        role: metadata?.segment === 'b2b' ? 'employee' : 'consumer',
        name: metadata?.full_name || 'Nouvel utilisateur',
        ...metadata
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      setRole(mockUser.role);
      localStorage.setItem('simple_auth_user', JSON.stringify(mockUser));

      console.log('✅ Inscription réussie, redirection...', mockUser);

      // Navigate based on role
      setTimeout(() => {
        const dashboardRoute = '/app/home'; // Dashboard principal
        
        console.log('🔄 Redirection vers:', dashboardRoute);
        
        // Forcer la redirection
        window.location.replace(dashboardRoute);
      }, 500);
    } catch (error) {
      console.error('SignUp error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      setRole(null);
      localStorage.removeItem('simple_auth_user');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('SignOut error:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    role,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};