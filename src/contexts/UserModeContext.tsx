
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { UserModeContextType, UserModeType } from '@/types';

// Create context with default values
const UserModeContext = createContext<UserModeContextType>({
  userMode: 'b2c',
  setUserMode: () => {},
  isB2BAdmin: false,
  isB2BUser: false,
  isB2C: true
});

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userMode, setUserMode] = useState<UserModeType>('b2c');
  
  // Determine user mode based on user role
  useEffect(() => {
    if (!user) {
      setUserMode('b2c');
      return;
    }
    
    // Map user role to user mode
    if (user.role === 'admin' || user.role === 'b2b_admin' || user.role === 'b2b-admin') {
      setUserMode('b2b_admin');
    } else if (user.role === 'b2b_user' || user.role === 'b2b-user' || user.role === 'team' || user.role === 'employee') {
      setUserMode('b2b_user');
    } else {
      setUserMode('b2c');
    }
  }, [user]);
  
  // Derived values
  const isB2BAdmin = userMode === 'b2b_admin' || userMode === 'b2b-admin';
  const isB2BUser = userMode === 'b2b_user' || userMode === 'b2b-user';
  const isB2C = userMode === 'b2c' || userMode === 'personal';
  
  return (
    <UserModeContext.Provider value={{ 
      userMode, 
      setUserMode,
      isB2BAdmin,
      isB2BUser,
      isB2C
    }}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);

export default UserModeContext;
