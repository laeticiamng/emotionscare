/**
 * Hook pour gérer les paramètres utilisateur
 * Utilise le service user-preferences pour la persistance
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserPreferencesService } from '@/modules/user-preferences/userPreferencesService';
import type { UserSettings, PartialUserSettings } from '@/modules/user-preferences/types';
import { logger } from '@/lib/logger';

export function useUserSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les settings au montage
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    loadSettings();
  }, [user?.id]);

  const loadSettings = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const userSettings = await UserPreferencesService.getUserSettings(user.id);
      setSettings(userSettings);
    } catch (err) {
      logger.error('Failed to load user settings:', err as Error, 'HOOK');
      setError('Impossible de charger les paramètres');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: PartialUserSettings) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setSaving(true);
      setError(null);
      const updatedSettings = await UserPreferencesService.updateUserSettings(user.id, updates);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      logger.error('Failed to update user settings:', err as Error, 'HOOK');
      setError('Impossible de sauvegarder les paramètres');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = async () => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setSaving(true);
      setError(null);
      const defaultSettings = await UserPreferencesService.resetSettings(user.id);
      setSettings(defaultSettings);
      return defaultSettings;
    } catch (err) {
      logger.error('Failed to reset user settings:', err as Error, 'HOOK');
      setError('Impossible de réinitialiser les paramètres');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    error,
    updateSettings,
    resetSettings,
    reload: loadSettings,
  };
}
