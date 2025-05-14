
import React, { createContext, useContext, useState } from 'react';
import { UserRole, UserModeContextType } from '@/types/types';

const UserModeContext = createContext<UserModeContextType>({
  userMode: 'b2c',
  setUserMode: () => {},
  isLoading: false,
  mode: 'b2c',
  setMode: () => {},
});

const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserRole>('b2c');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <UserModeContext.Provider value={{ 
      userMode, 
      setUserMode, 
      isLoading,
      // For backward compatibility
      mode: userMode,
      setMode: setUserMode
    }}>
      {children}
    </UserModeContext.Provider>
  );
};

const useUserMode = (): UserModeContextType => {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};

export { UserModeProvider, useUserMode, UserModeContext };
