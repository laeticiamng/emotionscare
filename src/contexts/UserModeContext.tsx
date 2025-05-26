
import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '@/types/user';

interface UserModeContextType {
  currentMode: UserRole;
  userMode: UserRole; // Alias pour compatibilité
  setCurrentMode: (mode: UserRole) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<UserRole>('b2c');
  const [isLoading, setIsLoading] = useState(false);

  const value: UserModeContextType = {
    currentMode,
    userMode: currentMode, // Alias pour compatibilité
    setCurrentMode,
    isLoading
  };

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};
