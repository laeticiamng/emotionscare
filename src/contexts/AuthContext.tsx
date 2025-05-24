
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    // Gestion stricte de l'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] State change:', event, session?.user?.id);
        
        if (session?.user) {
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
          setUser(null);
          localStorage.removeItem('auth_user');
        }
        
        setIsLoading(false);
      }
    );

    // Vérifier la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
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
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Simulation d'authentification en attendant la vraie validation JWT
      const mockUser: User = {
        id: '1',
        email,
        role: email.includes('@admin') ? 'b2b_admin' : 
              email.includes('@company') ? 'b2b_user' : 'b2c',
        firstName: 'John',
        lastName: 'Doe',
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      // Simulation d'inscription
      const mockUser: User = {
        id: '1',
        email,
        role: 'b2c',
        firstName: metadata?.first_name,
        lastName: metadata?.last_name,
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
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
      // Simulation de reset password
      return { error: null };
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
