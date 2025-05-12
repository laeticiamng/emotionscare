
import React, { createContext, useState, useContext, useEffect } from 'react';

export type UserMode = 'personal' | 'b2c' | 'b2b-collaborator' | 'b2b-admin';

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isLoading: boolean;
}

const UserModeContext = createContext<UserModeContextType>({
  userMode: 'b2c',
  setUserMode: () => {},
  isLoading: true
});

export const useUserMode = () => useContext(UserModeContext);

export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserModeState] = useState<UserMode>('b2c');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger le mode utilisateur depuis le localStorage
    const storedMode = localStorage.getItem('userMode');
    if (storedMode) {
      try {
        // Vérifier que la valeur est l'un des types UserMode valides
        const mode = storedMode as UserMode;
        if (mode === 'personal' || mode === 'b2c' || mode === 'b2b-collaborator' || mode === 'b2b-admin') {
          console.info('UserMode loaded from localStorage:', mode);
          setUserModeState(mode);
        }
      } catch (error) {
        console.error('Error parsing stored user mode:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const setUserMode = (mode: UserMode) => {
    localStorage.setItem('userMode', mode);
    setUserModeState(mode);
  };

  const value = {
    userMode,
    setUserMode,
    isLoading
  };

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
};
