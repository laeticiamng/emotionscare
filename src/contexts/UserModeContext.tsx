
import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserModeType, UserModeContextType } from '@/types/userMode';
import { toast } from 'sonner';

// Création du contexte avec une valeur par défaut
const UserModeContext = createContext<UserModeContextType>({
  userMode: null,
  setUserMode: () => {},
  isLoading: true,
  changeUserMode: () => {},
});

// Clé utilisée pour stocker le mode utilisateur dans localStorage
const USER_MODE_STORAGE_KEY = 'emotions-care-user-mode';

// Hook pour utiliser le contexte de mode utilisateur
export const useUserMode = () => useContext(UserModeContext);

// Fournisseur du contexte de mode utilisateur
export const UserModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserModeType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Charger le mode utilisateur depuis le stockage local lors du montage du composant
  useEffect(() => {
    const storedMode = localStorage.getItem(USER_MODE_STORAGE_KEY) as UserModeType | null;
    if (storedMode) {
      setUserMode(storedMode);
    }
    setIsLoading(false);
  }, []);
  
  // Enregistrer le mode utilisateur dans le stockage local lorsqu'il change
  useEffect(() => {
    if (userMode) {
      localStorage.setItem(USER_MODE_STORAGE_KEY, userMode);
    }
  }, [userMode]);
  
  // Fonction pour changer de mode utilisateur
  const changeUserMode = (newMode: UserModeType) => {
    setUserMode(newMode);
    toast.success(`Mode ${newMode === 'b2c' ? 'personnel' : newMode === 'b2b_user' ? 'collaborateur' : 'administrateur'} activé`);
  };
  
  const value = {
    userMode,
    setUserMode,
    isLoading,
    changeUserMode,
  };
  
  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
};

export default UserModeContext;
