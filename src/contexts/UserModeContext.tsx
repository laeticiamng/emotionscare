
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserMode = 'personal' | 'professional' | 'anonymous' | 'b2b-collaborator' | 'b2b-admin' | 'b2c';

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isB2C: boolean;
  isB2B: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: 'personal',
  setUserMode: () => {},
  isB2C: true,
  isB2B: false,
  isAdmin: false,
  isLoading: false
});

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Essayer d'obtenir le mode stocké de localStorage ou par défaut à 'personal'
  const getInitialMode = (): UserMode => {
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem('userMode');
      return (storedMode as UserMode) || 'personal';
    }
    return 'personal';
  };
  
  const [userMode, setUserModeState] = useState<UserMode>(getInitialMode);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialiser le mode utilisateur
  useEffect(() => {
    setUserModeState(getInitialMode());
    setIsLoading(false);
  }, []);
  
  // Stocker le mode dans localStorage quand il change
  const setUserMode = (mode: UserMode) => {
    console.log('Setting user mode to:', mode);
    setUserModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userMode', mode);
    }
  };
  
  // Journaliser les changements de userMode pour le débogage
  useEffect(() => {
    console.log('UserModeContext - current mode:', userMode);
  }, [userMode]);
  
  // Valeurs dérivées
  const isB2C = userMode === 'personal' || userMode === 'b2c';
  const isB2B = userMode === 'professional' || userMode === 'b2b-collaborator' || userMode === 'b2b-admin';
  const isAdmin = userMode === 'professional' || userMode === 'b2b-admin';

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
