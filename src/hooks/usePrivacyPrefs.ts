/**
 * Hook de compatibilité pour les préférences de confidentialité
 * Redirige vers le nouveau module privacy
 */

import { usePrivacy } from '@/modules/privacy';

interface PrivacyPrefs {
  camera: boolean;
  heartRate: boolean;
  analytics: boolean;
  personalization: boolean;
}

export const usePrivacyPrefs = () => {
  const { preferences, isLoading, updatePreference, refresh } = usePrivacy();

  const prefs: PrivacyPrefs = {
    camera: preferences?.cam ?? false,
    heartRate: preferences?.hr ?? false,
    analytics: preferences?.analytics ?? true,
    personalization: preferences?.personalization ?? true,
  };

  const updatePrefs = async (newPrefs: Partial<PrivacyPrefs>) => {
    if (newPrefs.camera !== undefined) await updatePreference('cam', newPrefs.camera);
    if (newPrefs.heartRate !== undefined) await updatePreference('hr', newPrefs.heartRate);
    if (newPrefs.analytics !== undefined) await updatePreference('analytics', newPrefs.analytics);
    if (newPrefs.personalization !== undefined) await updatePreference('personalization', newPrefs.personalization);
  };

  const resetPrefs = () => {
    refresh();
  };

  return {
    prefs,
    updatePrefs,
    resetPrefs,
    isLoaded: !isLoading,
  };
};