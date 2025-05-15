
import { createContext, useContext, useState, ReactNode } from 'react';
import { UserModeType } from '@/types/userMode';

interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
  userMode?: UserModeType;
  setUserMode?: (mode: UserModeType) => void;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const UserModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<UserModeType>('b2c');

  const handleSetMode = (newMode: UserModeType) => {
    // Normalize b2b_user to B2B-USER, etc. if needed
    let normalizedMode: UserModeType = newMode;
    
    // Handle different case variations for the user mode
    if (typeof newMode === 'string') {
      if (newMode.toLowerCase() === 'b2b_user' || newMode.toLowerCase() === 'b2b-user') {
        normalizedMode = 'b2b-user';
      } else if (newMode.toLowerCase() === 'b2b_admin' || newMode.toLowerCase() === 'b2b-admin') {
        normalizedMode = 'b2b-admin';
      } else if (newMode.toLowerCase() === 'b2c') {
        normalizedMode = 'b2c';
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

export { UserModeContext };
