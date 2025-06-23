
import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserMode = 'b2c' | 'b2b-user' | 'b2b-admin' | 'guest';

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

interface UserModeProviderProps {
  children: ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>('guest');
  const [isLoading, setIsLoading] = useState(false);

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

export const useUserMode = (): UserModeContextType => {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};
