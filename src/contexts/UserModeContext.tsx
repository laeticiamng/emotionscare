
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserModeType, UserModeContextType } from '@/types/userMode';

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserModeType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user mode from localStorage on initialization
    const savedMode = localStorage.getItem('user-mode') as UserModeType | null;
    if (savedMode && ['b2c', 'b2b_user', 'b2b_admin'].includes(savedMode)) {
      setUserMode(savedMode);
    }
    setIsLoading(false);
  }, []);

  const changeUserMode = (mode: UserModeType) => {
    setUserMode(mode);
    localStorage.setItem('user-mode', mode);
  };

  const clearUserMode = () => {
    setUserMode(null);
    localStorage.removeItem('user-mode');
  };

  const value = {
    userMode,
    setUserMode: changeUserMode,
    isLoading,
    changeUserMode,
    clearUserMode
  };

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
};
