
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserMode = 'personal' | 'professional' | 'anonymous' | 'b2b-admin' | 'b2b-collaborator';

interface UserModeContextType {
  userMode: UserMode | null;
  setUserMode: (mode: UserMode) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: null,
  setUserMode: () => {},
  isLoading: true
});

interface UserModeProviderProps {
  children: ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  const [userMode, setUserModeState] = useState<UserMode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load user mode from localStorage
    const savedMode = localStorage.getItem('user-mode');
    if (savedMode && ['personal', 'professional', 'anonymous', 'b2b-admin', 'b2b-collaborator'].includes(savedMode)) {
      setUserModeState(savedMode as UserMode);
    }
    setIsLoading(false);
  }, []);

  const setUserMode = (mode: UserMode) => {
    setUserModeState(mode);
    // Save to localStorage for persistence
    localStorage.setItem('user-mode', mode);
  };

  return (
    <UserModeContext.Provider value={{ userMode, setUserMode, isLoading }}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);
