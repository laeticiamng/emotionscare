
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { UserRole } from '@/types/user';
import { isB2BRole } from '@/utils/roleUtils';

type UserMode = 'b2c' | 'b2b' | 'admin';

interface UserModeContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  isB2B: boolean;
  isB2C: boolean;
  isAdmin: boolean;
}

// Create context with default values
const UserModeContext = createContext<UserModeContextType>({
  mode: 'b2c',
  setMode: () => {},
  isB2B: false,
  isB2C: true,
  isAdmin: false
});

export const UserModeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user } = useAuth();
  
  // Determine default mode based on user role
  const getDefaultMode = (): UserMode => {
    if (!user) return 'b2c';
    
    // Check user role
    const role = user.role as UserRole;
    
    if (role === 'admin') return 'admin';
    if (isB2BRole(role)) return 'b2b';
    
    return 'b2c';
  };
  
  const [mode, setModeState] = useState<UserMode>(getDefaultMode());
  
  // Computed properties
  const isB2B = mode === 'b2b';
  const isB2C = mode === 'b2c';
  const isAdmin = mode === 'admin';
  
  const setMode = (newMode: UserMode) => {
    setModeState(newMode);
    // You could add additional logic here (analytics, etc.)
  };
  
  return (
    <UserModeContext.Provider value={{ 
      mode, 
      setMode, 
      isB2B, 
      isB2C,
      isAdmin
    }}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);

export default UserModeContext;
