
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
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
    // Simulate auth state for demo
    // TODO: Replace with actual Supabase implementation
    const initAuth = async () => {
      setLoading(false);
    };

    initAuth();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    // TODO: Implement Supabase signup with email confirmation and 3-day trial
    console.log('SignUp:', { email, userData });
    
    // Simulate demo account creation
    if (email.endsWith('@exemple.fr')) {
      const demoUser = {
        id: 'demo-user',
        email,
        user_metadata: { ...userData, demo: true }
      };
      setUser(demoUser as User);
      return { user: demoUser, error: null };
    }
    
    // For real accounts, this would integrate with Supabase
    const newUser = {
      id: 'real-user-' + Date.now(),
      email,
      user_metadata: { ...userData, trial_end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }
    };
    setUser(newUser as User);
    return { user: newUser, error: null };
  };

  const signIn = async (email: string, password: string) => {
    // TODO: Implement Supabase signin
    console.log('SignIn:', { email });
    
    const mockUser = {
      id: email.endsWith('@exemple.fr') ? 'demo-user' : 'real-user-' + Date.now(),
      email,
      user_metadata: { demo: email.endsWith('@exemple.fr') }
    };
    setUser(mockUser as User);
    return { user: mockUser, error: null };
  };

  const signOut = async () => {
    // TODO: Implement Supabase signout
    setUser(null);
    setSession(null);
  };

  const logout = async () => {
    await signOut();
  };

  const resetPassword = async (email: string) => {
    // TODO: Implement Supabase password reset
    console.log('Reset password for:', email);
    return { error: null };
  };

  const updateProfile = async (userData: any) => {
    // TODO: Implement Supabase profile update
    console.log('Update profile:', userData);
    if (user) {
      setUser({ ...user, user_metadata: { ...user.user_metadata, ...userData } });
    }
    return { error: null };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
