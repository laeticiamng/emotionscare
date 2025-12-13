// @ts-nocheck
/**
 * useUserPreferences - Hook de gestion des préférences utilisateur
 * Accès et manipulation des préférences avec validation et persistence
 */

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UserPreferencesContext } from '@/contexts/UserPreferencesContext';
import { logger } from '@/lib/logger';

/** Catégories de préférences */
export type PreferenceCategory =
  | 'display'
  | 'notifications'
  | 'privacy'
  | 'accessibility'
  | 'audio'
  | 'coach'
  | 'social'
  | 'data'
  | 'language'
  | 'theme';

/** Thème de l'application */
export type AppTheme = 'light' | 'dark' | 'system' | 'auto';

/** Langue supportée */
export type SupportedLanguage = 'fr' | 'en' | 'es' | 'de' | 'it' | 'pt';

/** Fréquence de notification */
export type NotificationFrequency = 'off' | 'low' | 'medium' | 'high' | 'all';

/** Préférences d'affichage */
export interface DisplayPreferences {
  theme: AppTheme;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  colorScheme?: string;
  reducedMotion: boolean;
  highContrast: boolean;
  compactMode: boolean;
}

/** Préférences de notifications */
export interface NotificationPreferences {
  enabled: boolean;
  frequency: NotificationFrequency;
  sound: boolean;
  vibration: boolean;
  dailyReminder: boolean;
  dailyReminderTime?: string;
  coachMessages: boolean;
  achievements: boolean;
  socialUpdates: boolean;
  weeklyReport: boolean;
}

/** Préférences de confidentialité */
export interface PrivacyPreferences {
  analyticsEnabled: boolean;
  crashReportsEnabled: boolean;
  personalization: boolean;
  shareProgress: boolean;
  publicProfile: boolean;
  showOnlineStatus: boolean;
  allowFriendRequests: boolean;
}

/** Préférences d'accessibilité */
export interface AccessibilityPreferences {
  screenReader: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  voiceGuidance: boolean;
  hapticFeedback: boolean;
  autoPlayMedia: boolean;
  captions: boolean;
}

/** Préférences audio */
export interface AudioPreferences {
  musicEnabled: boolean;
  musicVolume: number;
  sfxEnabled: boolean;
  sfxVolume: number;
  voiceGuidance: boolean;
  voiceVolume: number;
  ambientSounds: boolean;
  ambientVolume: number;
}

/** Préférences du coach */
export interface CoachPreferences {
  personality: 'gentle' | 'motivating' | 'neutral';
  frequency: 'minimal' | 'moderate' | 'frequent';
  proactiveMessages: boolean;
  celebrateMilestones: boolean;
  reminderStyle: 'soft' | 'direct';
  focusAreas: string[];
}

/** Ensemble complet des préférences */
export interface UserPreferences {
  display: DisplayPreferences;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  accessibility: AccessibilityPreferences;
  audio: AudioPreferences;
  coach: CoachPreferences;
  language: SupportedLanguage;
  timezone?: string;
  dateFormat?: string;
  firstDayOfWeek?: 0 | 1; // 0 = Dimanche, 1 = Lundi
  updatedAt?: string;
  version?: number;
}

/** Options de mise à jour */
export interface UpdateOptions {
  persist?: boolean;
  sync?: boolean;
  validate?: boolean;
}

/** Résultat du hook */
export interface UseUserPreferencesResult {
  // Préférences complètes
  preferences: UserPreferences;
  isLoading: boolean;
  error: Error | null;

  // Accesseurs de catégories
  display: DisplayPreferences;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  accessibility: AccessibilityPreferences;
  audio: AudioPreferences;
  coach: CoachPreferences;
  language: SupportedLanguage;

  // Actions
  updatePreferences: (updates: Partial<UserPreferences>, options?: UpdateOptions) => Promise<void>;
  updateCategory: <K extends keyof UserPreferences>(
    category: K,
    updates: Partial<UserPreferences[K]>,
    options?: UpdateOptions
  ) => Promise<void>;
  resetCategory: (category: PreferenceCategory) => Promise<void>;
  resetAll: () => Promise<void>;
  exportPreferences: () => string;
  importPreferences: (data: string) => Promise<boolean>;

  // Utilitaires
  getPreference: <T>(path: string, defaultValue?: T) => T;
  setPreference: (path: string, value: unknown) => Promise<void>;
  hasPreference: (path: string) => boolean;
  isDirty: boolean;
  save: () => Promise<void>;
  revert: () => void;
}

/** Préférences par défaut */
export const DEFAULT_PREFERENCES: UserPreferences = {
  display: {
    theme: 'system',
    fontSize: 'medium',
    reducedMotion: false,
    highContrast: false,
    compactMode: false
  },
  notifications: {
    enabled: true,
    frequency: 'medium',
    sound: true,
    vibration: true,
    dailyReminder: true,
    dailyReminderTime: '09:00',
    coachMessages: true,
    achievements: true,
    socialUpdates: true,
    weeklyReport: true
  },
  privacy: {
    analyticsEnabled: true,
    crashReportsEnabled: true,
    personalization: true,
    shareProgress: false,
    publicProfile: false,
    showOnlineStatus: true,
    allowFriendRequests: true
  },
  accessibility: {
    screenReader: false,
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    voiceGuidance: false,
    hapticFeedback: true,
    autoPlayMedia: true,
    captions: false
  },
  audio: {
    musicEnabled: true,
    musicVolume: 0.7,
    sfxEnabled: true,
    sfxVolume: 0.5,
    voiceGuidance: true,
    voiceVolume: 0.8,
    ambientSounds: true,
    ambientVolume: 0.3
  },
  coach: {
    personality: 'gentle',
    frequency: 'moderate',
    proactiveMessages: true,
    celebrateMilestones: true,
    reminderStyle: 'soft',
    focusAreas: []
  },
  language: 'fr',
  firstDayOfWeek: 1,
  version: 1
};

/** Hook principal */
export const useUserPreferences = (): UseUserPreferencesResult => {
  const context = useContext(UserPreferencesContext);

  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }

  // État local pour tracking des modifications
  const [isDirty, setIsDirty] = useState(false);
  const [originalPreferences, setOriginalPreferences] = useState<UserPreferences | null>(null);

  // Extraire les préférences du contexte
  const preferences = useMemo(() => {
    return context.preferences || DEFAULT_PREFERENCES;
  }, [context.preferences]);

  // Accesseurs de catégories
  const display = useMemo(() => preferences.display, [preferences.display]);
  const notifications = useMemo(() => preferences.notifications, [preferences.notifications]);
  const privacy = useMemo(() => preferences.privacy, [preferences.privacy]);
  const accessibility = useMemo(() => preferences.accessibility, [preferences.accessibility]);
  const audio = useMemo(() => preferences.audio, [preferences.audio]);
  const coach = useMemo(() => preferences.coach, [preferences.coach]);
  const language = useMemo(() => preferences.language, [preferences.language]);

  // Mettre à jour les préférences
  const updatePreferences = useCallback(async (
    updates: Partial<UserPreferences>,
    options: UpdateOptions = { persist: true, validate: true }
  ): Promise<void> => {
    try {
      if (options.validate && !validatePreferences(updates)) {
        throw new Error('Invalid preferences');
      }

      const newPreferences = {
        ...preferences,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      if (context.setPreferences) {
        await context.setPreferences(newPreferences);
      }

      setIsDirty(true);

      logger.info('Preferences updated', { categories: Object.keys(updates) }, 'PREFERENCES');
    } catch (error) {
      logger.error('Failed to update preferences', { error }, 'PREFERENCES');
      throw error;
    }
  }, [preferences, context]);

  // Mettre à jour une catégorie spécifique
  const updateCategory = useCallback(async <K extends keyof UserPreferences>(
    category: K,
    updates: Partial<UserPreferences[K]>,
    options?: UpdateOptions
  ): Promise<void> => {
    const categoryUpdates = {
      [category]: {
        ...(preferences[category] as object),
        ...updates
      }
    } as Partial<UserPreferences>;

    await updatePreferences(categoryUpdates, options);
  }, [preferences, updatePreferences]);

  // Réinitialiser une catégorie
  const resetCategory = useCallback(async (category: PreferenceCategory): Promise<void> => {
    const defaultValue = DEFAULT_PREFERENCES[category as keyof UserPreferences];
    if (defaultValue !== undefined) {
      await updatePreferences({ [category]: defaultValue } as Partial<UserPreferences>);
    }
  }, [updatePreferences]);

  // Réinitialiser toutes les préférences
  const resetAll = useCallback(async (): Promise<void> => {
    await updatePreferences(DEFAULT_PREFERENCES);
    setIsDirty(false);
    setOriginalPreferences(null);
    logger.info('All preferences reset to defaults', {}, 'PREFERENCES');
  }, [updatePreferences]);

  // Obtenir une préférence par chemin (ex: "display.theme")
  const getPreference = useCallback(<T>(path: string, defaultValue?: T): T => {
    const keys = path.split('.');
    let value: unknown = preferences;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return defaultValue as T;
      }
    }

    return (value as T) ?? (defaultValue as T);
  }, [preferences]);

  // Définir une préférence par chemin
  const setPreference = useCallback(async (path: string, value: unknown): Promise<void> => {
    const keys = path.split('.');
    if (keys.length === 0) return;

    if (keys.length === 1) {
      await updatePreferences({ [keys[0]]: value } as Partial<UserPreferences>);
      return;
    }

    const category = keys[0] as keyof UserPreferences;
    const subKey = keys.slice(1).join('.');

    // Créer l'objet de mise à jour imbriqué
    const nestedUpdate: Record<string, unknown> = {};
    let current = nestedUpdate;

    for (let i = 1; i < keys.length - 1; i++) {
      current[keys[i]] = {};
      current = current[keys[i]] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;

    await updateCategory(category, nestedUpdate as Partial<UserPreferences[typeof category]>);
  }, [updatePreferences, updateCategory]);

  // Vérifier si une préférence existe
  const hasPreference = useCallback((path: string): boolean => {
    const value = getPreference(path, undefined);
    return value !== undefined;
  }, [getPreference]);

  // Exporter les préférences
  const exportPreferences = useCallback((): string => {
    return JSON.stringify(preferences, null, 2);
  }, [preferences]);

  // Importer les préférences
  const importPreferences = useCallback(async (data: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(data) as UserPreferences;

      if (!validatePreferences(parsed)) {
        throw new Error('Invalid preferences format');
      }

      await updatePreferences(parsed);
      return true;
    } catch (error) {
      logger.error('Failed to import preferences', { error }, 'PREFERENCES');
      return false;
    }
  }, [updatePreferences]);

  // Sauvegarder (trigger sync)
  const save = useCallback(async (): Promise<void> => {
    if (context.save) {
      await context.save();
    }
    setIsDirty(false);
    setOriginalPreferences(null);
  }, [context]);

  // Revenir aux préférences originales
  const revert = useCallback((): void => {
    if (originalPreferences && context.setPreferences) {
      context.setPreferences(originalPreferences);
      setIsDirty(false);
      setOriginalPreferences(null);
    }
  }, [originalPreferences, context]);

  // Stocker les préférences originales au premier changement
  useEffect(() => {
    if (isDirty && !originalPreferences) {
      setOriginalPreferences(preferences);
    }
  }, [isDirty, originalPreferences, preferences]);

  return {
    preferences,
    isLoading: context.isLoading ?? false,
    error: context.error ?? null,

    display,
    notifications,
    privacy,
    accessibility,
    audio,
    coach,
    language,

    updatePreferences,
    updateCategory,
    resetCategory,
    resetAll,
    exportPreferences,
    importPreferences,

    getPreference,
    setPreference,
    hasPreference,
    isDirty,
    save,
    revert
  };
};

/** Valider les préférences */
function validatePreferences(prefs: Partial<UserPreferences>): boolean {
  // Validation basique
  if (typeof prefs !== 'object' || prefs === null) {
    return false;
  }

  // Valider le thème
  if (prefs.display?.theme) {
    const validThemes: AppTheme[] = ['light', 'dark', 'system', 'auto'];
    if (!validThemes.includes(prefs.display.theme)) {
      return false;
    }
  }

  // Valider la langue
  if (prefs.language) {
    const validLanguages: SupportedLanguage[] = ['fr', 'en', 'es', 'de', 'it', 'pt'];
    if (!validLanguages.includes(prefs.language)) {
      return false;
    }
  }

  // Valider les volumes (0-1)
  if (prefs.audio) {
    const volumeKeys = ['musicVolume', 'sfxVolume', 'voiceVolume', 'ambientVolume'] as const;
    for (const key of volumeKeys) {
      const value = prefs.audio[key];
      if (value !== undefined && (value < 0 || value > 1)) {
        return false;
      }
    }
  }

  return true;
}

/** Hook pour une préférence spécifique */
export function usePreference<T>(path: string, defaultValue?: T): [T, (value: T) => Promise<void>] {
  const { getPreference, setPreference } = useUserPreferences();

  const value = getPreference<T>(path, defaultValue);
  const setValue = useCallback(async (newValue: T) => {
    await setPreference(path, newValue);
  }, [path, setPreference]);

  return [value, setValue];
}

/** Hook pour le thème */
export function useThemePreference(): [AppTheme, (theme: AppTheme) => Promise<void>] {
  return usePreference<AppTheme>('display.theme', 'system');
}

/** Hook pour la langue */
export function useLanguagePreference(): [SupportedLanguage, (lang: SupportedLanguage) => Promise<void>] {
  return usePreference<SupportedLanguage>('language', 'fr');
}

/** Hook pour les notifications */
export function useNotificationPreferences(): NotificationPreferences {
  const { notifications } = useUserPreferences();
  return notifications;
}

/** Hook pour l'accessibilité */
export function useAccessibilityPreferences(): AccessibilityPreferences {
  const { accessibility } = useUserPreferences();
  return accessibility;
}

export default useUserPreferences;
