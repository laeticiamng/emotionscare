
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences, DEFAULT_PREFERENCES } from '@/types/preferences';
import { useAuth } from './AuthContext';

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  loading: boolean;
  resetPreferences: () => void;
}

export const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: DEFAULT_PREFERENCES,
  updatePreferences: () => {},
  loading: false,
  resetPreferences: () => {},
});

export const useUserPreferences = () => useContext(UserPreferencesContext);

interface Props {
  children: ReactNode;
}

export const UserPreferencesProvider: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load preferences based on user
    if (user?.preferences) {
      // Merge user preferences with default ones (to handle missing properties)
      setPreferences({ ...DEFAULT_PREFERENCES, ...user.preferences });
    } else {
      setPreferences(DEFAULT_PREFERENCES);
    }
    setLoading(false);
  }, [user]);

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // In a real app, this would update preferences in the backend
      // For now, just update the state
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);
      
      // Here would be an API call to update user preferences
      console.log('Updating user preferences:', updatedPreferences);
      
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return (
    <UserPreferencesContext.Provider
      value={{ preferences, updatePreferences, loading, resetPreferences }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export default UserPreferencesProvider;
