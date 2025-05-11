
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserMode = 'b2c' | 'b2b-collaborator' | 'b2b-admin';

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isB2C: boolean;
  isB2B: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: 'b2c',
  setUserMode: () => {},
  isB2C: true,
  isB2B: false,
  isAdmin: false,
  isLoading: true
});

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserModeState] = useState<UserMode>('b2c');
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialiser le mode utilisateur depuis localStorage
  useEffect(() => {
    const storedMode = localStorage.getItem('userMode') as UserMode | null;
    if (storedMode) {
      setUserModeState(storedMode);
    }
    setIsLoading(false);
  }, []);
  
  // Mettre à jour localStorage lorsque le mode change
  const setUserMode = (mode: UserMode) => {
    setUserModeState(mode);
    localStorage.setItem('userMode', mode);
  };
  
  // Valeurs dérivées
  const isB2C = userMode === 'b2c';
  const isB2B = userMode === 'b2b-collaborator' || userMode === 'b2b-admin';
  const isAdmin = userMode === 'b2b-admin';

  return (
    <UserModeContext.Provider value={{
      userMode,
      setUserMode,
      isB2C,
      isB2B,
      isAdmin,
      isLoading
    }}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);
