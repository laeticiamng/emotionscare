
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types';

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Ajout de isLoading explicitement dans le type
  login: (credentials: { email: string; password: string; isAdmin?: boolean }) => Promise<boolean>;
  register: (userData: { email: string; password: string; name: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<User>;
  signOut: () => Promise<void>; // Ajout de signOut pour compatibilité
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Ajout de isLoading avec sa valeur par défaut
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  updateUser: async (user) => user,
  signOut: async () => {}, // Ajout de signOut pour compatibilité
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simuler la vérification de l'authentification au chargement
    const checkAuth = async () => {
      try {
        // Vérifier si l'utilisateur est déjà connecté
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async ({ email, password, isAdmin = false }: { email: string; password: string; isAdmin?: boolean }) => {
    // Simulation d'un appel API pour la connexion
    try {
      setIsLoading(true);
      // Simulation delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock de la vérification d'authentification
      if (email && password.length >= 6) {
        // Pour la démo, on crée un utilisateur factice
        const mockUser: User = {
          id: 'user-123',
          name: 'John Doe',
          email: email,
          role: isAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
          isActive: true,
          avatar_url: 'https://i.pravatar.cc/150?u=user123'
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async ({ email, password, name }: { email: string; password: string; name: string }) => {
    // Simulation d'un appel API pour l'inscription
    try {
      setIsLoading(true);
      // Simulation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password.length >= 6) {
        // Pour la démo, on crée un utilisateur factice
        const mockUser: User = {
          id: `user-${Date.now()}`,
          name: name,
          email: email,
          role: 'user',
          createdAt: new Date().toISOString(),
          isActive: true,
          avatar_url: `https://i.pravatar.cc/150?u=${Date.now()}`
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    // Simulation d'un appel API pour la déconnexion
    localStorage.removeItem('user');
    setUser(null);
  };
  
  // Alias pour compatibility
  const signOut = logout;
  
  const updateUser = async (updatedUser: User): Promise<User> => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw new Error('Failed to update user');
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
        register,
        logout,
        updateUser,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
