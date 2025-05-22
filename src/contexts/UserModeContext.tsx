
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserModeType } from '@/types/userMode';

interface UserModeContextType {
  userMode: UserModeType | null;
  setUserMode: (mode: UserModeType | null) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: null,
  setUserMode: () => {},
  isLoading: true,
});

export const useUserMode = () => useContext(UserModeContext);

export const UserModeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserModeType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user mode preference
    const storedMode = localStorage.getItem('user_mode');
    
    if (storedMode) {
      try {
        setUserMode(storedMode as UserModeType);
      } catch (error) {
        console.error('Error parsing stored user mode:', error);
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleSetUserMode = (mode: UserModeType | null) => {
    if (mode) {
      localStorage.setItem('user_mode', mode);
      console.info('[Mode Selection] User selected mode:', mode);
    } else {
      localStorage.removeItem('user_mode');
    }
    
    setUserMode(mode);
  };

  return (
    <UserModeContext.Provider value={{
      userMode,
      setUserMode: handleSetUserMode,
      isLoading,
    }}>
      {children}
    </UserModeContext.Provider>
  );
};
