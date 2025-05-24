
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Create or update user profile
          await createOrUpdateProfile(session.user);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const createOrUpdateProfile = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.firstName 
            ? `${user.user_metadata.firstName} ${user.user_metadata.lastName || ''}`.trim()
            : user.user_metadata?.name || 'Utilisateur',
          role: user.user_metadata?.role || 'b2c',
          preferences: user.user_metadata?.preferences || {
            theme: 'system',
            language: 'fr',
            notifications_enabled: true,
            email_notifications: true
          }
        });

      if (error) {
        console.error('Error updating profile:', error);
      }
    } catch (error) {
      console.error('Error in createOrUpdateProfile:', error);
    }
  };

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

      if (!error && data.user) {
        toast.success('Compte créé avec succès ! Vérifiez votre email pour l\'activer.');
      }

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

      if (!error && data.user) {
        toast.success('Connexion réussie !');
      }

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
        toast.success('Déconnexion réussie');
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (!error) {
        toast.success('Email de réinitialisation envoyé !');
      }
      
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
      
      if (!error) {
        // Also update the profiles table
        await supabase
          .from('profiles')
          .update(userData)
          .eq('id', user?.id);
      }
      
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
