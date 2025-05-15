import { useContext } from 'react';
import { UserPreferencesContext } from '@/contexts/UserPreferencesContext';
import { Theme, FontFamily, FontSize } from '@/types';

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  
  // Get the current preferences
  const { preferences, setPreferences } = context;
  
  // Function to update specific preferences
  const updatePreferences = (newPrefs: Partial<{
    theme: Theme;
    font: FontFamily;
    fontSize: FontSize;
    animations: boolean;
    sounds: boolean;
    notifications: boolean;
    language: string;
    [key: string]: any;
  }>) => {
    setPreferences(prev => ({
      ...prev,
      ...newPrefs
    }));
    
    // Save to localStorage
    Object.entries(newPrefs).forEach(([key, value]) => {
      localStorage.setItem(`pref_${key}`, String(value));
    });
  };
  
  // Function to reset preferences to defaults
  const resetPreferences = () => {
    const defaultPrefs = {
      theme: 'light' as Theme,
      font: 'inter' as FontFamily,
      fontSize: 'medium' as FontSize,
      animations: true,
      sounds: true,
      notifications: true,
      language: 'fr'
    };
    
    setPreferences(defaultPrefs);
    
    // Clear localStorage preferences
    Object.keys(defaultPrefs).forEach(key => {
      localStorage.setItem(`pref_${key}`, String(defaultPrefs[key as keyof typeof defaultPrefs]));
    });
  };
  
  return {
    preferences,
    updatePreferences,
    resetPreferences
  };
}

export default useUserPreferences;
