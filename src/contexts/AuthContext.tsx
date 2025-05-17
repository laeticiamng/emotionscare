
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { User, UserPreferences } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        // Extract user role from local storage
        const userRole = localStorage.getItem('user_role') as User['role'];
        
        // Default preferences
        const defaultPreferences: UserPreferences = {
          theme: 'light',
          language: 'fr',
          notifications_enabled: true,
          email_notifications: true
        };
        
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Utilisateur',
          role: userRole || 'b2c',
          created_at: firebaseUser.metadata.creationTime || new Date().toISOString(),
          preferences: defaultPreferences
        };
        
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      clearError();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Extract user role from local storage
      const userRole = localStorage.getItem('user_role') as User['role'];
      
      // Default preferences
      const defaultPreferences: UserPreferences = {
        theme: 'light',
        language: 'fr',
        notifications_enabled: true,
        email_notifications: true
      };

      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'Utilisateur',
        role: userRole || 'b2c',
        created_at: firebaseUser.metadata.creationTime || new Date().toISOString(),
        preferences: defaultPreferences
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<User> => {
    try {
      clearError();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: name
      });
      
      // Default preferences
      const defaultPreferences: UserPreferences = {
        theme: 'light',
        language: 'fr',
        notifications_enabled: true,
        email_notifications: true
      };

      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: name,
        role: 'b2c', // Default role
        created_at: firebaseUser.metadata.creationTime || new Date().toISOString(),
        preferences: defaultPreferences
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      clearError();
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
      
      localStorage.removeItem('auth_session');
      localStorage.removeItem('user_role');
      localStorage.removeItem('userMode');
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      
      navigate('/');
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };
  
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (auth.currentUser) {
        if (userData.name) {
          await updateProfile(auth.currentUser, {
            displayName: userData.name,
            photoURL: userData.avatar_url || userData.avatarUrl || auth.currentUser.photoURL
          });
        }
        
        setUser(prevUser => {
          if (prevUser) {
            return {
              ...prevUser,
              ...userData
            };
          }
          return prevUser;
        });
        
        toast({
          title: "Profil mis à jour",
          description: "Votre profil a été mis à jour avec succès."
        });
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Erreur de mise à jour",
        description: "Il y a eu une erreur lors de la mise à jour de votre profil.",
        variant: "destructive"
      });
    }
  };

  const value: AuthContextProps = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
