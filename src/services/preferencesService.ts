// @ts-nocheck

import { UserPreferences } from '@/types/preferences';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/** Catégorie de préférence */
export type PreferenceCategory =
  | 'appearance'
  | 'notifications'
  | 'privacy'
  | 'accessibility'
  | 'audio'
  | 'language'
  | 'modules'
  | 'coach'
  | 'data';

/** Préférences d'apparence */
export interface AppearancePreferences {
  theme: 'light' | 'dark' | 'system' | 'custom';
  customColors?: {
    primary: string;
    secondary: string;
    background: string;
  };
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  fontFamily: string;
  compactMode: boolean;
  animations: boolean;
  reducedMotion: boolean;
}

/** Préférences de notifications */
export interface NotificationPreferences {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  dailyReminder: boolean;
  dailyReminderTime: string;
  weeklyDigest: boolean;
  achievementAlerts: boolean;
  moodReminders: boolean;
  coachMessages: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

/** Préférences de confidentialité */
export interface PrivacyPreferences {
  shareActivityWithCocon: boolean;
  shareAchievements: boolean;
  allowAnalytics: boolean;
  allowPersonalization: boolean;
  publicProfile: boolean;
  showOnlineStatus: boolean;
  dataRetentionDays: number;
  allowDataExport: boolean;
}

/** Préférences d'accessibilité */
export interface AccessibilityPreferences {
  screenReader: boolean;
  highContrast: boolean;
  dyslexiaFont: boolean;
  largeClickTargets: boolean;
  keyboardNavigation: boolean;
  captionsEnabled: boolean;
  audioDescriptions: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

/** Préférences audio */
export interface AudioPreferences {
  masterVolume: number;
  musicVolume: number;
  voiceVolume: number;
  effectsVolume: number;
  backgroundMusicEnabled: boolean;
  autoPlayMusic: boolean;
  preferredGenres: string[];
  binauralBeatsEnabled: boolean;
}

/** Préférences de modules */
export interface ModulePreferences {
  favorites: string[];
  hidden: string[];
  defaultModule: string;
  autoStartBreathing: boolean;
  meditationDuration: number;
  journalPromptFrequency: 'daily' | 'weekly' | 'never';
}

/** Préférences complètes enrichies */
export interface EnrichedPreferences extends UserPreferences {
  appearance: AppearancePreferences;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  accessibility: AccessibilityPreferences;
  audio: AudioPreferences;
  modules: ModulePreferences;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  lastUpdated: string;
  version: number;
}

/** Historique de préférence */
export interface PreferenceHistory {
  id: string;
  userId: string;
  category: PreferenceCategory;
  key: string;
  oldValue: unknown;
  newValue: unknown;
  changedAt: Date;
}

/** Préférences par défaut */
const DEFAULT_PREFERENCES: EnrichedPreferences = {
  appearance: {
    theme: 'system',
    fontSize: 'medium',
    fontFamily: 'system-ui',
    compactMode: false,
    animations: true,
    reducedMotion: false
  },
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
    dailyReminder: true,
    dailyReminderTime: '09:00',
    weeklyDigest: true,
    achievementAlerts: true,
    moodReminders: true,
    coachMessages: true,
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    channels: {
      push: true,
      email: true,
      sms: false,
      inApp: true
    }
  },
  privacy: {
    shareActivityWithCocon: true,
    shareAchievements: true,
    allowAnalytics: true,
    allowPersonalization: true,
    publicProfile: false,
    showOnlineStatus: true,
    dataRetentionDays: 365,
    allowDataExport: true
  },
  accessibility: {
    screenReader: false,
    highContrast: false,
    dyslexiaFont: false,
    largeClickTargets: false,
    keyboardNavigation: true,
    captionsEnabled: false,
    audioDescriptions: false,
    colorBlindMode: 'none'
  },
  audio: {
    masterVolume: 80,
    musicVolume: 70,
    voiceVolume: 100,
    effectsVolume: 50,
    backgroundMusicEnabled: true,
    autoPlayMusic: false,
    preferredGenres: ['relaxation', 'ambient'],
    binauralBeatsEnabled: false
  },
  modules: {
    favorites: [],
    hidden: [],
    defaultModule: 'dashboard',
    autoStartBreathing: false,
    meditationDuration: 10,
    journalPromptFrequency: 'daily'
  },
  language: 'fr',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  lastUpdated: new Date().toISOString(),
  version: 1
} as EnrichedPreferences;

export class PreferencesService {
  private static cache: Map<string, { data: EnrichedPreferences; timestamp: number }> = new Map();
  private static cacheTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Sauvegarder les préférences utilisateur
   */
  static async savePreferences(userId: string, preferences: Partial<EnrichedPreferences>): Promise<void> {
    try {
      const current = await this.loadPreferences(userId);
      const updated = {
        ...current,
        ...preferences,
        lastUpdated: new Date().toISOString(),
        version: (current?.version || 0) + 1
      };

      const { error } = await supabase
        .from('profiles')
        .update({ preferences: updated })
        .eq('id', userId);

      if (error) throw error;

      // Mettre à jour le cache
      this.cache.set(userId, { data: updated as EnrichedPreferences, timestamp: Date.now() });

      logger.info('Preferences saved', { userId }, 'PREFERENCES');
    } catch (error) {
      logger.error('Error saving preferences', error as Error, 'PREFERENCES');
      throw error;
    }
  }

  /**
   * Charger les préférences utilisateur
   */
  static async loadPreferences(userId: string): Promise<EnrichedPreferences> {
    try {
      // Vérifier le cache
      const cached = this.cache.get(userId);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.data;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const prefs = {
        ...DEFAULT_PREFERENCES,
        ...(data?.preferences || {})
      } as EnrichedPreferences;

      // Mettre en cache
      this.cache.set(userId, { data: prefs, timestamp: Date.now() });

      return prefs;
    } catch (error) {
      logger.error('Error loading preferences', error as Error, 'PREFERENCES');
      return DEFAULT_PREFERENCES;
    }
  }

  /**
   * Mettre à jour une catégorie de préférences
   */
  static async updateCategory<K extends PreferenceCategory>(
    userId: string,
    category: K,
    updates: Partial<EnrichedPreferences[K]>
  ): Promise<void> {
    try {
      const current = await this.loadPreferences(userId);
      const currentCategory = current[category as keyof EnrichedPreferences] || {};

      const updated = {
        ...current,
        [category]: { ...currentCategory, ...updates },
        lastUpdated: new Date().toISOString()
      };

      await this.savePreferences(userId, updated);

      // Enregistrer l'historique
      await this.logPreferenceChange(userId, category, currentCategory, { ...currentCategory, ...updates });
    } catch (error) {
      logger.error('Error updating preference category', error as Error, 'PREFERENCES');
      throw error;
    }
  }

  /**
   * Mettre à jour une préférence individuelle
   */
  static async updatePreference(
    userId: string,
    key: string,
    value: unknown
  ): Promise<void> {
    try {
      const current = await this.loadPreferences(userId);
      const keys = key.split('.');

      let obj: any = current;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      const oldValue = obj[keys[keys.length - 1]];
      obj[keys[keys.length - 1]] = value;

      await this.savePreferences(userId, current);

      // Enregistrer l'historique
      await this.logPreferenceChange(userId, keys[0] as PreferenceCategory, { [key]: oldValue }, { [key]: value });
    } catch (error) {
      logger.error('Error updating single preference', error as Error, 'PREFERENCES');
      throw error;
    }
  }

  /**
   * Enregistrer l'historique des modifications
   */
  private static async logPreferenceChange(
    userId: string,
    category: PreferenceCategory,
    oldValue: unknown,
    newValue: unknown
  ): Promise<void> {
    try {
      await supabase.from('preference_history').insert({
        user_id: userId,
        category,
        old_value: oldValue,
        new_value: newValue
      });
    } catch (error) {
      // Silently fail - history is non-critical
    }
  }

  /**
   * Récupérer l'historique des modifications
   */
  static async getPreferenceHistory(
    userId: string,
    limit: number = 50
  ): Promise<PreferenceHistory[]> {
    try {
      const { data, error } = await supabase
        .from('preference_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(h => ({
        id: h.id,
        userId: h.user_id,
        category: h.category,
        key: h.key,
        oldValue: h.old_value,
        newValue: h.new_value,
        changedAt: new Date(h.created_at)
      }));
    } catch (error) {
      logger.error('Error fetching preference history', error as Error, 'PREFERENCES');
      return [];
    }
  }

  /**
   * Réinitialiser une catégorie aux valeurs par défaut
   */
  static async resetCategory(userId: string, category: PreferenceCategory): Promise<void> {
    try {
      const defaultValue = DEFAULT_PREFERENCES[category as keyof EnrichedPreferences];
      await this.updateCategory(userId, category, defaultValue as any);
      logger.info('Preference category reset', { userId, category }, 'PREFERENCES');
    } catch (error) {
      logger.error('Error resetting preference category', error as Error, 'PREFERENCES');
      throw error;
    }
  }

  /**
   * Réinitialiser toutes les préférences aux valeurs par défaut
   */
  static async resetAllPreferences(userId: string): Promise<void> {
    try {
      await this.savePreferences(userId, DEFAULT_PREFERENCES);
      logger.info('All preferences reset', { userId }, 'PREFERENCES');
    } catch (error) {
      logger.error('Error resetting all preferences', error as Error, 'PREFERENCES');
      throw error;
    }
  }

  /**
   * Exporter les préférences (conformité RGPD)
   */
  static async exportPreferences(userId: string): Promise<string> {
    const prefs = await this.loadPreferences(userId);
    return JSON.stringify(prefs, null, 2);
  }

  /**
   * Importer des préférences
   */
  static async importPreferences(userId: string, data: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(data);
      await this.savePreferences(userId, parsed);
      return true;
    } catch (error) {
      logger.error('Error importing preferences', error as Error, 'PREFERENCES');
      return false;
    }
  }

  /**
   * Supprimer toutes les préférences (conformité RGPD)
   */
  static async deleteAllPreferences(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ preferences: null })
        .eq('id', userId);

      if (error) throw error;

      // Supprimer l'historique
      await supabase
        .from('preference_history')
        .delete()
        .eq('user_id', userId);

      // Vider le cache
      this.cache.delete(userId);

      logger.info('All preferences deleted', { userId }, 'PREFERENCES');
    } catch (error) {
      logger.error('Error deleting preferences', error as Error, 'PREFERENCES');
      throw error;
    }
  }

  /**
   * Obtenir les préférences par défaut
   */
  static getDefaultPreferences(): EnrichedPreferences {
    return { ...DEFAULT_PREFERENCES };
  }

  /**
   * Vider le cache
   */
  static clearCache(userId?: string): void {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Synchroniser les préférences avec le localStorage
   */
  static async syncWithLocalStorage(userId: string): Promise<void> {
    try {
      if (typeof localStorage === 'undefined') return;

      const localPrefs = localStorage.getItem(`prefs_${userId}`);
      const serverPrefs = await this.loadPreferences(userId);

      if (localPrefs) {
        const parsed = JSON.parse(localPrefs);
        // Fusionner local avec serveur (serveur prioritaire)
        const merged = { ...parsed, ...serverPrefs };
        await this.savePreferences(userId, merged);
      }

      // Sauvegarder en local
      localStorage.setItem(`prefs_${userId}`, JSON.stringify(serverPrefs));
    } catch (error) {
      logger.error('Error syncing preferences', error as Error, 'PREFERENCES');
    }
  }

  /**
   * Vérifier si une préférence est définie
   */
  static async hasPreference(userId: string, key: string): Promise<boolean> {
    try {
      const prefs = await this.loadPreferences(userId);
      const keys = key.split('.');
      let obj: any = prefs;

      for (const k of keys) {
        if (obj && typeof obj === 'object' && k in obj) {
          obj = obj[k];
        } else {
          return false;
        }
      }

      return obj !== undefined && obj !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Migrer les anciennes préférences vers le nouveau format
   */
  static async migratePreferences(userId: string): Promise<boolean> {
    try {
      const current = await this.loadPreferences(userId);

      if (!current.version || current.version < DEFAULT_PREFERENCES.version) {
        const migrated = {
          ...DEFAULT_PREFERENCES,
          ...current,
          version: DEFAULT_PREFERENCES.version,
          lastUpdated: new Date().toISOString()
        };

        await this.savePreferences(userId, migrated);
        logger.info('Preferences migrated', { userId, fromVersion: current.version, toVersion: DEFAULT_PREFERENCES.version }, 'PREFERENCES');
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Error migrating preferences', error as Error, 'PREFERENCES');
      return false;
    }
  }
}
