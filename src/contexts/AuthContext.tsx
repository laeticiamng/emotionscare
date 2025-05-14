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
} from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, name: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  preferences: UserPreferencesState;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const createDefaultPreferences = (): UserPreferences => {
  return {
    dashboardLayout: "standard",
    onboardingCompleted: false,
    theme: "light",
    fontSize: "medium",
    language: "fr",
    fontFamily: "system-ui", // Add missing properties
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
  const router = useRouter();

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
                last_seen: userData.last_seen,
                profile: userData.profile,
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
  }, [router]);

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
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user?.id);

      if (error) {
        console.error("Error updating user:", error);
      }

      if (data && data.length > 0) {
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

  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    signIn,
    signOut,
    signUp,
    updateUser,
    preferences: preferencesValue,
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
