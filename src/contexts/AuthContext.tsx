import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase';
import { User, UserPreferences, AuthContextType, UserRole } from '@/types/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>({});

  useEffect(() => {
    const session = supabase.auth.getSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.id) {
        fetchUser(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    if (session?.data?.session?.user?.id) {
      fetchUser(session.data.session.user.id);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Vérifier si la fonction RPC existe
      try {
        const { data, error } = await supabase.rpc('get_user_by_id', { user_id: userId });
        
        if (error) throw new Error('RPC error: ' + error.message);
        if (data) {
          // Traiter les données de l'utilisateur
          return data;
        }
      } catch (rpcError) {
        console.warn('RPC get_user_by_id failed, falling back to direct query', rpcError);
        
        // Fallback: query direct si RPC échoue
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (error) throw error;
        return userData;
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  };
  
  const fetchUser = async (userId: string) => {
    try {
      const userData = await loadUserData(userId);
      
      if (userData) {
        // Vérification de type avant d'accéder aux propriétés
        const safeUserData = userData as Record<string, any>;
        
        setUser({
          id: userId,
          email: safeUserData.email || '',
          name: safeUserData.name || '',
          role: (safeUserData.role || 'b2c') as UserRole,
          created_at: safeUserData.created_at || new Date().toISOString(),
          avatar: safeUserData.avatar_url || undefined
        });
        
        setPreferences({
          privacy: safeUserData.privacy || 'public',
          notifications_enabled: safeUserData.notifications_enabled || true,
          autoplayVideos: safeUserData.autoplayVideos || false,
          dataCollection: safeUserData.dataCollection || true,
          aiSuggestions: safeUserData.aiSuggestions || true,
          emotionalCamouflage: safeUserData.emotionalCamouflage || false
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setIsLoading(false);
    }
  };

  const signIn = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const signUp = async (email: string, name: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-8),
        options: {
          data: {
            name,
            avatar_url: '',
          },
        },
      });
      if (error) throw error;
      if (data.user) {
        fetchUser(data.user.id);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user?.id);
      if (error) throw error;
      setUser({ ...user!, ...updates });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const setSinglePreference = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
  }, [signOut]);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
    }
  }, [user]);

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    isLoading,
    setIsLoading,
    signIn,
    signOut,
    signUp,
    updateUser,
    preferences,
    setSinglePreference,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
