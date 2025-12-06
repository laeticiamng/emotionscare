// @ts-nocheck

import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { UserPreferences, DEFAULT_PREFERENCES } from '@/types/preferences';

export const usePreferences = (initialPreferences?: Partial<UserPreferences>) => {
  const mergedDefaults = { ...DEFAULT_PREFERENCES, ...initialPreferences };
  
  // Utiliser localStorage pour persister les préférences
  const [preferences, setStoredPreferences] = useLocalStorage<UserPreferences>('user-preferences', mergedDefaults);
  
  // État local pour les préférences (facilite les mises à jour)
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(preferences);
  
  // Synchroniser l'état local avec localStorage
  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);
  
  // Mettre à jour une ou plusieurs préférences
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const updatedPrefs = { ...localPrefs, ...updates };
    setStoredPreferences(updatedPrefs);
    setLocalPrefs(updatedPrefs);
  };
  
  // Réinitialiser les préférences aux valeurs par défaut
  const resetPreferences = () => {
    setStoredPreferences(mergedDefaults);
    setLocalPrefs(mergedDefaults);
  };
  
  // Toggle pour les préférences booléennes
  const togglePreference = (key: keyof UserPreferences) => {
    if (typeof localPrefs[key] === 'boolean') {
      const updatedPrefs = {
        ...localPrefs,
        [key]: !localPrefs[key]
      };
      setStoredPreferences(updatedPrefs);
      setLocalPrefs(updatedPrefs);
    }
  };
  
  return {
    preferences: localPrefs,
    updatePreferences,
    resetPreferences,
    togglePreference
  };
};

export default usePreferences;
