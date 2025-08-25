
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  user_type: 'b2c' | 'b2b_user' | 'b2b_admin';
  permissions: string[];
  subscription_type: 'free' | 'premium' | 'enterprise';
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: AuthError }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le profil utilisateur
  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Créer une session utilisateur
  const createUserSession = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          device_info: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          }
        });

      if (error) {
        console.error('Error creating session:', error);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  // Initialisation de l'authentification
  useEffect(() => {
    console.log('🔐 AuthProvider: Initialisation...');

    // Écouter les changements d'état d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadProfile(session.user.id);
          if (event === 'SIGNED_IN') {
            await createUserSession(session.user.id);
            toast.success('Connexion réussie !');
          }
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    // Récupérer la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 Session existante:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error('Erreur de connexion : ' + error.message);
        return { error };
      }

      return {};
    } catch (error: any) {
      toast.error('Erreur inattendue : ' + error.message);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata = {}) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: metadata.display_name || email.split('@')[0],
            user_type: metadata.user_type || 'b2c',
            ...metadata
          }
        }
      });

      if (error) {
        toast.error('Erreur d\'inscription : ' + error.message);
        return { error };
      }

      toast.success('Inscription réussie ! Vérifiez votre email.');
      return {};
    } catch (error: any) {
      toast.error('Erreur inattendue : ' + error.message);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Terminer la session en base
      if (user) {
        await supabase
          .from('user_sessions')
          .update({ session_end: new Date().toISOString() })
          .eq('user_id', user.id)
          .is('session_end', null);
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Erreur de déconnexion : ' + error.message);
        return;
      }

      setUser(null);
      setProfile(null);
      setSession(null);
      toast.success('Déconnexion réussie');
    } catch (error: any) {
      toast.error('Erreur inattendue : ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        toast.error('Erreur : ' + error.message);
        return { error };
      }

      toast.success('Email de réinitialisation envoyé !');
      return {};
    } catch (error: any) {
      toast.error('Erreur inattendue : ' + error.message);
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: { message: 'Non authentifié' } };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        toast.error('Erreur de mise à jour : ' + error.message);
        return { error };
      }

      await refreshProfile();
      toast.success('Profil mis à jour avec succès !');
      return {};
    } catch (error: any) {
      toast.error('Erreur inattendue : ' + error.message);
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const value = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
