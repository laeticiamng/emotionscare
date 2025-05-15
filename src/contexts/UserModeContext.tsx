
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserModeType, UserModeContextType } from '@/types';

const UserModeContext = createContext<UserModeContextType>({
  userMode: 'b2c',
  setUserMode: () => {},
  isConsumerMode: true,
  isBusinessMode: false,
  isAdminMode: false,
  isCoachMode: false,
  switchToConsumer: () => {},
  switchToBusiness: () => {},
  switchToAdmin: () => {},
  switchToCoach: () => {},
});

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userMode, setUserMode] = useState<UserModeType>('b2c');

  // Determine initial user mode based on user role
  useEffect(() => {
    if (!user) return;
    
    if (['admin', 'b2b_admin', 'b2b-admin'].includes(user.role)) {
      setUserMode('b2b_admin');
    } else if (['b2b_user', 'b2b-user', 'business', 'manager'].includes(user.role)) {
      setUserMode('b2b_user');
    } else if (['coach'].includes(user.role)) {
      setUserMode('coach');
    } else {
      setUserMode('b2c');
    }
  }, [user]);

  const isConsumerMode = userMode === 'b2c';
  const isBusinessMode = userMode === 'b2b_user';
  const isAdminMode = userMode === 'b2b_admin';
  const isCoachMode = userMode === 'coach';

  const switchToConsumer = () => setUserMode('b2c');
  const switchToBusiness = () => setUserMode('b2b_user');
  const switchToAdmin = () => setUserMode('b2b_admin');
  const switchToCoach = () => setUserMode('coach');

  return (
    <UserModeContext.Provider
      value={{
        userMode,
        setUserMode,
        isConsumerMode,
        isBusinessMode,
        isAdminMode,
        isCoachMode,
        switchToConsumer,
        switchToBusiness,
        switchToAdmin,
        switchToCoach
      }}
    >
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => useContext(UserModeContext);
