
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import authService from '@/services/auth-service';
import { AuthContextType } from '@/types/auth';
import { User, UserRole } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const clearError = () => setError(null);

  useEffect(() => {
    const setupAuthListener = () => {
      // Set up auth state listener for Supabase
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('[AuthContext] Auth state changed:', event, Boolean(session));
          
          if (session?.user) {
            try {
              // Get full user profile from Supabase
              const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              const userData: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: profileData?.name || session.user.user_metadata?.name || '',
                role: (profileData?.role || session.user.user_metadata?.role || 'b2c') as UserRole,
                created_at: session.user.created_at,
                preferences: {
                  theme: 'system',
                  language: 'fr',
                  ...(profileData?.preferences || session.user.user_metadata?.preferences || {}),
                }
              };
              
              setUser(userData);
              setIsAuthenticated(true);
            } catch (err) {
              console.error('[AuthContext] Error getting user profile:', err);
              // Still set basic user info from session
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || '',
                role: (session.user.user_metadata?.role || 'b2c') as UserRole,
                created_at: session.user.created_at,
              });
              setIsAuthenticated(true);
            }
          } else {
            // User is not authenticated
            setUser(null);
            setIsAuthenticated(false);
          }
          
          setIsLoading(false);
        }
      );
      
      // Return unsubscribe function
      return () => {
        subscription.unsubscribe();
      };
    };
    
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { user, error } = await authService.getCurrentUser();
        
        if (error) {
          console.error('[AuthContext] Error checking auth state:', error);
          setError(error);
          setUser(null);
          setIsAuthenticated(false);
          return;
        }
        
        if (user) {
          setUser(user);
          setIsAuthenticated(true);
          console.log('[AuthContext] User session restored:', user);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err: any) {
        console.error('[AuthContext] Error checking auth state:', err);
        setError(err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up auth listener
    const unsubscribe = setupAuthListener();
    
    // Check initial auth state
    checkAuth();
    
    // Clean up subscription
    return () => {
      unsubscribe();
    };
  }, []);

  // Login method
  const login = async (email: string, password: string): Promise<User> => {
    try {
      clearError();
      setIsLoading(true);
      
      const { user, error } = await authService.signIn({ email, password });
      
      if (error) throw error;
      if (!user) throw new Error('No user data returned');
      
      // Don't need to set user/authenticated state here as the auth listener will handle it
      
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

  // Logout method
  const logout = async (): Promise<void> => {
    try {
      clearError();
      setIsLoading(true);
      
      const { error } = await authService.signOut();
      
      if (error) throw error;
      
      // Don't need to clear user/authenticated state here as the auth listener will handle it
      
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

  // Register method
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
      
      // Don't need to set user/authenticated state here as the auth listener will handle it
      
      console.log('[AuthContext] User registered:', user);
      
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur EmotionsCare !"
      });
      
      return user;
    } catch (err: any) {
      console.error('[AuthContext] Registration error:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile method
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

  // Update user preferences method
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

  // Context value
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

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
