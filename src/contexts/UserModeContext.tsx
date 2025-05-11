
import React, { createContext, useContext, useState } from 'react';

export type UserMode = 'personal' | 'professional' | 'anonymous' | 'b2b-collaborator';

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isB2C: boolean;
  isB2B: boolean;
  isAdmin: boolean;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: 'personal',
  setUserMode: () => {},
  isB2C: true,
  isB2B: false,
  isAdmin: false
});

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>('personal');
  
  // Derived values
  const isB2C = userMode === 'personal';
  const isB2B = userMode === 'professional' || userMode === 'b2b-collaborator';
  const isAdmin = userMode === 'professional';

  return (
    <UserModeContext.Provider value={{
      userMode,
      setUserMode,
      isB2C,
      isB2B,
      isAdmin
    }}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);
