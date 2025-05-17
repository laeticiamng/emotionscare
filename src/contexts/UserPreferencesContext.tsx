
import React, { createContext, useState, useContext } from 'react';
import { UserPreferences, UserPreferencesContextType, DEFAULT_PREFERENCES } from '@/types/preferences';

// Création du contexte avec des valeurs par défaut
export const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: DEFAULT_PREFERENCES,
  updatePreferences: () => {},
});

// Provider du contexte
export const UserPreferencesProvider: React.FC<{ children: React.ReactNode; initialPreferences?: UserPreferences }> = ({
  children,
  initialPreferences,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(
    initialPreferences || DEFAULT_PREFERENCES
  );

  // Fonction pour mettre à jour partiellement les préférences
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      ...newPreferences,
      // Pour les objets imbriqués, on fait un merge profond
      ...(newPreferences.privacy && {
        privacy: {
          ...prev.privacy,
          ...newPreferences.privacy,
        },
      }),
      ...(newPreferences.notifications && {
        notifications: {
          ...prev.notifications,
          ...newPreferences.notifications,
          // Merge des types de notifications si présents
          ...(newPreferences.notifications.types && {
            types: {
              ...prev.notifications.types,
              ...newPreferences.notifications.types,
            },
          }),
        },
      }),
    }));
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Hook pour utiliser facilement le contexte
export const useUserPreferences = () => useContext(UserPreferencesContext);

export default UserPreferencesContext;
