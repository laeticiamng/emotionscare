
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin' | null;

interface UserModeContextType {
  userMode: UserModeType;
  setUserMode: (mode: UserModeType) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

interface UserModeProviderProps {
  children: ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  const [userMode, setUserModeState] = useState<UserModeType>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le mode utilisateur depuis le localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('userMode') as UserModeType;
    if (savedMode) {
      setUserModeState(savedMode);
    }
    setIsLoading(false);
  }, []);

  const setUserMode = (mode: UserModeType) => {
    setUserModeState(mode);
    if (mode) {
      localStorage.setItem('userMode', mode);
    } else {
      localStorage.removeItem('userMode');
    }
  };

  const value: UserModeContextType = {
    userMode,
    setUserMode,
    isLoading,
  };

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};

export { UserModeContext };
