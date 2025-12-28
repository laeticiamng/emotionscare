/**
 * AuthContext - Gestion de l'authentification centralisée
 * Intégration Supabase avec gestion d'état et persistence
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias pour compatibilité
  resetPassword: (email: string) => Promise<void>;
  register: (email: string, password: string, metadata?: any) => Promise<void>;
  updateUser: (data: { data?: Record<string, any>; password?: string }) => Promise<User | null>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Récupérer la session initiale
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          logger.error('Erreur lors de la récupération de la session', error, 'AUTH');
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        logger.error('Erreur inattendue lors de la récupération de la session', error as Error, 'AUTH');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        logger.info(`Auth state changed: ${event}`, { email: session?.user?.email }, 'AUTH');
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Gestion des événements spécifiques
        switch (event) {
          case 'SIGNED_IN':
            logger.info('Utilisateur connecté', undefined, 'AUTH');
            break;
          case 'SIGNED_OUT':
            logger.info('Utilisateur déconnecté', undefined, 'AUTH');
            break;
          case 'TOKEN_REFRESHED':
            logger.debug('Token rafraîchi', undefined, 'AUTH');
            break;
          case 'USER_UPDATED':
            logger.info('Utilisateur mis à jour', undefined, 'AUTH');
            break;
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata = {}) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        logger.error('Erreur lors de l\'inscription', error as Error, 'AUTH');
        throw error; // Lancer l'erreur pour que le composant puisse la gérer
      }

      if (data.user && !data.user.email_confirmed_at) {
        logger.info('Email de confirmation envoyé', undefined, 'AUTH');
      }
    } catch (error) {
      logger.error('Erreur lors de l\'inscription', error as Error, 'AUTH');
      throw error; // Relancer pour compatibilité avec les composants existants
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logger.error('Erreur lors de la connexion', error as Error, 'AUTH');
        throw error; // Lancer l'erreur pour que le composant puisse la gérer
      }

      logger.info('Connexion réussie', { email }, 'AUTH');
    } catch (error) {
      logger.error('Erreur lors de la connexion', error as Error, 'AUTH');
      throw error; // Relancer pour compatibilité avec les composants existants
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      logger.info('Déconnexion réussie', undefined, 'AUTH');
    } catch (error) {
      logger.error('Erreur lors de la déconnexion', error as Error, 'AUTH');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      logger.info('Email de réinitialisation envoyé', { email }, 'AUTH');
    } catch (error) {
      logger.error('Erreur lors de la réinitialisation', error as Error, 'AUTH');
      throw error;
    }
  };

  // Alias pour la compatibilité
  const register = signUp;

  // Update user data
  const updateUser = async (updates: { data?: Record<string, any>; password?: string }): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.updateUser(updates);
      
      if (error) {
        logger.error('Erreur lors de la mise à jour utilisateur', error as Error, 'AUTH');
        throw error;
      }
      
      if (data.user) {
        setUser(data.user);
        logger.info('Utilisateur mis à jour', undefined, 'AUTH');
      }
      
      return data.user;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour utilisateur', error as Error, 'AUTH');
      throw error;
    }
  };

  // Refresh session
  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      logger.error('Erreur lors du rafraîchissement de la session', error as Error, 'AUTH');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    logout: signOut, // Alias pour compatibilité
    resetPassword,
    register,
    updateUser,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Alias pour compatibilité
export { AuthProvider as default };
export const AuthContextProvider = AuthProvider;