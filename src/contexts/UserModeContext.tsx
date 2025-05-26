
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserModeContextType {
  userMode: string | null;
  setUserMode: (mode: string) => void;
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

interface UserModeProviderProps {
  children: ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  const [userMode, setUserMode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const value = {
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
