
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserModeType = 'b2c' | 'b2b-user' | 'b2b-admin';

interface UserModeContextType {
  userMode: UserModeType | undefined;
  setUserMode: (mode: UserModeType) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserModeType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load user mode from localStorage if available
    const storedMode = localStorage.getItem('userMode');
    if (storedMode && ['b2c', 'b2b-user', 'b2b-admin'].includes(storedMode)) {
      setUserMode(storedMode as UserModeType);
    }
    setIsLoading(false);
  }, []);

  const handleSetUserMode = (mode: UserModeType) => {
    setUserMode(mode);
    localStorage.setItem('userMode', mode);
  };

  return (
    <UserModeContext.Provider
      value={{
        userMode,
        setUserMode: handleSetUserMode,
        isLoading
      }}
    >
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = (): UserModeContextType => {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};
