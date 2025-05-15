
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserModeType, UserModeContextType } from '@/types';

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const UserModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<UserModeType>('B2C');
  const navigate = useNavigate();

  const contextValue: UserModeContextType = {
    mode,
    setMode,
  };

  return (
    <UserModeContext.Provider value={contextValue}>
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }

  const { mode, setMode } = context;
  const navigate = useNavigate();

  const setAdminMode = () => {
    setMode('B2B-ADMIN');
    navigate('/admin/dashboard');
  };

  const setUserMode = () => {
    setMode('B2B-USER');
    navigate('/dashboard');
  };

  const setB2CMode = () => {
    setMode('B2C');
    navigate('/');
  };

  const isAdmin = () => mode === 'B2B-ADMIN' || mode === 'B2B-ADMIN';
  const isUser = () => mode === 'B2B-USER' || mode === 'B2B-USER';
  const isB2C = () => mode === 'B2C'; 

  return {
    mode,
    setMode,
    setAdminMode,
    setUserMode,
    setB2CMode,
    isAdmin,
    isUser,
    isB2C,
  };
};
