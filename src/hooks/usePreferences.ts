// @ts-nocheck
/**
 * usePreferences - Hook de gestion des préférences utilisateur
 * Synchronise avec Supabase + localStorage comme fallback
 */

import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { UserPreferences, DEFAULT_PREFERENCES } from '@/types/preferences';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

const PREFERENCES_KEY = 'user-preferences';

export const usePreferences = (initialPreferences?: Partial<UserPreferences>) => {
  const { user } = useAuth();
  const mergedDefaults = { ...DEFAULT_PREFERENCES, ...initialPreferences };
  
  // Utiliser localStorage pour persister les préférences
  const [storedPreferences, setStoredPreferences] = useLocalStorage<UserPreferences>(PREFERENCES_KEY, mergedDefaults);
  
  // État local pour les préférences (facilite les mises à jour)
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(storedPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  
  // Charger les préférences depuis Supabase
  const loadFromSupabase = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Fusionner avec les préférences locales
        const supabasePrefs: Partial<UserPreferences> = {
          theme: data.theme as UserPreferences['theme'],
          language: data.language,
          notifications: data.notifications_enabled,
          soundEnabled: data.sound_enabled,
          reducedMotion: data.reduced_motion,
          fontSize: data.font_size as UserPreferences['fontSize'],
          colorBlindMode: data.color_blind_mode as UserPreferences['colorBlindMode'],
        };

        const mergedPrefs = { ...localPrefs, ...supabasePrefs };
        setLocalPrefs(mergedPrefs);
        setStoredPreferences(mergedPrefs);
        setIsSynced(true);
        logger.debug('Preferences loaded from Supabase', {}, 'PREFERENCES');
      }
    } catch (err) {
      logger.error('Failed to load preferences from Supabase', err as Error, 'PREFERENCES');
    } finally {
      setIsLoading(false);
    }
  }, [user, localPrefs, setStoredPreferences]);

  // Sauvegarder vers Supabase
  const saveToSupabase = useCallback(async (prefs: UserPreferences) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          theme: prefs.theme,
          language: prefs.language,
          notifications_enabled: prefs.notifications,
          sound_enabled: prefs.soundEnabled,
          reduced_motion: prefs.reducedMotion,
          font_size: prefs.fontSize,
          color_blind_mode: prefs.colorBlindMode,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      setIsSynced(true);
      logger.debug('Preferences saved to Supabase', {}, 'PREFERENCES');
    } catch (err) {
      logger.error('Failed to save preferences to Supabase', err as Error, 'PREFERENCES');
    }
  }, [user]);

  // Synchroniser l'état local avec localStorage
  useEffect(() => {
    setLocalPrefs(storedPreferences);
  }, [storedPreferences]);
  
  // Charger depuis Supabase au montage si connecté
  useEffect(() => {
    if (user && !isSynced) {
      loadFromSupabase();
    }
  }, [user, isSynced, loadFromSupabase]);
  
  // Mettre à jour une ou plusieurs préférences
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    const updatedPrefs = { ...localPrefs, ...updates };
    setStoredPreferences(updatedPrefs);
    setLocalPrefs(updatedPrefs);
    
    // Sync to Supabase with debounce
    const timeoutId = setTimeout(() => {
      saveToSupabase(updatedPrefs);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localPrefs, setStoredPreferences, saveToSupabase]);
  
  // Réinitialiser les préférences aux valeurs par défaut
  const resetPreferences = useCallback(() => {
    setStoredPreferences(mergedDefaults);
    setLocalPrefs(mergedDefaults);
    saveToSupabase(mergedDefaults);
  }, [mergedDefaults, setStoredPreferences, saveToSupabase]);
  
  // Toggle pour les préférences booléennes
  const togglePreference = useCallback((key: keyof UserPreferences) => {
    if (typeof localPrefs[key] === 'boolean') {
      const updatedPrefs = {
        ...localPrefs,
        [key]: !localPrefs[key]
      };
      setStoredPreferences(updatedPrefs);
      setLocalPrefs(updatedPrefs);
      saveToSupabase(updatedPrefs);
    }
  }, [localPrefs, setStoredPreferences, saveToSupabase]);

  // Force sync with Supabase
  const syncWithSupabase = useCallback(async () => {
    await saveToSupabase(localPrefs);
  }, [localPrefs, saveToSupabase]);
  
  return {
    preferences: localPrefs,
    isLoading,
    isSynced,
    updatePreferences,
    resetPreferences,
    togglePreference,
    syncWithSupabase,
    refreshFromSupabase: loadFromSupabase
  };
};

export default usePreferences;
