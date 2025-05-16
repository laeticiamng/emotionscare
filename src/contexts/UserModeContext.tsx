
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | null;

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  clearUserMode: () => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: null,
  setUserMode: () => {},
  clearUserMode: () => {},
  isLoading: true
});

export const UserModeProvider = ({ children }: { children: ReactNode }) => {
  const [userMode, setUserModeState] = useState<UserMode>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Initialize from localStorage on mount
    try {
      const savedMode = localStorage.getItem('userMode') as UserMode | null;
      if (savedMode) {
        setUserModeState(savedMode);
      }
    } catch (error) {
      console.error("Error reading userMode from localStorage:", error);
    } finally {
      setIsLoading(false);
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
    <UserModeContext.Provider value={{ userMode, setUserMode, clearUserMode, isLoading }}>
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
