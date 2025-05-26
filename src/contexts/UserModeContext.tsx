
import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '@/types/user';

interface UserModeContextType {
  userMode: UserRole;
  setUserMode: (mode: UserRole) => void;
  changeUserMode: (mode: UserRole) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserRole>('b2c');
  const [isLoading, setIsLoading] = useState(false);

  const changeUserMode = (mode: UserRole) => {
    setIsLoading(true);
    setUserMode(mode);
    localStorage.setItem('userMode', mode);
    setTimeout(() => setIsLoading(false), 500);
  };

  const value: UserModeContextType = {
    userMode,
    setUserMode,
    changeUserMode,
    isLoading,
    setIsLoading
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
