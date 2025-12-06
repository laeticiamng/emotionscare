/**
 * Hook pour gérer les préférences musicales utilisateur
 */

import { useState, useEffect } from 'react';
import { getUserPreferences, hasUserPreferences, type UserMusicPreferences } from '@/services/music/preferences-service';
import { logger } from '@/lib/logger';

export const useUserMusicPreferences = () => {
  const [preferences, setPreferences] = useState<UserMusicPreferences | null>(null);
  const [hasPreferences, setHasPreferences] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [prefs, hasPref] = await Promise.all([
        getUserPreferences(),
        hasUserPreferences(),
      ]);

      setPreferences(prefs);
      setHasPreferences(hasPref);
    } catch (err) {
      logger.error('Failed to load preferences', err as Error, 'MUSIC');
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPreferences = async () => {
    await loadPreferences();
  };

  return {
    preferences,
    hasPreferences,
    isLoading,
    error,
    refreshPreferences,
  };
};
