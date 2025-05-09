
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase-client';
import { User, UserRole } from '@/types';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean; 
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUser?: (userData: Partial<User>) => void;
  setUser?: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Example user data for development
const MOCK_ADMIN_USER: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: UserRole.ADMIN,
  emotional_score: 78,
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  preferences: {
    theme: 'light',
    language: 'fr',
    privacy_level: 'private',
    notifications_enabled: true,
    fontSize: '16px',
    backgroundColor: '#ffffff',
    accentColor: '#0284c7',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  }
};

const MOCK_USER: User = {
  id: '2',
  name: 'Regular User',
  email: 'user@example.com',
  role: UserRole.USER,
  emotional_score: 65,
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
  preferences: {
    theme: 'light',
    language: 'fr',
    privacy_level: 'private',
    notifications_enabled: true,
    fontSize: '16px',
    backgroundColor: '#ffffff',
    accentColor: '#0284c7',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Computed property for authentication status
  const isAuthenticated = user !== null;

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        console.log("AuthProvider: Chargement de l'utilisateur");
        // Commenté pour l'instant car non fonctionnel sans backend
        // const { data: { user }, error } = await supabase.auth.getUser();
        // setUser(user as unknown as User);

        // Pour la démo, on n'utilise pas le user de Supabase
        // Vérifier si un utilisateur est stocké dans le localStorage
        const storedUser = localStorage.getItem('emotionscare_user');
        if (storedUser) {
          console.log("AuthProvider: Utilisateur trouvé dans le localStorage");
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      console.log("AuthProvider: Tentative de connexion", { email });
      // Simulate authentication for demo
      let mockUser;
      
      if (email === 'admin@example.com' && password === 'admin') {
        mockUser = MOCK_ADMIN_USER;
        console.log("AuthProvider: Connexion admin réussie");
      } else if (email === 'user@example.com' && password === 'password') {
        mockUser = MOCK_USER;
        console.log("AuthProvider: Connexion utilisateur réussie");
      } else {
        console.log("AuthProvider: Identifiants invalides");
        throw new Error("Identifiants invalides. Utilisez admin@example.com/admin ou user@example.com/password");
      }
      
      // Stocker l'utilisateur dans le localStorage pour la persistance
      localStorage.setItem('emotionscare_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
      
      // Code réel pour Supabase (commenté pour la démo)
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      // if (error) throw error;
      // setUser(data.user as unknown as User);
      // return data.user as unknown as User;
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log("AuthProvider: Déconnexion");
      // Pour l'instant on utilise juste un state local et localStorage
      localStorage.removeItem('emotionscare_user');
      setUser(null);
      
      // Version réelle avec Supabase
      // await supabase.auth.signOut();
      // setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Alias pour logout pour correspondre à la terminologie sign-out
  const signOut = async () => {
    await logout();
  };
  
  // Fonction de mise à jour de l'utilisateur
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('emotionscare_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const value: AuthContextProps = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    signOut,
    updateUser,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
