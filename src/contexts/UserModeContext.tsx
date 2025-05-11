
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserMode = 'b2c' | 'b2b' | 'b2b-admin' | 'b2b-collaborator';

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isLoading?: boolean;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: 'b2c',
  setUserMode: () => {},
  isLoading: false
});

interface UserModeProviderProps {
  children: ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>('b2c');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <UserModeContext.Provider
      value={{
        userMode,
        setUserMode,
        isLoading
      }}
    >
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);
