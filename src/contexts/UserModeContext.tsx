
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserMode } from '@/types/auth';

interface UserModeContextType {
  userMode: UserMode | null;
  setUserMode: (mode: UserMode) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserModeState] = useState<UserMode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer le mode depuis localStorage au démarrage
    const savedMode = localStorage.getItem('userMode') as UserMode;
    if (savedMode) {
      setUserModeState(savedMode);
    }
    setIsLoading(false);
  }, []);

  const setUserMode = (mode: UserMode) => {
    setUserModeState(mode);
    localStorage.setItem('userMode', mode);
  };

  return (
    <UserModeContext.Provider value={{
      userMode,
      setUserMode,
      isLoading,
    }}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};
