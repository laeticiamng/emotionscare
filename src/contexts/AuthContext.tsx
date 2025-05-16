
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {}
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simuler un chargement des données utilisateur
    const checkAuth = async () => {
      try {
        // Simuler une vérification d'authentification
        const savedUser = localStorage.getItem('emotionscare_user');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pour la démo, accepter n'importe quelles identifiants
      const mockUser: User = {
        id: '1',
        name: 'Utilisateur Demo',
        email,
        role: 'user'
      };
      
      setUser(mockUser);
      localStorage.setItem('emotionscare_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return false;
    }
  };
  
  const logout = async (): Promise<void> => {
    try {
      // Simulate logout API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('emotionscare_user');
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
