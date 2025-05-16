
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => null,
  logout: async () => {},
  clearError: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session on load
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('auth_session');
        const role = localStorage.getItem('user_role');
        
        if (token) {
          // Mock user data based on role
          const mockUser: User = {
            id: '1',
            name: role === 'b2b_admin' ? 'Admin Test' : role === 'b2b_user' ? 'Collaborateur Test' : 'Utilisateur Test',
            email: role === 'b2b_admin' ? 'admin@exemple.fr' : role === 'b2b_user' ? 'collaborateur@exemple.fr' : 'user@exemple.fr',
            role: role as any || 'b2c',
            avatar_url: '/images/avatar.jpg'
          };
          
          setUser(mockUser);
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock authentication for demo
      if (email === 'admin@exemple.fr' && password === 'admin') {
        const user: User = {
          id: '1',
          name: 'Admin Test',
          email: 'admin@exemple.fr',
          role: 'b2b_admin',
          avatar_url: '/images/avatar-admin.jpg'
        };
        
        localStorage.setItem('auth_session', 'mock_token_admin');
        localStorage.setItem('user_role', 'b2b_admin');
        setUser(user);
        return user;
      } 
      else if (email === 'collaborateur@exemple.fr' && password === 'admin') {
        const user: User = {
          id: '2',
          name: 'Collaborateur Test',
          email: 'collaborateur@exemple.fr',
          role: 'b2b_user',
          avatar_url: '/images/avatar-user.jpg'
        };
        
        localStorage.setItem('auth_session', 'mock_token_b2b_user');
        localStorage.setItem('user_role', 'b2b_user');
        setUser(user);
        return user;
      }
      else if (email === 'user@exemple.fr' && password === 'password') {
        const user: User = {
          id: '3',
          name: 'Utilisateur Test',
          email: 'user@exemple.fr',
          role: 'b2c',
          avatar_url: '/images/avatar-b2c.jpg'
        };
        
        localStorage.setItem('auth_session', 'mock_token_b2c');
        localStorage.setItem('user_role', 'b2c');
        setUser(user);
        return user;
      }
      else {
        throw new Error('Email ou mot de passe incorrect');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Clear local storage
      localStorage.removeItem('auth_session');
      localStorage.removeItem('user_role');
      localStorage.removeItem('userMode');
      
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Erreur de déconnexion');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
