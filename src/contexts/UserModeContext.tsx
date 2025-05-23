
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | null;

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, session } = useAuth();

  useEffect(() => {
    if (user) {
      const role = user.user_metadata?.role || 'b2c';
      setUserMode(role as UserMode);
    } else {
      setUserMode(null);
    }
    setIsLoading(false);
  }, [user, session]);

  const value = {
    userMode,
    setUserMode,
    isLoading
  };

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
};
