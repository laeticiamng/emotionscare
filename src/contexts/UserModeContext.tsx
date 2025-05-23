
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin';

interface UserModeContextType {
  userMode: UserMode | null;
  setUserMode: (mode: UserMode) => void;
  changeUserMode: (mode: UserMode) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserModeState] = useState<UserMode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer le mode utilisateur depuis le localStorage
    const savedMode = localStorage.getItem('userMode') as UserMode;
    if (savedMode && ['b2c', 'b2b_user', 'b2b_admin'].includes(savedMode)) {
      setUserModeState(savedMode);
    }
    setIsLoading(false);
  }, []);

  const setUserMode = (mode: UserMode) => {
    setUserModeState(mode);
    localStorage.setItem('userMode', mode);
  };

  const changeUserMode = (mode: UserMode) => {
    setUserMode(mode);
    // Vous pouvez ajouter ici une logique de redirection si nécessaire
  };

  const value = {
    userMode,
    setUserMode,
    changeUserMode,
    isLoading,
  };

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
};
