
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      // Check if demo account
      if (email.endsWith('@exemple.fr')) {
        // Demo account - simulate signup
        const demoUser = {
          id: 'demo-user-' + Date.now(),
          email,
          user_metadata: { 
            ...userData, 
            demo: true,
            trial_end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          }
        };
        setUser(demoUser as User);
        return { user: demoUser, error: null };
      }

      // Real account with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            trial_end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      });

      return { user: data.user, error };
    } catch (error) {
      console.error('SignUp error:', error);
      return { user: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Check if demo account
      if (email.endsWith('@exemple.fr')) {
        // Demo account - simulate signin
        const demoUser = {
          id: 'demo-user-' + Date.now(),
          email,
          user_metadata: { 
            demo: true,
            firstName: 'Demo',
            lastName: 'User',
            role: email.includes('admin') ? 'b2b_admin' : email.includes('user') ? 'b2b_user' : 'b2c'
          }
        };
        setUser(demoUser as User);
        return { user: demoUser, error: null };
      }

      // Real account with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      return { user: data.user, error };
    } catch (error) {
      console.error('SignIn error:', error);
      return { user: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        setSession(null);
      }
      return { error };
    } catch (error) {
      console.error('SignOut error:', error);
      return { error };
    }
  };

  const logout = async () => {
    await signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error };
    }
  };

  const updateProfile = async (userData: any) => {
    try {
      if (user?.user_metadata?.demo) {
        // Demo account - simulate update
        setUser({ 
          ...user, 
          user_metadata: { ...user.user_metadata, ...userData } 
        } as User);
        return { error: null };
      }

      // Real account with Supabase
      const { error } = await supabase.auth.updateUser({
        data: userData
      });
      return { error };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    isLoading: loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
