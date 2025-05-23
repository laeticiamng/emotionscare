
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserMode } from './UserModeContext';
import { toast } from 'sonner';

interface AuthContextType {
  user: any;
  session: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  updateUser: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  updateUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userMode, setUserMode, clearUserMode } = useUserMode();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // Get initial session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
          
          // Set user mode based on user metadata if available
          if (data.session.user.user_metadata?.role) {
            const role = data.session.user.user_metadata.role;
            
            if (role === 'b2b_admin' || role === 'admin') {
              setUserMode('b2b_admin');
            } else if (role === 'b2b_user' || role === 'b2b-user') {
              setUserMode('b2b_user');
            } else {
              setUserMode('b2c');
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
      
      // Set up auth state change listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user || null);
          
          if (event === 'SIGNED_OUT') {
            clearUserMode?.();
          }
        }
      );
      
      return () => {
        authListener?.subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
        throw error;
      }
      
      // Update state with user and session
      setUser(data.user);
      setSession(data.session);
      
      // Set user mode based on metadata
      if (data.user?.user_metadata?.role) {
        const role = data.user.user_metadata.role;
        
        if (role === 'b2b_admin' || role === 'admin') {
          setUserMode('b2b_admin');
        } else if (role === 'b2b_user' || role === 'b2b-user') {
          setUserMode('b2b_user');
        } else {
          setUserMode('b2c');
        }
      }
      
      toast.success('Connexion réussie');
    } catch (error: any) {
      console.error('Login error:', error.message);
      toast.error(`Erreur de connexion: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Set role based on current userMode
      const role = userMode || 'b2c';
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            preferences: {
              theme: 'system',
              language: 'fr',
              notifications_enabled: true,
              email_notifications: true,
            },
          },
        },
      });
      
      if (error) {
        setError(error.message);
        throw error;
      }
      
      if (data.user) {
        toast.success('Inscription réussie! Veuillez vérifier votre email pour confirmer votre compte.');
        
        // If session is available (email confirmation disabled), update state
        if (data.session) {
          setUser(data.user);
          setSession(data.session);
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error.message);
      toast.error(`Erreur d'inscription: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear auth state
      setUser(null);
      setSession(null);
      clearUserMode?.();
      
      toast.success('Déconnexion réussie');
    } catch (error: any) {
      console.error('Logout error:', error.message);
      toast.error(`Erreur de déconnexion: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password-confirmation`,
      });
      
      if (error) {
        setError(error.message);
        throw error;
      }
      
      toast.success('Instructions de réinitialisation envoyées à votre adresse email');
    } catch (error: any) {
      console.error('Password reset error:', error.message);
      toast.error(`Erreur de réinitialisation: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update profile in 'profiles' table
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      
      if (error) {
        setError(error.message);
        throw error;
      }
      
      toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
      console.error('Profile update error:', error.message);
      toast.error(`Erreur de mise à jour du profil: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user metadata
  const updateUser = async (data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: updatedUser, error } = await supabase.auth.updateUser({
        data: data,
      });
      
      if (error) {
        setError(error.message);
        throw error;
      }
      
      if (updatedUser) {
        setUser(updatedUser);
      }
      
      toast.success('Utilisateur mis à jour avec succès');
    } catch (error: any) {
      console.error('User update error:', error.message);
      toast.error(`Erreur de mise à jour: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!session;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
