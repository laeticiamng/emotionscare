
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin';

interface UserModeContextType {
  userMode: UserModeType | null;
  setUserMode: (mode: UserModeType) => void;
  changeUserMode: (mode: UserModeType) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

interface UserModeProviderProps {
  children: ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  const [userMode, setUserModeState] = useState<UserModeType | null>('b2c');
  const [isLoading, setIsLoading] = useState(false);

  const setUserMode = (mode: UserModeType) => {
    setUserModeState(mode);
  };

  const changeUserMode = (mode: UserModeType) => {
    setIsLoading(true);
    try {
      setUserModeState(mode);
    } catch (error) {
      console.error('Error changing user mode:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: UserModeContextType = {
    userMode,
    setUserMode,
    changeUserMode,
    isLoading
  };

  return (
    <UserModeContext.Provider value={value}>
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
