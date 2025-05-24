
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  role: 'b2c' | 'b2b_user' | 'b2b_admin';
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Gestion de l'état d'authentification avec validation JWT stricte
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] State change:', event, session?.user?.id);
        
        if (session?.user && session.access_token) {
          // Validation du token côté client
          try {
            const tokenPayload = JSON.parse(atob(session.access_token.split('.')[1]));
            const isExpired = tokenPayload.exp * 1000 < Date.now();
            
            if (isExpired) {
              console.warn('[Auth] Token expired, refreshing...');
              await supabase.auth.refreshSession();
              return;
            }
            
            const mockUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              role: session.user.email?.includes('@admin') ? 'b2b_admin' : 
                    session.user.email?.includes('@company') ? 'b2b_user' : 'b2c',
              firstName: session.user.user_metadata?.first_name || 'John',
              lastName: session.user.user_metadata?.last_name || 'Doe',
            };
            
            setUser(mockUser);
            localStorage.setItem('auth_user', JSON.stringify(mockUser));
          } catch (error) {
            console.error('[Auth] Token validation error:', error);
            await signOut();
          }
        } else {
          setUser(null);
          localStorage.removeItem('auth_user');
        }
        
        setIsLoading(false);
      }
    );

    // Vérifier la session existante avec validation
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && session.access_token) {
        try {
          const tokenPayload = JSON.parse(atob(session.access_token.split('.')[1]));
          const isExpired = tokenPayload.exp * 1000 < Date.now();
          
          if (!isExpired) {
            const mockUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              role: session.user.email?.includes('@admin') ? 'b2b_admin' : 
                    session.user.email?.includes('@company') ? 'b2b_user' : 'b2c',
              firstName: session.user.user_metadata?.first_name || 'John',
              lastName: session.user.user_metadata?.last_name || 'Doe',
            };
            
            setUser(mockUser);
            localStorage.setItem('auth_user', JSON.stringify(mockUser));
          } else {
            console.warn('[Auth] Session token expired on load');
          }
        } catch (error) {
          console.error('[Auth] Session validation error:', error);
        }
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('auth_user');
    } catch (error) {
      console.error('[Auth] Error during signout:', error);
      // Force cleanup même en cas d'erreur
      setUser(null);
      localStorage.removeItem('auth_user');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const refreshToken = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('[Auth] Token refresh failed:', error);
        await signOut();
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('[Auth] Token refresh error:', error);
      await signOut();
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
