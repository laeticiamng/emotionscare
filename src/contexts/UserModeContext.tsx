
import React, { createContext, useContext, useState } from 'react';

interface UserModeContextType {
  userMode: string;
  setUserMode: (mode: string) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState('b2c');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <UserModeContext.Provider value={{
      userMode,
      setUserMode,
      isLoading
    }}>
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
