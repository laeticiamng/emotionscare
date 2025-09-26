'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | null;

type UserModeContextValue = {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isLoading: boolean;
};

const UserModeContext = createContext<UserModeContextValue | null>(null);

export const UserModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [userMode, setUserModeState] = useState<UserMode>('b2c'); // Par défaut B2C
  const [isLoading, setIsLoading] = useState(false); // Pas de chargement par défaut

  const setUserMode = useCallback((mode: UserMode) => {
    console.log('🎭 Setting user mode to:', mode);
    setUserModeState(mode);
  }, []);

  const value = useMemo<UserModeContextValue>(() => ({
    userMode,
    setUserMode,
    isLoading,
  }), [userMode, setUserMode, isLoading]);

  return <UserModeContext.Provider value={value}>{children}</UserModeContext.Provider>;
};

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error('useUserMode must be used within UserModeProvider');
  }
  return context;
};

export { UserModeContext };