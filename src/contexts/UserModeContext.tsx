
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserModeType, UserModeContextType } from '@/types/userMode';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Create a default context value
const defaultUserModeContext: UserModeContextType = {
  mode: 'b2c',
  setMode: () => {},
  userMode: 'b2c',
  setUserMode: () => {},
  isLoading: false
};

const UserModeContext = createContext<UserModeContextType>(defaultUserModeContext);

export const useUserMode = () => useContext(UserModeContext);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [storedMode, setStoredMode] = useLocalStorage<UserModeType>('userMode', 'b2c');
  
  // Use the stored mode from localStorage as the initial state
  const [mode, setMode] = useState<UserModeType>(storedMode);
  const [userMode, setUserModeState] = useState<UserModeType>(storedMode);
  
  // Function to update both state and localStorage
  const setUserMode = (newMode: UserModeType) => {
    setUserModeState(newMode);
    setStoredMode(newMode);
  };

  // Sync state with localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('userMode');
    if (savedMode && (savedMode === 'b2c' || savedMode === 'b2b')) {
      setMode(savedMode as UserModeType);
      setUserModeState(savedMode as UserModeType);
    }
  }, []);

  return (
    <UserModeContext.Provider value={{ 
      mode, 
      setMode, 
      userMode, 
      setUserMode,
      isLoading
    }}>
      {children}
    </UserModeContext.Provider>
  );
};

export default UserModeContext;
