
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | null;

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: null,
  setUserMode: () => {},
  isLoading: true
});

export const useUserMode = () => useContext(UserModeContext);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load user mode from localStorage
    const storedMode = localStorage.getItem('user-mode') as UserMode;
    if (storedMode) {
      setUserMode(storedMode);
    }
    setIsLoading(false);
  }, []);
  
  const updateUserMode = (mode: UserMode) => {
    setUserMode(mode);
    if (mode) {
      localStorage.setItem('user-mode', mode);
    } else {
      localStorage.removeItem('user-mode');
    }
  };
  
  return (
    <UserModeContext.Provider value={{ userMode, setUserMode: updateUserMode, isLoading }}>
      {children}
    </UserModeContext.Provider>
  );
};
