
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import {
  User,
  UserPreferences,
  UserPreferencesState,
  ThemeName,
  FontFamily,
  AuthContextType
} from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const createDefaultPreferences = (): UserPreferences => {
  return {
    dashboardLayout: "standard",
    onboardingCompleted: false,
    theme: "light" as ThemeName,
    fontSize: "medium",
    language: "fr",
    fontFamily: "system-ui" as FontFamily,
    sound: true,
    notifications: {
      enabled: true,
      emailEnabled: true,
      pushEnabled: true,
      frequency: "daily",
      types: {
        system: true,
        emotion: true,
        coach: true,
        journal: true,
        community: true,
      },
      tone: "supportive",
      quietHours: {
        enabled: false,
        start: "22:00",
        end: "08:00",
      },
    },
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Preferences state and methods
  const [preferences, setPreferences] = useState<UserPreferences>(
    createDefaultPreferences()
  );
  const [preferencesLoading, setPreferencesLoading] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const {
            data: { user: sbUser },
          } = await supabase.auth.getUser();

          if (sbUser) {
            // Fetch user data and preferences from your database
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("*")
              .eq("id", sbUser.id)
              .single();

            if (userError) {
              console.error("Error fetching user data:", userError);
            }

            if (userData) {
              const userWithCorrectTypes: User = {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                role: userData.role,
                preferences: {
                  ...createDefaultPreferences(),
                  ...userData.preferences,
                },
                avatar_url: userData.avatar_url,
                created_at: userData.created_at,
              };

              setUser(userWithCorrectTypes);
              setPreferences(userWithCorrectTypes.preferences);
            } else {
              // If user data doesn't exist, create it
              const newUser = {
                id: sbUser.id,
                email: sbUser.email!,
                name: sbUser.email!.split("@")[0],
                role: "user",
                preferences: createDefaultPreferences(),
              };

              const { error: createUserError } = await supabase
                .from("users")
                .insert([newUser]);

              if (createUserError) {
                console.error("Error creating user:", createUserError);
              } else {
                setUser(newUser as User);
                setPreferences(newUser.preferences);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error in getSession:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getSession();
      } else {
        setUser(null);
        setPreferences(createDefaultPreferences());
      }
    });
  }, [navigate]);

  const signIn = async (email: string) => {
    setIsLoading(true);
    try {
      await supabase.auth.signInWithOtp({ email });
      alert("Check your email for the magic link.");
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, name: string) => {
    setIsLoading(true);
    try {
      await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-8),
        options: {
          data: {
            name: name,
            preferences: createDefaultPreferences(),
          },
        },
      });
      alert("Check your email to verify your account.");
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setPreferences(createDefaultPreferences());
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Alias for compatibility with other components
  const logout = signOut;

  const updateUser = async (updates: Partial<User>) => {
    setIsLoading(true);
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);

      if (error) {
        console.error("Error updating user:", error);
      } else {
        // Optimistically update the user in the context
        setUser((prevUser) =>
          prevUser ? { ...prevUser, ...updates } : prevUser
        );
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSinglePreference: UserPreferencesState["setSinglePreference"] =
    async (key, value) => {
      setPreferencesLoading(true);
      try {
        const newPreferences = { ...preferences, [key]: value };
        const { error } = await supabase
          .from("users")
          .update({ preferences: newPreferences })
          .eq("id", user?.id);

        if (error) {
          console.error("Error updating preferences:", error);
        } else {
          setPreferences(newPreferences);
          setUser((prevUser) =>
            prevUser
              ? { ...prevUser, preferences: newPreferences }
              : prevUser
          );
        }
      } catch (error) {
        console.error("Error updating preferences:", error);
      } finally {
        setPreferencesLoading(false);
      }
    };

  const resetPreferences: UserPreferencesState["resetPreferences"] =
    async () => {
      setPreferencesLoading(true);
      try {
        const defaultPreferences = createDefaultPreferences();
        const { error } = await supabase
          .from("users")
          .update({ preferences: defaultPreferences })
          .eq("id", user?.id);

        if (error) {
          console.error("Error resetting preferences:", error);
        } else {
          setPreferences(defaultPreferences);
          setUser((prevUser) =>
            prevUser
              ? { ...prevUser, preferences: defaultPreferences }
              : prevUser
          );
        }
      } catch (error) {
        console.error("Error resetting preferences:", error);
      } finally {
        setPreferencesLoading(false);
      }
    };

  const preferencesValue = {
    preferences,
    setPreferences,
    setSinglePreference,
    resetPreferences,
    loading: preferencesLoading,
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    setUser,
    isAuthenticated,
    isLoading,
    setIsLoading,
    signIn,
    signOut,
    signUp,
    updateUser,
    preferences: preferencesValue,
    logout, // Added for compatibility
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
