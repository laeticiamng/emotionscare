
import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserMode = 'b2c' | 'b2b' | 'b2b-admin';

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: 'b2c',
  setUserMode: () => {}
});

interface UserModeProviderProps {
  children: ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>('b2c');

  return (
    <UserModeContext.Provider
      value={{
        userMode,
        setUserMode
      }}
    >
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);
