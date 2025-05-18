
import React, { createContext, useState, useContext } from 'react';
import { UserPreferences, UserPreferencesContextType, DEFAULT_PREFERENCES } from '@/types/preferences';

// Création du contexte avec des valeurs par défaut
export const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: DEFAULT_PREFERENCES,
  updatePreferences: async () => Promise.resolve(),
  isLoading: false,
  error: null,
});

// Provider du contexte
export const UserPreferencesProvider: React.FC<{ children: React.ReactNode; initialPreferences?: UserPreferences }> = ({
  children,
  initialPreferences,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(
    initialPreferences || DEFAULT_PREFERENCES
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fonction pour mettre à jour partiellement les préférences
  const updatePreferences = async (newPreferences: Partial<UserPreferences>): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
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
                ...prev.notifications?.types,
                ...newPreferences.notifications.types,
              },
            }),
          },
        }),
      }));
      
      return Promise.resolve();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update preferences');
      setError(error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: UserPreferencesContextType = {
    preferences,
    updatePreferences,
    isLoading,
    error
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Hook pour utiliser facilement le contexte
export const useUserPreferences = () => useContext(UserPreferencesContext);

export default UserPreferencesContext;
