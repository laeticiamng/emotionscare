
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { User } from '@/types';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<User | { success: boolean; error?: string }>;
  register: (email: string, password: string, userData?: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Added for compatibility
  updateUserProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>; // Added for compatibility
}

const defaultAuthContext: AuthContextProps = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => ({ success: false, error: 'Not implemented' }),
  register: async () => ({ success: false, error: 'Not implemented' }),
  logout: async () => {},
  signOut: async () => {}, // Added for compatibility
  updateUserProfile: async () => ({ success: false, error: 'Not implemented' }), // Added for compatibility
};

const AuthContext = createContext<AuthContextProps>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch more user data if needed
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          // Combine auth user with profile data
          const userData: User = {
            id: user.id,
            name: profileData?.name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            role: profileData?.role || 'Utilisateur',
            avatar: profileData?.avatar_url || '/images/default-avatar.png',
          };
          
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        checkAuth();
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });

    // Check initial auth state
    checkAuth();

    // Clean up the subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Login error:', error.message);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        // Fetch user profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        // Create user object with roles and other data
        const userData: User = {
          id: data.user.id,
          name: profileData?.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          role: profileData?.role || 'Utilisateur',
          avatar: profileData?.avatar_url || '/images/default-avatar.png',
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        return userData; // Return the user object for direct usage
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login exception:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred during login'
      };
    }
  };

  const register = async (email: string, password: string, userData?: Partial<User>) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: userData?.name,
            role: userData?.role || 'Utilisateur',
          }
        }
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      // Note: User won't be automatically logged in, they'll need to confirm email first
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred during registration'
      };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Alias for logout for compatibility
  const signOut = logout;

  // Function to update user profile
  const updateUserProfile = async (data: Partial<User>) => {
    if (!user || !user.id) {
      return { success: false, error: 'No authenticated user' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          avatar_url: data.avatar,
          // Add any other fields you want to update
        })
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...data } : null);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
    signOut, // Added for compatibility
    updateUserProfile, // Added for compatibility
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
