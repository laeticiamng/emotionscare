// @ts-nocheck
import { useContext } from 'react';
import { UserPreferencesContext } from '@/contexts/UserPreferencesContext';
import { UserPreferencesContextType } from '@/types/preferences';

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  
  return context as UserPreferencesContextType;
};

export default useUserPreferences;
