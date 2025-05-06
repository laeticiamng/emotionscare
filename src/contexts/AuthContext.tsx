import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';
import { User } from '@/types';

// Import the activityLogService
import { activityLogService } from '@/lib/activityLogService';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => ({ success: false, error: 'Not implemented' }),
  logout: async () => { },
  signup: async () => ({ success: false, error: 'Not implemented' }),
  updateUser: async () => { }
});

const mapUser = (supabaseUser: any): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email!,
    name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
    role: supabaseUser.user_metadata?.role || 'user',
    avatar: supabaseUser.user_metadata?.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${supabaseUser.email}`,
    image: supabaseUser.user_metadata?.image,
    streak: supabaseUser.user_metadata?.streak,
    dailyGoal: supabaseUser.user_metadata?.dailyGoal,
    weeklyGoal: supabaseUser.user_metadata?.weeklyGoal,
    preferences: supabaseUser.user_metadata?.preferences,
    anonymity_code: supabaseUser.user_metadata?.anonymity_code,
    emotional_score: supabaseUser.user_metadata?.emotional_score,
    onboarded: supabaseUser.user_metadata?.onboarded,
    alias: supabaseUser.user_metadata?.alias,
    bio: supabaseUser.user_metadata?.bio,
    joined_at: supabaseUser.user_metadata?.joined_at,
    location_url: supabaseUser.user_metadata?.location_url,
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      supabase.auth.getSession()
        .then(({ data: { session } }) => {
          if (session) {
            setUser(mapUser(session.user));
            setIsAuthenticated(true);
          }
        })
        .catch(err => {
          console.error('getSession error:', err);
          setError(err.message);
        })
        .finally(() => setIsLoading(false));
    };
    
    getSession();
    
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(mapUser(session.user));
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
  }, []);
  
  const signup = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${email}`,
            role: 'user'
          }
        }
      });
      
      if (error) throw error;
      
      const user = data.user;
      setUser(mapUser(user));
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to signup');
      return { success: false, error: err instanceof Error ? err.message : 'Failed to signup' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update the login function to log the activity
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      const user = data.user;
      setUser(mapUser(user));
      setIsAuthenticated(true);
      
      // Log the login activity
      if (user) {
        activityLogService.logLogin(user.id);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login');
      return { success: false, error: err instanceof Error ? err.message : 'Failed to login' };
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);
  
  const updateUser = useCallback(async (updates: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Optimistically update the user in the context
      setUser(prevUser => ({ ...prevUser!, ...updates }));
      
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Update user error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    signup,
    updateUser
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
