
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserPreferences, 
  UserPreferencesContextType, 
  DEFAULT_PREFERENCES, 
  NotificationsPreferences
} from '@/types/preferences';

// Create the context
const PreferencesContext = createContext<UserPreferencesContextType>({
  preferences: DEFAULT_PREFERENCES,
  theme: DEFAULT_PREFERENCES.theme || 'system',
  fontSize: DEFAULT_PREFERENCES.fontSize || 'md',
  language: DEFAULT_PREFERENCES.language || 'fr',
  notifications: DEFAULT_PREFERENCES.notifications as NotificationsPreferences,
  privacy: DEFAULT_PREFERENCES.privacy || 'private',
  updatePreferences: async () => {},
  resetPreferences: () => {},
  isLoading: false,
  error: null,
});

// Provider component
export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Detect browser language on mount and store it if not already set
  useEffect(() => {
    const browserLang = navigator.language || navigator.languages?.[0];
    if (browserLang && !preferences.language) {
      setPreferences((prev) => ({ ...prev, language: browserLang }));
    }
  }, []);

  // Extract main properties for context
  const theme = preferences.theme || 'system';
  const fontSize = preferences.fontSize || 'md';
  const language = preferences.language || 'fr';
  
  // Normalize notifications with type safety
  let notifications: NotificationsPreferences;
  
  if (typeof preferences.notifications === 'boolean') {
    notifications = { 
      enabled: preferences.notifications, 
      emailEnabled: false, 
      pushEnabled: false,
      types: {
        news: true,
        updates: true,
        reminders: true,
        alerts: true,
        emotions: true,
        insights: true
      },
      frequency: 'daily',
      quietHours: {
        enabled: false,
        from: '22:00',
        to: '08:00'
      },
      tone: 'friendly'
    };
  } else {
    notifications = preferences.notifications as NotificationsPreferences || {
      enabled: true,
      emailEnabled: true,
      pushEnabled: false,
      types: {
        news: true,
        updates: true,
        reminders: true,
        alerts: true,
        emotions: true,
        insights: true
      },
      frequency: 'daily',
      quietHours: {
        enabled: false,
        from: '22:00',
        to: '08:00'
      },
      tone: 'friendly'
    };
  }
  
  // Normalize privacy preferences
  const privacy = preferences.privacy || 'private';

  // Function to update preferences
  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Implement the actual update logic here (e.g., API call to update user preferences)
      // For now, we'll just update the local state
      setPreferences({ ...preferences, ...newPreferences });
      return Promise.resolve();
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error('Failed to update preferences'));
      return Promise.reject(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset preferences
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
    error,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

// Hook to use the preferences context
export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export default PreferencesContext;
