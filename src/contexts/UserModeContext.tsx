
import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserMode } from '@/types/auth';
import { normalizeUserMode } from '@/utils/userModeHelpers';

interface UserModeContextType {
  userMode: UserMode | null;
  changeUserMode: (mode: UserMode) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: null,
  changeUserMode: () => {},
  isLoading: true,
});

export const useUserMode = () => useContext(UserModeContext);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user mode from local storage
    const savedMode = localStorage.getItem('userMode');
    if (savedMode) {
      setUserMode(normalizeUserMode(savedMode));
    }
    setIsLoading(false);
  }, []);

  const changeUserMode = (mode: UserMode) => {
    const normalizedMode = normalizeUserMode(mode);
    setUserMode(normalizedMode);
    // Save to local storage
    localStorage.setItem('userMode', normalizedMode);
  };

  return (
    <UserModeContext.Provider value={{ userMode, changeUserMode, isLoading }}>
      {children}
    </UserModeContext.Provider>
  );
};

export default UserModeProvider;
