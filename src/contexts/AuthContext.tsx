
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, UserRole } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for stored user on initial load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('auth_user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Demo login logic - in a real app, this would call an API
      if (email === 'admin@exemple.fr' && password === 'admin') {
        const adminUser: User = {
          id: '1',
          name: 'Admin',
          email: 'admin@exemple.fr',
          role: 'admin' as UserRole,
          createdAt: new Date().toISOString(),
        };
        
        localStorage.setItem('auth_user', JSON.stringify(adminUser));
        setUser(adminUser);
        sessionStorage.setItem('just_logged_in', 'true');
        return true;
      } 
      else if (email === 'utilisateur@exemple.fr' && password === 'admin') {
        const regularUser: User = {
          id: '2',
          name: 'Utilisateur',
          email: 'utilisateur@exemple.fr',
          role: 'user' as UserRole,
          createdAt: new Date().toISOString(),
        };
        
        localStorage.setItem('auth_user', JSON.stringify(regularUser));
        setUser(regularUser);
        sessionStorage.setItem('just_logged_in', 'true');
        return true;
      }
      else if (email === 'collaborateur@exemple.fr' && password === 'admin') {
        const collaboratorUser: User = {
          id: '3',
          name: 'Collaborateur',
          email: 'collaborateur@exemple.fr',
          role: 'collaborator' as UserRole,
          createdAt: new Date().toISOString(),
        };
        
        localStorage.setItem('auth_user', JSON.stringify(collaboratorUser));
        setUser(collaboratorUser);
        sessionStorage.setItem('just_logged_in', 'true');
        return true;
      }
      
      // If not a demo user
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    try {
      localStorage.removeItem('auth_user');
      setUser(null);
      toast.info('Vous avez été déconnecté');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Register function
  const register = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // This would call an API in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
