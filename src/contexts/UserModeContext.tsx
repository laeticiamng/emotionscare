
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type UserModeType = 'b2c' | 'b2b-user' | 'b2b-admin' | 'personal' | 'b2b-collaborator';

// Export UserMode type for other components to use
export type UserMode = UserModeType;

interface UserModeContextType {
  userMode: UserModeType;
  setUserMode: (mode: UserModeType) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: 'b2c',
  setUserMode: () => {},
  isLoading: false
});

export const UserModeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserModeType>('b2c');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Set initial user mode based on user role
  useEffect(() => {
    setIsLoading(true);
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    switch(user.role) {
      case 'b2b_admin':
        setUserMode('b2b-admin');
        break;
      case 'b2b_user':
        setUserMode('b2b-user');
        break;
      default:
        setUserMode('b2c');
        break;
    }
    setIsLoading(false);
  }, [user]);

  // Save user mode preference
  useEffect(() => {
    localStorage.setItem('userMode', userMode);
  }, [userMode]);

  return (
    <UserModeContext.Provider value={{ userMode, setUserMode, isLoading }}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);
