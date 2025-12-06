/**
 * Hook React pour les préférences utilisateur
 */

import { useState, useCallback, useEffect } from 'react';
import { UserPreferencesService } from './userPreferencesService';
import type {
  UserProfile,
  UpdateUserProfile,
  UserSettings,
  PartialUserSettings,
  PrivacySettings,
  NotificationPreferences,
  Notification,
  UserPreferencesBundle
} from './types';

interface UseUserPreferencesOptions {
  userId: string;
  autoLoad?: boolean;
}

export const useUserPreferences = (options: UseUserPreferencesOptions) => {
  const { userId, autoLoad = true } = options;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [privacy, setPrivacy] = useState<PrivacySettings | null>(null);
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Charger toutes les préférences
   */
  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const bundle = await UserPreferencesService.getAllPreferences(userId);
      setProfile(bundle.profile);
      setSettings(bundle.settings);
      setPrivacy(bundle.privacy);
      setNotificationPreferences(bundle.notifications);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  /**
   * Charger le profil
   */
  const loadProfile = useCallback(async () => {
    try {
      const data = await UserPreferencesService.getUserProfile(userId);
      setProfile(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    }
  }, [userId]);

  /**
   * Mettre à jour le profil
   */
  const updateProfile = useCallback(
    async (updates: UpdateUserProfile) => {
      setIsLoading(true);
      setError(null);

      try {
        const updated = await UserPreferencesService.updateUserProfile(
          userId,
          updates
        );
        setProfile(updated);
        return updated;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  /**
   * Uploader un avatar
   */
  const uploadAvatar = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);

      try {
        const { url, error: uploadError } =
          await UserPreferencesService.uploadAvatar(userId, file);

        if (uploadError) {
          throw uploadError;
        }

        // Recharger le profil pour avoir l'URL à jour
        await loadProfile();
        return url;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [userId, loadProfile]
  );

  /**
   * Charger les paramètres
   */
  const loadSettings = useCallback(async () => {
    try {
      const data = await UserPreferencesService.getUserSettings(userId);
      setSettings(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    }
  }, [userId]);

  /**
   * Mettre à jour les paramètres
   */
  const updateSettings = useCallback(
    async (updates: PartialUserSettings) => {
      setIsLoading(true);
      setError(null);

      try {
        const updated = await UserPreferencesService.updateUserSettings(
          userId,
          updates
        );
        setSettings(updated);
        return updated;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  /**
   * Réinitialiser les paramètres
   */
  const resetSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const defaults = await UserPreferencesService.resetSettings(userId);
      setSettings(defaults);
      return defaults;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  /**
   * Charger les paramètres de confidentialité
   */
  const loadPrivacy = useCallback(async () => {
    try {
      const data = await UserPreferencesService.getPrivacySettings(userId);
      setPrivacy(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    }
  }, [userId]);

  /**
   * Mettre à jour les paramètres de confidentialité
   */
  const updatePrivacy = useCallback(
    async (updates: Partial<PrivacySettings>) => {
      setIsLoading(true);
      setError(null);

      try {
        const updated = await UserPreferencesService.updatePrivacySettings(
          userId,
          updates
        );
        setPrivacy(updated);
        return updated;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  /**
   * Charger les préférences de notification
   */
  const loadNotificationPreferences = useCallback(async () => {
    try {
      const data = await UserPreferencesService.getNotificationPreferences(userId);
      setNotificationPreferences(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    }
  }, [userId]);

  /**
   * Mettre à jour les préférences de notification
   */
  const updateNotificationPreferences = useCallback(
    async (updates: Partial<NotificationPreferences>) => {
      setIsLoading(true);
      setError(null);

      try {
        const updated =
          await UserPreferencesService.updateNotificationPreferences(
            userId,
            updates
          );
        setNotificationPreferences(updated);
        return updated;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      loadAll();
    }
  }, [autoLoad, loadAll]);

  return {
    // State
    profile,
    settings,
    privacy,
    notificationPreferences,
    isLoading,
    error,

    // Profile methods
    loadProfile,
    updateProfile,
    uploadAvatar,

    // Settings methods
    loadSettings,
    updateSettings,
    resetSettings,

    // Privacy methods
    loadPrivacy,
    updatePrivacy,

    // Notification preferences methods
    loadNotificationPreferences,
    updateNotificationPreferences,

    // Combined methods
    loadAll,
    refresh: loadAll
  };
};
