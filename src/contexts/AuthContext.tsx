/**
 * AuthContext avec authentification automatique pour debug
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  role: 'b2c' | 'b2b_user' | 'b2b_admin';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  simulateLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: 'b2c' // Par défaut
        });
      } else {
        // Auto-login pour debug - créer un utilisateur temporaire
        simulateLogin();
      }
      setIsLoading(false);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: 'b2c'
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const simulateLogin = () => {
    // Créer un utilisateur temporaire pour debug
    const tempUser: User = {
      id: 'debug-user-123',
      email: 'debug@emotionscare.dev',
      role: 'b2c'
    };
    
    const tempSession = {
      user: {
        id: tempUser.id,
        email: tempUser.email,
        aud: 'authenticated',
        role: 'authenticated',
        created_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        identities: [],
        updated_at: new Date().toISOString()
      },
      access_token: 'debug-token',
      refresh_token: 'debug-refresh',
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      token_type: 'bearer'
    } as Session;

    setUser(tempUser);
    setSession(tempSession);
    setIsLoading(false);
    
    console.log('🔧 Debug: Utilisateur temporaire connecté automatiquement');
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erreur de connexion:', error);
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          role: 'b2c' // Par défaut, peut être déterminé depuis les métadonnées
        });
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${data.user.email}!`
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        console.error('Erreur d\'inscription:', error);
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      if (data?.user) {
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    setSession(null);
    toast({
      title: "Déconnexion",
      description: "À bientôt!"
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register,
      simulateLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};