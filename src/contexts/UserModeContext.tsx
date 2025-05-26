
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Ensure React is available
if (!React) {
  console.error('[UserModeContext] React not available at import time');
}

interface UserModeContextType {
  userMode: string | null;
  setUserMode: (mode: string) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const useUserMode = () => {
  if (!React || !React.useContext) {
    console.error('[useUserMode] React hooks not available');
    return {
      userMode: null,
      setUserMode: () => {},
      isLoading: false,
    };
  }

  const context = React.useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};

interface UserModeProviderProps {
  children: ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  if (!React || !React.useState) {
    console.error('[UserModeProvider] React hooks not available');
    return <>{children}</>;
  }

  const [userMode, setUserMode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const value = {
    userMode,
    setUserMode,
    isLoading,
  };

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
};
