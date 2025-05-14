
import React, { createContext, useContext, useState } from 'react';

type UserModeType = 'personal' | 'team' | 'b2c' | 'b2b_user' | 'b2b_admin';

interface UserModeContextType {
  mode: UserModeType;
  setMode: (mode: UserModeType) => void;
  isLoading: boolean;
  userMode: UserModeType; // Added for compatibility
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<UserModeType>('personal');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <UserModeContext.Provider value={{ 
      mode, 
      setMode, 
      isLoading,
      userMode: mode // Added for compatibility
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

export { UserModeProvider, useUserMode };
