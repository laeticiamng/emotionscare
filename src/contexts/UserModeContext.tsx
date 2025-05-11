
import React, { createContext, useContext, useState } from 'react';

export type UserMode = 'personal' | 'professional' | 'anonymous' | 'b2b-collaborator' | 'b2b-admin' | 'b2c';

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isB2C: boolean;
  isB2B: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: 'personal',
  setUserMode: () => {},
  isB2C: true,
  isB2B: false,
  isAdmin: false,
  isLoading: false
});

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>('personal');
  const [isLoading, setIsLoading] = useState(false);
  
  // Derived values
  const isB2C = userMode === 'personal' || userMode === 'b2c';
  const isB2B = userMode === 'professional' || userMode === 'b2b-collaborator' || userMode === 'b2b-admin';
  const isAdmin = userMode === 'professional' || userMode === 'b2b-admin';

  return (
    <UserModeContext.Provider value={{
      userMode,
      setUserMode,
      isB2C,
      isB2B,
      isAdmin,
      isLoading
    }}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);
