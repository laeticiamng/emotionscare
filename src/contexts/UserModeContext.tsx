
import * as React from 'react';
import { UserModeType } from '@/utils/userModeHelpers';

interface UserModeContextType {
  userMode: UserModeType | null;
  setUserMode: (mode: UserModeType) => void;
  isLoading: boolean;
}

const UserModeContext = React.createContext<UserModeContextType | undefined>(undefined);

interface UserModeProviderProps {
  children: React.ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  const [userMode, setUserModeState] = React.useState<UserModeType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Récupérer le mode utilisateur depuis le localStorage
    const storedMode = localStorage.getItem('userMode') as UserModeType;
    if (storedMode) {
      setUserModeState(storedMode);
    }
    setIsLoading(false);
  }, []);

  const setUserMode = (mode: UserModeType) => {
    setUserModeState(mode);
    localStorage.setItem('userMode', mode);
  };

  return (
    <UserModeContext.Provider
      value={{
        userMode,
        setUserMode,
        isLoading
      }}
    >
      {children}
    </UserModeContext.Provider>
  );
};

export const useUserMode = () => {
  const context = React.useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};
