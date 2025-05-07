
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { loginUser, logoutUser, getCurrentUser, updateUser as updateUserService } from '@/data/mockUsers';

export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>; // Added for compatibility with MobileNavigation
  updateUserProfile: (user: User) => Promise<User>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>; // Optional for compatibility
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signOut: async () => {},
  login: async () => ({ id: '', name: '', email: '', role: '', anonymity_code: '', onboarded: false }),
  logout: async () => {},
  updateUserProfile: async (user: User) => user,
  setUser: () => {},
  setIsAuthenticated: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          console.log("AuthProvider - Restored session for:", currentUser.name);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkExistingSession();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    try {
      setIsLoading(true);
      // Simulate API call
      const user = await loginUser(email, password);
      
      setUser(user);
      setIsAuthenticated(true);
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${user.name}!`,
      });
      
      console.log("Login successful:", user);
      return user;
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants incorrects. Veuillez réessayer.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile function
  const updateUserProfile = async (updatedUser: User): Promise<User> => {
    try {
      const result = await updateUserService(updatedUser);
      setUser(result);
      return result;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le profil",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      
      console.log("User signed out successfully");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de vous déconnecter",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Alias for signOut for compatibility
  const logout = signOut;

  const value = {
    user,
    isAuthenticated,
    isLoading,
    signOut,
    login,
    logout,
    updateUserProfile,
    setUser,
    setIsAuthenticated,
    setIsLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
