import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserModeType } from '@/types/types';

interface UserModeContextType {
  userMode: UserModeType;
  setUserMode: (mode: UserModeType) => void;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: 'b2c',
  setUserMode: () => {},
});

interface UserModeProviderProps {
  children: ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserModeType>('b2c');

  return (
    <UserModeContext.Provider value={{ userMode, setUserMode }}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);
export type { UserModeType };
export { UserModeProvider, useUserMode };
