
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin';

interface UserModeContextType {
  userMode: UserMode | null;
  setUserMode: (mode: UserMode) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserModeState] = useState<UserMode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Get mode from user metadata or localStorage
      const userRole = user.user_metadata?.role || user.role;
      const savedMode = localStorage.getItem('user-mode') as UserMode;
      
      let mode: UserMode | null = null;
      
      if (userRole) {
        switch (userRole) {
          case 'b2c':
            mode = 'b2c';
            break;
          case 'b2b_user':
            mode = 'b2b_user';
            break;
          case 'b2b_admin':
            mode = 'b2b_admin';
            break;
          default:
            mode = savedMode || 'b2c';
        }
      } else if (savedMode) {
        mode = savedMode;
      }
      
      setUserModeState(mode);
    } else if (!isAuthenticated) {
      setUserModeState(null);
      localStorage.removeItem('user-mode');
    }
    
    setIsLoading(false);
  }, [user, isAuthenticated]);

  const setUserMode = (mode: UserMode) => {
    setUserModeState(mode);
    localStorage.setItem('user-mode', mode);
  };

  const value = {
    userMode,
    setUserMode,
    isLoading,
  };

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
};
