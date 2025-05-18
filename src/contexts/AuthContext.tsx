
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import authService from '@/services/auth-service';
import { AuthContextType } from '@/types/auth';
import { User, UserRole } from '@/types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const clearError = () => {
    setError(null);
  };

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { user, error } = await authService.getCurrentUser();
        
        if (error) throw error;
        
        if (user) {
          setUser(user);
          setIsAuthenticated(true);
          console.log('[AuthContext] User session restored:', user);
        }
      } catch (err: any) {
        console.error('[AuthContext] Error checking auth state:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Méthode de connexion
  const login = async (email: string, password: string): Promise<User> => {
    try {
      clearError();
      setIsLoading(true);
      
      const { user, error } = await authService.signIn({ email, password });
      
      if (error) throw error;
      if (!user) throw new Error('No user data returned');
      
      setUser(user);
      setIsAuthenticated(true);
      
      console.log('[AuthContext] User logged in:', user);
      
      return user;
    } catch (err: any) {
      console.error('[AuthContext] Login error:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Méthode de déconnexion
  const logout = async (): Promise<void> => {
    try {
      clearError();
      setIsLoading(true);
      
      const { error } = await authService.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('[AuthContext] User logged out');
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !"
      });
    } catch (err: any) {
      console.error('[AuthContext] Logout error:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Méthode d'inscription
  const register = async (name: string, email: string, password: string, role: UserRole = 'b2c'): Promise<User> => {
    try {
      clearError();
      setIsLoading(true);
      
      const { user, error } = await authService.signUp({
        name,
        email,
        password,
        role
      });
      
      if (error) throw error;
      if (!user) throw new Error('No user data returned');
      
      setUser(user);
      setIsAuthenticated(true);
      
      console.log('[AuthContext] User registered:', user);
      
      return user;
    } catch (err: any) {
      console.error('[AuthContext] Registration error:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Méthode de mise à jour du profil
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      clearError();
      setIsLoading(true);
      
      if (!user || !user.id) {
        throw new Error('No authenticated user');
      }
      
      const { success, error } = await authService.updateUserProfile(user.id, userData);
      
      if (error) throw error;
      if (!success) throw new Error('Failed to update user profile');
      
      setUser(prev => prev ? { ...prev, ...userData } : null);
      
      toast({
        title: "Profil mis à jour",
        description: "Votre profil a été mis à jour avec succès"
      });
    } catch (err: any) {
      console.error('[AuthContext] Update user error:', err);
      setError(err);
      
      toast({
        title: "Erreur de mise à jour",
        description: err.message || "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive"
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Méthode de mise à jour des préférences
  const updatePreferences = async (preferences: any): Promise<void> => {
    try {
      clearError();
      
      if (!user || !user.id) {
        throw new Error('No authenticated user');
      }
      
      const { success, error } = await authService.updateUserPreferences(user.id, preferences);
      
      if (error) throw error;
      if (!success) throw new Error('Failed to update preferences');
      
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            ...preferences
          }
        };
      });
      
      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences ont été enregistrées"
      });
    } catch (err: any) {
      console.error('[AuthContext] Update preferences error:', err);
      setError(err);
      
      toast({
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la mise à jour des préférences",
        variant: "destructive"
      });
      
      throw err;
    }
  };

  // Valeur du contexte
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    updateUser,
    updatePreferences,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
