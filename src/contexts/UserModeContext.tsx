import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAuth } from './AuthContext';

export type UserMode = 'b2b-collaborator' | 'b2b-admin' | 'b2c' | undefined;

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: undefined,
  setUserMode: () => {},
  isLoading: true
});

export const useUserMode = () => useContext(UserModeContext);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [storedUserMode, setStoredUserMode] = useLocalStorage<UserMode>('emotions-care-user-mode', undefined);
  
  // This effect syncs the user mode when the authentication state changes
  useEffect(() => {
    if (!user) {
      // When user logs out, we keep the mode in local storage but mark loading as false
      setIsLoading(false);
      return;
    }
    
    // If the user is logged in, we can assume we have a mode already set
    // or we need to redirect to onboarding
    if (storedUserMode) {
      setIsLoading(false);
    } else {
      // If there's no mode set but the user is authenticated, 
      // we still need to mark as not loading to allow redirect to onboarding
      setIsLoading(false);
    }
  }, [user, storedUserMode]);

  const setUserMode = (mode: UserMode) => {
    setStoredUserMode(mode);
  };

  return (
    <UserModeContext.Provider value={{ userMode: storedUserMode, setUserMode, isLoading }}>
      {children}
    </UserModeContext.Provider>
  );
};
