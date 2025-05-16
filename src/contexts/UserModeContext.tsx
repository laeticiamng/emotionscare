
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | null;

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  clearUserMode: () => void;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: null,
  setUserMode: () => {},
  clearUserMode: () => {},
});

export const UserModeProvider = ({ children }: { children: ReactNode }) => {
  const [userMode, setUserModeState] = useState<UserMode>(null);
  
  useEffect(() => {
    // Initialize from localStorage on mount
    const savedMode = localStorage.getItem('userMode') as UserMode | null;
    if (savedMode) {
      setUserModeState(savedMode);
    }
  }, []);
  
  const setUserMode = (mode: UserMode) => {
    setUserModeState(mode);
    if (mode) {
      localStorage.setItem('userMode', mode);
    } else {
      localStorage.removeItem('userMode');
    }
  };
  
  const clearUserMode = () => {
    setUserModeState(null);
    localStorage.removeItem('userMode');
  };
  
  return (
    <UserModeContext.Provider value={{ userMode, setUserMode, clearUserMode }}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};

export default UserModeContext;
