
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | null;

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer le mode utilisateur depuis le localStorage
    const savedMode = localStorage.getItem('userMode') as UserMode;
    if (savedMode) {
      setUserMode(savedMode);
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
    <UserModeContext.Provider value={{
      userMode,
      setUserMode: handleSetUserMode,
      isLoading
    }}>
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
