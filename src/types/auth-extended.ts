
import { UserPreferences as AuthUserPreferences } from './auth';
import { UserPreferences as AppUserPreferences } from './preferences';

/**
 * Adapter pour convertir entre les types de préférences utilisateur
 */
export function adaptAuthPreferences(authPrefs: AuthUserPreferences): AppUserPreferences {
  return {
    theme: authPrefs.theme || 'system',
    fontSize: authPrefs.fontSize,
    fontFamily: authPrefs.fontFamily,
    reduceMotion: authPrefs.reduceMotion,
    colorBlindMode: authPrefs.colorBlindMode,
    autoplayMedia: authPrefs.autoplayMedia,
    soundEnabled: authPrefs.soundEnabled,
    dashboardLayout: authPrefs.dashboardLayout,
    onboardingCompleted: authPrefs.onboardingCompleted,
    privacy: typeof authPrefs.privacy === 'string' ? 
      authPrefs.privacy : 
      {
        dataSharing: authPrefs.privacy?.shareData || false,
        analytics: false,
        thirdParty: false,
        shareData: authPrefs.privacy?.shareData || false,
        anonymizeReports: authPrefs.privacy?.anonymizeReports || false,
        profileVisibility: authPrefs.privacy?.profileVisibility || 'private'
      },
    notifications: authPrefs.notifications,
    language: authPrefs.language,
    emotionalCamouflage: authPrefs.emotionalCamouflage,
    aiSuggestions: authPrefs.aiSuggestions,
    // Ajout des champs potentiellement manquants
    shareData: authPrefs.shareData,
    dataSharing: authPrefs.shareData || false,
  };
}
