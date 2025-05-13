
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type UserModeType = 'b2c' | 'b2b-user' | 'b2b-admin';

interface UserModeContextType {
  userMode: UserModeType;
  setUserMode: (mode: UserModeType) => void;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: 'b2c',
  setUserMode: () => {}
});

export const UserModeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserModeType>('b2c');
  const { user } = useAuth();

  // Set initial user mode based on user role
  useEffect(() => {
    if (!user) return;
    
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
  }, [user]);

  // Save user mode preference
  useEffect(() => {
    localStorage.setItem('userMode', userMode);
  }, [userMode]);

  return (
    <UserModeContext.Provider value={{ userMode, setUserMode }}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);
