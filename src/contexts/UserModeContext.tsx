
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserModeType, UserModeContextType } from '@/types';
import useAuth from '@/hooks/useAuth';

const UserModeContext = createContext<UserModeContextType>({
  userMode: 'B2C',
  setUserMode: () => {}
});

export const UserModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get stored mode or default to B2C
  const storedMode = localStorage.getItem('userMode') as UserModeType || 'B2C';
  const [userMode, setUserMode] = useState<UserModeType>(storedMode);
  
  // Get user from auth context
  const { user } = useAuth();
  
  // Set user mode based on user role/preference
  React.useEffect(() => {
    if (user?.role === 'admin') {
      setUserMode('B2B-ADMIN');
    } else if (user?.role === 'user') {
      setUserMode('B2B_USER');
    } else if (user?.role === 'coach') {
      setUserMode('coach');
    }
  }, [user]);
  
  const changeUserMode = (mode: UserModeType) => {
    setUserMode(mode);
    localStorage.setItem('userMode', mode);
  };
  
  return (
    <UserModeContext.Provider value={{ userMode, setUserMode: changeUserMode }}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);
