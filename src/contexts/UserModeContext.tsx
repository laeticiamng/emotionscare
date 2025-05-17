
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserModeType } from '@/types/userMode';
import { normalizeUserMode } from '@/utils/userModeHelpers';

interface UserModeContextValue {
  userMode: UserModeType;
  setUserMode: (mode: UserModeType | string) => void;
  clearUserMode: () => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextValue>({
  userMode: 'b2c',
  setUserMode: () => {},
  clearUserMode: () => {},
  isLoading: true
});

export const useUserMode = () => useContext(UserModeContext);

interface UserModeProviderProps {
  children: React.ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  const [userMode, setUserModeState] = useState<UserModeType>('b2c');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load user mode from localStorage on component mount
    const storedMode = localStorage.getItem('userMode');
    if (storedMode) {
      setUserModeState(normalizeUserMode(storedMode) as UserModeType);
    }
    setIsLoading(false);
  }, []);
  
  const setUserMode = (mode: UserModeType | string) => {
    const normalizedMode = normalizeUserMode(mode) as UserModeType;
    setUserModeState(normalizedMode);
    localStorage.setItem('userMode', normalizedMode);
  };
  
  const clearUserMode = () => {
    setUserModeState('b2c');
    localStorage.removeItem('userMode');
  };
  
  return (
    <UserModeContext.Provider value={{
      userMode,
      setUserMode,
      clearUserMode,
      isLoading
    }}>
      {children}
    </UserModeContext.Provider>
  );
};

export default UserModeProvider;
