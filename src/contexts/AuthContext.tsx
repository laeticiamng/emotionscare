
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, AuthState, LoginFormData, RegisterFormData } from '@/types/auth';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  signIn: (data: LoginFormData) => Promise<void>;
  signUp: (data: RegisterFormData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Récupérer le profil utilisateur complet
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setState({
            user: profile || session.user,
            session,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async ({ email, password }: LoginFormData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Connexion réussie !');
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur de connexion';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      toast.error(errorMessage);
      throw error;
    }
  };

  const signUp = async ({ email, password, name, role = 'b2c' }: RegisterFormData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role,
          }
        }
      });

      if (error) throw error;
      
      toast.success('Inscription réussie ! Vérifiez votre email.');
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur d\'inscription';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      toast.error(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Déconnexion réussie');
    } catch (error: any) {
      toast.error('Erreur de déconnexion');
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!state.user) throw new Error('Utilisateur non connecté');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', state.user.id);

      if (error) throw error;
      
      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null
      }));
      
      toast.success('Profil mis à jour');
    } catch (error: any) {
      toast.error('Erreur de mise à jour du profil');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast.success('Email de réinitialisation envoyé');
    } catch (error: any) {
      toast.error('Erreur d\'envoi de l\'email');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      signIn,
      signUp,
      signOut,
      updateProfile,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
