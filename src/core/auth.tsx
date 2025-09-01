import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: 'consumer' | 'employee' | 'manager' | null;
  loading: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'consumer' | 'employee' | 'manager' | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer role fetching to avoid auth state deadlock
          setTimeout(async () => {
            try {
              const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
              
              const userRole = data?.role || 
                session.user.user_metadata?.role || 
                'consumer';
              
              // Normalize role properly
              const normalizedRole = userRole === 'b2c' || userRole === 'consumer' ? 'consumer' :
                userRole === 'b2b_user' || userRole === 'employee' ? 'employee' :
                userRole === 'b2b_admin' || userRole === 'manager' ? 'manager' :
                'consumer'; // default fallback
              
              console.log('Role normalized:', userRole, '->', normalizedRole);
              setRole(normalizedRole);
              
              // Auto-redirect after successful login
              if (event === 'SIGNED_IN' && window.location.pathname === '/login') {
                console.log('Auto-redirecting to dashboard for role:', normalizedRole);
                const dashboardRoute = normalizedRole === 'consumer' ? '/app/home' :
                                     normalizedRole === 'employee' ? '/app/collab' :
                                     normalizedRole === 'manager' ? '/app/rh' : '/app/home';
                
                window.location.href = dashboardRoute;
              }
            } catch (error) {
              console.warn('Role fetch failed:', error);
              setRole('consumer');
              // Still redirect on login
              if (event === 'SIGNED_IN' && window.location.pathname === '/login') {
                window.location.href = '/app/home';
              }
            }
          }, 0);
        } else {
          setRole(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isAuthenticated = !!session && !!user;

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      role, 
      loading, 
      isLoading, 
      login, 
      signUp, 
      signOut,
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}