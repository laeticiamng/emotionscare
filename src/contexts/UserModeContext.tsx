
import React, { createContext, useContext, useState } from 'react';

type UserMode = 'b2c' | 'b2b';

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>('b2c');

  const value = {
    userMode,
    setUserMode,
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
