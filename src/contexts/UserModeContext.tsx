
import { createContext, useContext, useState, ReactNode } from 'react';
import { UserModeType, UserModeContextType } from '@/types';

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const UserModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<UserModeType>('B2C');

  const handleSetMode = (newMode: UserModeType) => {
    // Normalize b2b_user to B2B-USER, etc. if needed
    let normalizedMode: UserModeType = newMode;
    
    // Handle different case variations for the user mode
    if (typeof newMode === 'string') {
      if (newMode.toLowerCase() === 'b2b_user' || newMode.toLowerCase() === 'b2b-user') {
        normalizedMode = 'B2B-USER';
      } else if (newMode.toLowerCase() === 'b2b_admin' || newMode.toLowerCase() === 'b2b-admin') {
        normalizedMode = 'B2B-ADMIN';
      } else if (newMode.toLowerCase() === 'b2c') {
        normalizedMode = 'B2C';
      }
    }
    
    setMode(normalizedMode);
  };

  return (
    <UserModeContext.Provider 
      value={{ 
        mode, 
        setMode: handleSetMode,
        userMode: mode,
        setUserMode: handleSetMode
      }}
    >
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error('useUserMode must be used within UserModeProvider');
  }
  return context;
};
