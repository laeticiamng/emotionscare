
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | null;

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const UserModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved user mode
    const savedMode = localStorage.getItem('userMode') as UserMode | null;
    
    if (savedMode) {
      setUserMode(savedMode);
    } else {
      // Default to no mode
      setUserMode(null);
    }
    
    setIsLoading(false);
  }, []);

  const handleSetUserMode = (mode: UserMode) => {
    setUserMode(mode);
    if (mode) {
      localStorage.setItem('userMode', mode);
    } else {
      localStorage.removeItem('userMode');
    }
  };

  return (
    <UserModeContext.Provider
      value={{
        userMode,
        setUserMode: handleSetUserMode,
        isLoading
      }}
    >
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = (): UserModeContextType => {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};
