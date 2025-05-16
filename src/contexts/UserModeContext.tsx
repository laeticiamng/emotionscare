
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | 'unknown';

interface UserModeContextValue {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  clearUserMode: () => void;
}

const UserModeContext = createContext<UserModeContextValue>({
  userMode: 'unknown',
  setUserMode: () => {},
  clearUserMode: () => {}
});

export const useUserMode = () => useContext(UserModeContext);

interface UserModeProviderProps {
  children: React.ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  const [userMode, setUserModeState] = useState<UserMode>('unknown');
  
  useEffect(() => {
    // Load user mode from localStorage on component mount
    const storedMode = localStorage.getItem('userMode');
    if (storedMode === 'b2c' || storedMode === 'b2b_user' || storedMode === 'b2b_admin') {
      setUserModeState(storedMode);
    }
  }, []);
  
  const setUserMode = (mode: UserMode) => {
    setUserModeState(mode);
    if (mode !== 'unknown') {
      localStorage.setItem('userMode', mode);
    } else {
      localStorage.removeItem('userMode');
    }
  };
  
  const clearUserMode = () => {
    setUserModeState('unknown');
    localStorage.removeItem('userMode');
  };
  
  return (
    <UserModeContext.Provider value={{
      userMode,
      setUserMode,
      clearUserMode
    }}>
      {children}
    </UserModeContext.Provider>
  );
};

export default UserModeProvider;
