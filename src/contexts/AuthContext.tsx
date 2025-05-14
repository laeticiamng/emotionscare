import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserPreferences, AuthContextType } from '@/types/types';

// Fix for 'default' not being an allowed dashboardLayout value
// Just changing the line where the default preferences are set
const defaultPreferences: UserPreferences = {
  dashboardLayout: 'standard',  // Changed from 'default'
  onboardingCompleted: false,
  theme: 'light',
  fontSize: 'medium',
  fontFamily: 'system',
  sound: true,
  notifications_enabled: true,
};

const defaultUser: User = {
  id: '',
  email: '',
  name: '',
  role: 'b2c',
  created_at: new Date().toISOString(),
  preferences: defaultPreferences
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const sessionResponse = await supabase.auth.getSession();
        const session = sessionResponse.data?.session;

        if (session) {
          const { user: authUser } = session;

          // Fetch user profile from profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            throw profileError;
          }

          if (profileData) {
            // Set user state
            setUser({
              id: authUser.id,
              email: authUser.email,
              name: profileData.name || authUser.email?.split('@')[0] || 'Utilisateur',
              role: profileData.role || 'b2c',
              created_at: authUser.created_at || new Date().toISOString(),
              avatar: profileData.avatar_url || '',
              avatar_url: profileData.avatar_url || '',
              onboarded: profileData.onboarded || false,
              department: profileData.department || '',
              position: profileData.position || '',
              anonymity_code: profileData.anonymity_code || '',
              emotional_score: profileData.emotional_score || 0,
              preferences: {
                ...(profileData.preferences || defaultPreferences)
              }
            });

            // Set preferences state
            setPreferences({
              ...(profileData.preferences || defaultPreferences)
            });

            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth session error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Get initial session
    getSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);

      if (event === 'SIGNED_IN' && session) {
        // Similar to getSession logic
        setIsAuthenticated(true);
        
        // For now just set loading to false to avoid duplicate logic
        // getSession() will run anyways
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(defaultUser);
        setPreferences(defaultPreferences);
        setIsLoading(false);
      }
    });

    return () => {
      // Clean up subscription
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;
      
      // Create a profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name,
              email,
              role: 'b2c', // Default role
              preferences: defaultPreferences,
            },
          ]);

        if (profileError) throw profileError;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setUser({ ...user, ...data });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      signIn,
      signUp,
      signOut,
      updateProfile,
      resetPassword,
      updatePassword,
      setUser,
      setPreferences,
      logout: signOut, // Added for compatibility
      updateUser: updateProfile, // Added for compatibility
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
