
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | null;

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};

interface UserModeProviderProps {
  children: ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  console.log('[UserModeProvider] Initializing...');
  
  // Initialize with error handling
  const [userMode, setUserMode] = useState<UserMode>(() => {
    try {
      const stored = localStorage.getItem('userMode');
      console.log('[UserModeProvider] Stored mode:', stored);
      return stored as UserMode || null;
    } catch (error) {
      console.error('[UserModeProvider] Error reading from localStorage:', error);
      return null;
    }
  });

  // Update localStorage when userMode changes
  useEffect(() => {
    try {
      if (userMode) {
        localStorage.setItem('userMode', userMode);
        console.log('[UserModeProvider] Mode saved to localStorage:', userMode);
      } else {
        localStorage.removeItem('userMode');
        console.log('[UserModeProvider] Mode removed from localStorage');
      }
    } catch (error) {
      console.error('[UserModeProvider] Error writing to localStorage:', error);
    }
  }, [userMode]);

  const value: UserModeContextType = {
    userMode,
    setUserMode
  };

  console.log('[UserModeProvider] Rendering with mode:', userMode);

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
};
