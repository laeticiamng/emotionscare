import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, UserPreferences } from '@/types';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password?: string, name?: string) => Promise<void>;
  updateUser: (updates: any) => Promise<void>;
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const defaultPreferences = {
  theme: 'light' as const,
  notifications_enabled: true,
  font_size: 'medium' as const,
  language: 'fr',
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setIsAuthenticated(true);
          const { data: profile, error } = await supabase
            .from('profiles')
            .select(`name, email, avatar, role, preferences`)
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
          }

          const userProfile: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || 'Utilisateur',
            avatar: profile?.avatar || '',
            role: profile?.role || 'user',
            preferences: {
              ...defaultPreferences,
              ...profile?.preferences
            }
          };
          setUser(userProfile);
          setPreferences(userProfile.preferences || defaultPreferences);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        const userProfile: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.email || 'Utilisateur',
          avatar: '',
          role: 'user',
          preferences: defaultPreferences
        };
        setUser(userProfile);
        setPreferences(defaultPreferences);
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
      }
    });
  }, [navigate]);

  const signIn = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert('Check your email for the magic link.');
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password?: string, name?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password || 'default_password',
        options: {
          data: {
            name: name || 'New User',
            avatar: '',
          },
        },
      });
      if (error) throw error;

      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, name: name, email: email }]);

        if (profileError) {
          console.error('Could not create user profile:', profileError);
        }
      }

      alert('Check your email to verify your account!');
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user?.id);
      if (error) throw error;
      setUser({ ...user, ...updates } as User);
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    setIsLoading(true);
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      const { data, error } = await supabase
        .from('profiles')
        .update({ preferences: updatedPreferences })
        .eq('id', user?.id)
        .select('preferences')
        .single();

      if (error) {
        console.error("Error updating preferences:", error);
        throw error;
      }

      setPreferences(data.preferences);
      setUser(prevUser => {
        if (prevUser) {
          return { ...prevUser, preferences: data.preferences };
        }
        return prevUser;
      });
    } catch (error: any) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextProps = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    signUp,
    updateUser,
    preferences,
    updatePreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
