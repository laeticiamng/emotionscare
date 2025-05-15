
import React, { createContext, useContext, useState } from 'react';
import { UserModeType, UserModeContextType } from '@/types/userMode';

// Create a default context value
const defaultUserModeContext: UserModeContextType = {
  mode: 'b2c',
  setMode: () => {},
  userMode: 'b2c',
  setUserMode: () => {},
  isLoading: false
};

const UserModeContext = createContext<UserModeContextType>(defaultUserModeContext);

export const useUserMode = () => useContext(UserModeContext);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<UserModeType>('b2c');
  const [userMode, setUserMode] = useState<UserModeType>('b2c');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <UserModeContext.Provider value={{ 
      mode, 
      setMode, 
      userMode, 
      setUserMode,
      isLoading
    }}>
      {children}
    </UserModeContext.Provider>
  );
};

export default UserModeContext;
