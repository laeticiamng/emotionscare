/**
 * UserModeContext avec mode par défaut pour debug
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | null;

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>('b2c'); // Par défaut b2c pour debug
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer le mode utilisateur depuis le localStorage
    const savedMode = localStorage.getItem('userMode') as UserMode;
    if (savedMode) {
      setUserMode(savedMode);
    } else {
      // Mode par défaut pour debug
      setUserMode('b2c');
      localStorage.setItem('userMode', 'b2c');
    }
    setIsLoading(false);
    console.log('🔧 Debug: Mode utilisateur défini à b2c par défaut');
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