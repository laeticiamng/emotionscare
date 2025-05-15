
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserModeType, normalizeUserMode } from '@/types/userMode';

interface UserModeContextProps {
  userMode: UserModeType;
  setUserMode: (mode: UserModeType | string) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextProps>({
  userMode: 'b2c',
  setUserMode: () => {},
  isLoading: true
});

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserModeState] = useState<UserModeType>('b2c');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user mode from localStorage
    const storedMode = localStorage.getItem('userMode');
    if (storedMode) {
      setUserModeState(normalizeUserMode(storedMode));
    }
    setIsLoading(false);
  }, []);

  const setUserMode = (mode: UserModeType | string) => {
    const normalizedMode = normalizeUserMode(mode);
    setUserModeState(normalizedMode);
    localStorage.setItem('userMode', normalizedMode);
  };

  return (
    <UserModeContext.Provider value={{ userMode, setUserMode, isLoading }}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);

export default UserModeContext;
