
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getCurrentUser, loginUser, logoutUser, updateUser } from '../data/mockData';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { isAdminRole } from '@/utils/roleUtils';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Add signOut method as alias for logout
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => null,
  logout: async () => {},
  signOut: async () => {}, // Add signOut as alias
  updateUserProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        console.log("Auth checked, current user:", currentUser);
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      console.log(`Attempting login for email: ${email}`);
      // Pour Sophie, on accepte le mot de passe "sophie" ou pas de mot de passe du tout
      let loggedInUser;
      
      if (email === 'sophie@example.com') {
        if (!password || password === 'sophie') {
          loggedInUser = await loginUser(email, password);
        } else {
          throw new Error("Mot de passe incorrect pour Sophie");
        }
      } else if (email === 'admin@example.com') {
        if (!password || password === 'admin') {
          loggedInUser = await loginUser(email, password);
        } else {
          throw new Error("Mot de passe incorrect pour Admin");
        }
      } else {
        loggedInUser = await loginUser(email, password);
      }
      
      setUser(loggedInUser);
      console.log("Login successful, user:", loggedInUser);
      
      // Afficher un message de bienvenue
      toast({
        title: `Bienvenue, ${loggedInUser.name}`,
        description: "Vous êtes maintenant connecté(e)",
      });
      
      // Rediriger selon le rôle et la page actuelle
      if (isAdminRole(loggedInUser.role)) {
        console.log("Admin user detected, redirecting to dashboard");
        navigate('/dashboard');
      } else {
        console.log("Regular user detected, redirecting to dashboard");
        navigate('/dashboard');
      }
      
      return loggedInUser;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants incorrects",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
      navigate('/');
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add signOut as an alias for logout
  const signOut = logout;

  const updateUserProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const updatedUser = await updateUser(userData);
      setUser(updatedUser);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur de mise à jour",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signOut, // Include signOut in the context value
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
