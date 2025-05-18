
import React, { createContext, useState, useContext } from 'react';
import { UserPreferences, UserPreferencesContextType, DEFAULT_PREFERENCES, NotificationsPreferences, PrivacyPreferences } from '@/types/preferences';

// Création du contexte avec des valeurs par défaut
export const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: DEFAULT_PREFERENCES,
  theme: DEFAULT_PREFERENCES.theme || 'system',
  fontSize: DEFAULT_PREFERENCES.fontSize || 'medium',
  language: DEFAULT_PREFERENCES.language || 'fr',
  notifications: DEFAULT_PREFERENCES.notifications as NotificationsPreferences,
  privacy: DEFAULT_PREFERENCES.privacy || 'private',
  updatePreferences: async () => Promise.resolve(),
  resetPreferences: () => {},
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

  // Lecture des propriétés principales pour le contexte
  const theme = preferences.theme || 'system';
  const fontSize = preferences.fontSize || 'medium';
  const language = preferences.language || 'fr';
  
  // Normaliser les notifications
  const notifications: NotificationsPreferences = typeof preferences.notifications === 'boolean'
    ? { enabled: preferences.notifications, emailEnabled: false, pushEnabled: false }
    : preferences.notifications || { enabled: true, emailEnabled: true, pushEnabled: false };
  
  // Normaliser les préférences de confidentialité
  const privacy = preferences.privacy || 'private';

  // Fonction pour mettre à jour partiellement les préférences
  const updatePreferences = async (newPreferences: Partial<UserPreferences>): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      setPreferences(prev => {
        const updated = { ...prev, ...newPreferences };
        
        // Pour les objets imbriqués, faire un merge manuel
        if (newPreferences.privacy && typeof prev.privacy === 'object' && typeof newPreferences.privacy === 'object') {
          updated.privacy = { ...(prev.privacy as PrivacyPreferences), ...(newPreferences.privacy as PrivacyPreferences) };
        }
        
        if (newPreferences.notifications && typeof prev.notifications === 'object' && typeof newPreferences.notifications === 'object') {
          const updatedNotifications = { 
            ...prev.notifications as NotificationsPreferences,
            ...newPreferences.notifications as NotificationsPreferences
          };
          
          // Merge des types de notifications si présents
          if (
            prev.notifications && 
            'types' in prev.notifications &&
            newPreferences.notifications && 
            'types' in newPreferences.notifications
          ) {
            updatedNotifications.types = {
              ...(prev.notifications as NotificationsPreferences).types,
              ...(newPreferences.notifications as NotificationsPreferences).types
            };
          }
          
          updated.notifications = updatedNotifications;
        }
        
        return updated;
      });
      
      return Promise.resolve();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update preferences');
      setError(error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour réinitialiser les préférences
  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  const value: UserPreferencesContextType = {
    preferences,
    theme,
    fontSize,
    language,
    notifications,
    privacy,
    updatePreferences,
    resetPreferences,
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
