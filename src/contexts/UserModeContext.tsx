
import React, { createContext, useContext, useState } from 'react';
import { UserMode } from '@/types/types';

interface UserModeContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<UserMode>('personal');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <UserModeContext.Provider value={{ mode, setMode, isLoading }}>
      {children}
    </UserModeContext.Provider>
  );
};

const useUserMode = (): UserModeContextType => {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};

export { UserModeProvider, useUserMode };
