/**
 * Module User Preferences - Service
 * Service unifié pour settings, profile, privacy et notifications
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type {
  UserProfile,
  UpdateUserProfile,
  UserSettings,
  PartialUserSettings,
  PrivacySettings,
  ConsentOptions,
  ConsentRecord,
  Notification,
  NotificationPreferences,
  CreateNotification,
  DataExportRequest,
  DataExportResult,
  AccountDeletionRequest,
  AccountDeletionResult,
  UserPreferencesBundle
} from './types';

const CONSENT_VERSION = '1.0.0';

// ============================================================================
// PROFILE MANAGEMENT
// ============================================================================

export class UserPreferencesService {
  /**
   * Récupérer le profil utilisateur
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        logger.error('[UserPreferencesService] Get profile error:', error, 'MODULE');
        throw new Error(`Failed to get user profile: ${error.message}`);
      }

      return data as UserProfile;
    } catch (error) {
      logger.error('[UserPreferencesService] Get profile failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  static async updateUserProfile(
    userId: string,
    updates: UpdateUserProfile
  ): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        logger.error('[UserPreferencesService] Update profile error:', error, 'MODULE');
        throw new Error(`Failed to update user profile: ${error.message}`);
      }

      return data as UserProfile;
    } catch (error) {
      logger.error('[UserPreferencesService] Update profile failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Uploader un avatar
   */
  static async uploadAvatar(
    userId: string,
    file: File
  ): Promise<{ url: string; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl }
      } = supabase.storage.from('user-uploads').getPublicUrl(filePath);

      // Update profile with new avatar URL
      await this.updateUserProfile(userId, { avatar_url: publicUrl });

      return { url: publicUrl, error: null };
    } catch (error) {
      logger.error('[UserPreferencesService] Upload avatar failed:', error, 'MODULE');
      return {
        url: '',
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }

  // ============================================================================
  // SETTINGS MANAGEMENT
  // ============================================================================

  /**
   * Récupérer les paramètres utilisateur
   */
  static async getUserSettings(userId: string): Promise<UserSettings> {
    try {
      const profile = await this.getUserProfile(userId);

      if (!profile || !profile.preferences) {
        // Retourner les paramètres par défaut
        return this.getDefaultSettings();
      }

      // Merger avec les defaults pour garantir que tous les champs existent
      return {
        ...this.getDefaultSettings(),
        ...(profile.preferences as Partial<UserSettings>)
      };
    } catch (error) {
      logger.error('[UserPreferencesService] Get settings failed:', error, 'MODULE');
      return this.getDefaultSettings();
    }
  }

  /**
   * Mettre à jour les paramètres utilisateur
   */
  static async updateUserSettings(
    userId: string,
    settings: PartialUserSettings
  ): Promise<UserSettings> {
    try {
      const currentSettings = await this.getUserSettings(userId);
      const newSettings = { ...currentSettings, ...settings };

      await this.updateUserProfile(userId, {
        preferences: newSettings as Record<string, unknown>
      });

      return newSettings;
    } catch (error) {
      logger.error('[UserPreferencesService] Update settings failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Réinitialiser les paramètres aux valeurs par défaut
   */
  static async resetSettings(userId: string): Promise<UserSettings> {
    const defaultSettings = this.getDefaultSettings();
    return this.updateUserSettings(userId, defaultSettings);
  }

  private static getDefaultSettings(): UserSettings {
    return {
      language: 'fr',
      timezone: 'Europe/Paris',
      theme: 'auto',
      color_scheme: 'default',
      font_size: 'medium',
      email_notifications: true,
      push_notifications: false,
      reminder_notifications: true,
      social_notifications: true,
      weekly_reports: true,
      achievement_notifications: true,
      profile_visibility: 'friends',
      data_sharing: false,
      analytics_tracking: true,
      emotion_data_retention_days: 365,
      high_contrast: false,
      reduce_animations: false,
      screen_reader_mode: false,
      daily_reminder_time: null,
      preferred_modules: [],
      auto_suggestions: true,
      emotion_tracking_frequency: 'medium'
    };
  }

  // ============================================================================
  // PRIVACY & CONSENT
  // ============================================================================

  /**
   * Récupérer les paramètres de confidentialité
   */
  static async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    const settings = await this.getUserSettings(userId);

    return {
      profile_visibility: settings.profile_visibility,
      show_activity_status: true,
      show_achievements: true,
      show_statistics: false,
      allow_friend_requests: true,
      data_retention_days: settings.emotion_data_retention_days,
      auto_delete_old_data: false
    };
  }

  /**
   * Mettre à jour les paramètres de confidentialité
   */
  static async updatePrivacySettings(
    userId: string,
    privacy: Partial<PrivacySettings>
  ): Promise<PrivacySettings> {
    const currentPrivacy = await this.getPrivacySettings(userId);
    const newPrivacy = { ...currentPrivacy, ...privacy };

    // Update relevant settings
    await this.updateUserSettings(userId, {
      profile_visibility: newPrivacy.profile_visibility,
      emotion_data_retention_days: newPrivacy.data_retention_days
    });

    return newPrivacy;
  }

  /**
   * Enregistrer le consentement utilisateur
   * Stocke dans la table consent_records + met à jour les préférences
   */
  static async recordConsent(
    userId: string,
    consents: ConsentOptions
  ): Promise<ConsentRecord> {
    const record: ConsentRecord = {
      user_id: userId,
      consents,
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString()
    };

    try {
      // Stocker dans la table dédiée consent_records
      const { error: insertError } = await supabase
        .from('consent_records')
        .insert({
          user_id: userId,
          consent_version: CONSENT_VERSION,
          audio_consent: consents.audio,
          video_consent: consents.video,
          emotion_analysis_consent: consents.emotionAnalysis,
          data_storage_consent: consents.dataStorage,
          data_sharing_consent: consents.dataSharing,
          analytics_consent: consents.analytics,
          marketing_consent: consents.marketing,
          ip_address: null, // Anonymized
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          created_at: record.timestamp
        });

      if (insertError) {
        // Si la table n'existe pas encore, log un warning mais continue
        logger.warn('[UserPreferencesService] consent_records insert failed:', insertError, 'MODULE');
      }

      // Mettre à jour les préférences utilisateur également
      await this.updateUserSettings(userId, {
        data_sharing: consents.dataSharing,
        analytics_tracking: consents.analytics
      });

      logger.info('[UserPreferencesService] Consent recorded', {
        userId,
        version: CONSENT_VERSION,
        consents: Object.entries(consents)
          .filter(([_, v]) => v)
          .map(([k]) => k)
      }, 'GDPR');

      return record;
    } catch (error) {
      logger.error('[UserPreferencesService] Record consent failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Récupérer l'historique des consentements
   */
  static async getConsentHistory(userId: string): Promise<ConsentRecord[]> {
    try {
      const { data, error } = await supabase
        .from('consent_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.warn('[UserPreferencesService] Get consent history failed:', error, 'MODULE');
        return [];
      }

      return (data || []).map((row) => ({
        user_id: row.user_id,
        consents: {
          audio: row.audio_consent,
          video: row.video_consent,
          emotionAnalysis: row.emotion_analysis_consent,
          dataStorage: row.data_storage_consent,
          dataSharing: row.data_sharing_consent,
          analytics: row.analytics_consent,
          marketing: row.marketing_consent
        },
        version: row.consent_version,
        timestamp: row.created_at
      }));
    } catch (error) {
      logger.error('[UserPreferencesService] Get consent history error:', error, 'MODULE');
      return [];
    }
  }

  /**
   * Révoquer un consentement spécifique
   */
  static async revokeConsent(
    userId: string,
    consentType: keyof ConsentOptions
  ): Promise<void> {
    try {
      // Récupérer les consentements actuels
      const history = await this.getConsentHistory(userId);
      const currentConsents = history[0]?.consents || {
        audio: false,
        video: false,
        emotionAnalysis: false,
        dataStorage: true,
        dataSharing: false,
        analytics: false,
        marketing: false
      };

      // Mettre à jour avec le consentement révoqué
      const updatedConsents = {
        ...currentConsents,
        [consentType]: false
      };

      await this.recordConsent(userId, updatedConsents);

      logger.info('[UserPreferencesService] Consent revoked', {
        userId,
        revokedConsent: consentType
      }, 'GDPR');
    } catch (error) {
      logger.error('[UserPreferencesService] Revoke consent failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Vérifier le consentement
   */
  static checkConsent(
    requiredConsents: (keyof ConsentOptions)[],
    userConsents: ConsentOptions
  ): boolean {
    return requiredConsents.every((consent) => userConsents[consent] === true);
  }

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================

  /**
   * Récupérer toutes les notifications d'un utilisateur
   */
  static async getUserNotifications(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
    }
  ): Promise<Notification[]> {
    const { limit = 50, offset = 0, unreadOnly = false } = options || {};

    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (unreadOnly) {
        query = query.eq('read', false);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('[UserPreferencesService] Get notifications error:', error, 'MODULE');
        throw new Error(`Failed to get notifications: ${error.message}`);
      }

      return (data as Notification[]) || [];
    } catch (error) {
      logger.error('[UserPreferencesService] Get notifications failed:', error, 'MODULE');
      return [];
    }
  }

  /**
   * Créer une notification
   */
  static async createNotification(
    notification: CreateNotification
  ): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          priority: notification.priority || 'medium',
          read: false,
          archived: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        logger.error('[UserPreferencesService] Create notification error:', error, 'MODULE');
        throw new Error(`Failed to create notification: ${error.message}`);
      }

      return data as Notification;
    } catch (error) {
      logger.error('[UserPreferencesService] Create notification failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Marquer une notification comme lue
   */
  static async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) {
        logger.error('[UserPreferencesService] Mark as read error:', error, 'MODULE');
        throw new Error(`Failed to mark notification as read: ${error.message}`);
      }
    } catch (error) {
      logger.error('[UserPreferencesService] Mark as read failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  static async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          read: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        logger.error('[UserPreferencesService] Mark all as read error:', error, 'MODULE');
        throw new Error(`Failed to mark all as read: ${error.message}`);
      }
    } catch (error) {
      logger.error('[UserPreferencesService] Mark all as read failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Supprimer une notification
   */
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        logger.error('[UserPreferencesService] Delete notification error:', error, 'MODULE');
        throw new Error(`Failed to delete notification: ${error.message}`);
      }
    } catch (error) {
      logger.error('[UserPreferencesService] Delete notification failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Archiver une notification
   */
  static async archiveNotification(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ archived: true })
        .eq('id', notificationId);

      if (error) {
        logger.error('[UserPreferencesService] Archive notification error:', error, 'MODULE');
        throw new Error(`Failed to archive notification: ${error.message}`);
      }
    } catch (error) {
      logger.error('[UserPreferencesService] Archive notification failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Compter les notifications non lues
   */
  static async getUnreadNotificationCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        logger.error('[UserPreferencesService] Count unread error:', error, 'MODULE');
        return 0;
      }

      return count || 0;
    } catch (error) {
      logger.error('[UserPreferencesService] Count unread failed:', error, 'MODULE');
      return 0;
    }
  }

  /**
   * Récupérer les préférences de notification
   */
  static async getNotificationPreferences(
    userId: string
  ): Promise<NotificationPreferences> {
    const settings = await this.getUserSettings(userId);

    return {
      email_notifications: settings.email_notifications,
      push_notifications: settings.push_notifications,
      sms_notifications: false,
      system_notifications: true,
      social_notifications: settings.social_notifications,
      achievement_notifications: settings.achievement_notifications,
      reminder_notifications: settings.reminder_notifications,
      therapeutic_notifications: true,
      community_notifications: true,
      update_notifications: true,
      quiet_hours_enabled: false,
      quiet_hours_start: null,
      quiet_hours_end: null,
      daily_digest: false,
      weekly_digest: settings.weekly_reports
    };
  }

  /**
   * Mettre à jour les préférences de notification
   */
  static async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const currentPrefs = await this.getNotificationPreferences(userId);
    const newPrefs = { ...currentPrefs, ...preferences };

    // Update relevant settings
    await this.updateUserSettings(userId, {
      email_notifications: newPrefs.email_notifications,
      push_notifications: newPrefs.push_notifications,
      social_notifications: newPrefs.social_notifications,
      achievement_notifications: newPrefs.achievement_notifications,
      reminder_notifications: newPrefs.reminder_notifications,
      weekly_reports: newPrefs.weekly_digest
    });

    return newPrefs;
  }

  // ============================================================================
  // DATA EXPORT & DELETION
  // ============================================================================

  /**
   * Demander un export de données (RGPD Article 20 - Portabilité)
   * Génère un package JSON contenant toutes les données de l'utilisateur
   */
  static async requestDataExport(
    request: DataExportRequest
  ): Promise<DataExportResult> {
    const exportId = crypto.randomUUID();

    try {
      // Créer l'entrée de demande d'export
      const { error: insertError } = await supabase
        .from('export_logs')
        .insert({
          id: exportId,
          user_id: request.user_id,
          export_type: request.format || 'json',
          status: 'processing',
          requested_at: new Date().toISOString(),
          include_sections: request.include_sections || ['all']
        });

      if (insertError) {
        logger.warn('[UserPreferencesService] Export log insert failed:', insertError, 'MODULE');
      }

      // Collecter toutes les données en parallèle
      const sectionsToInclude = request.include_sections || ['all'];
      const includeAll = sectionsToInclude.includes('all');

      const [
        profile,
        journalNotes,
        emotionScans,
        activitySessions,
        meditationSessions,
        breathingSessions,
        aiCoachSessions,
        achievements,
        notifications,
        consentHistory
      ] = await Promise.all([
        // Profile
        includeAll || sectionsToInclude.includes('profile')
          ? supabase.from('profiles').select('*').eq('id', request.user_id).single()
          : Promise.resolve({ data: null, error: null }),

        // Journal
        includeAll || sectionsToInclude.includes('journal')
          ? supabase.from('journal_notes').select('*').eq('user_id', request.user_id)
          : Promise.resolve({ data: [], error: null }),

        // Emotion scans
        includeAll || sectionsToInclude.includes('emotions')
          ? supabase.from('emotion_scans').select('*').eq('user_id', request.user_id)
          : Promise.resolve({ data: [], error: null }),

        // Activity sessions
        includeAll || sectionsToInclude.includes('activities')
          ? supabase.from('activity_sessions').select('*').eq('user_id', request.user_id)
          : Promise.resolve({ data: [], error: null }),

        // Meditation sessions
        includeAll || sectionsToInclude.includes('meditation')
          ? supabase.from('meditation_sessions').select('*').eq('user_id', request.user_id)
          : Promise.resolve({ data: [], error: null }),

        // Breathing sessions
        includeAll || sectionsToInclude.includes('breathing')
          ? supabase.from('breathing_sessions').select('*').eq('user_id', request.user_id)
          : Promise.resolve({ data: [], error: null }),

        // AI Coach sessions
        includeAll || sectionsToInclude.includes('coach')
          ? supabase.from('ai_coach_sessions').select('*').eq('user_id', request.user_id)
          : Promise.resolve({ data: [], error: null }),

        // Achievements
        includeAll || sectionsToInclude.includes('achievements')
          ? supabase.from('user_achievements').select('*').eq('user_id', request.user_id)
          : Promise.resolve({ data: [], error: null }),

        // Notifications
        includeAll || sectionsToInclude.includes('notifications')
          ? supabase.from('notifications').select('*').eq('user_id', request.user_id)
          : Promise.resolve({ data: [], error: null }),

        // Consent history
        includeAll || sectionsToInclude.includes('consents')
          ? this.getConsentHistory(request.user_id)
          : Promise.resolve([])
      ]);

      // Construire le package d'export
      const exportData = {
        export_info: {
          id: exportId,
          user_id: request.user_id,
          generated_at: new Date().toISOString(),
          format: request.format || 'json',
          gdpr_article: 'Article 20 - Droit à la portabilité',
          platform: 'EmotionsCare',
          version: '1.0'
        },
        profile: profile.data ? this.sanitizeProfileForExport(profile.data) : null,
        journal_entries: journalNotes.data || [],
        emotion_scans: (emotionScans.data || []).map(this.sanitizeScanForExport),
        activity_sessions: activitySessions.data || [],
        meditation_sessions: meditationSessions.data || [],
        breathing_sessions: breathingSessions.data || [],
        ai_coach_sessions: (aiCoachSessions.data || []).map(this.sanitizeCoachSessionForExport),
        achievements: achievements.data || [],
        notifications: notifications.data || [],
        consent_history: consentHistory,
        statistics: await this.generateExportStatistics(request.user_id)
      };

      // Générer le fichier selon le format demandé
      let exportUrl: string | undefined;
      let exportContent: string;

      if (request.format === 'csv') {
        exportContent = this.convertToCSV(exportData);
      } else {
        exportContent = JSON.stringify(exportData, null, 2);
      }

      // Stocker le fichier d'export dans Supabase Storage
      const fileName = `exports/${request.user_id}/${exportId}.${request.format || 'json'}`;
      const { error: uploadError } = await supabase.storage
        .from('user-exports')
        .upload(fileName, exportContent, {
          contentType: request.format === 'csv' ? 'text/csv' : 'application/json',
          upsert: true
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('user-exports')
          .getPublicUrl(fileName);
        exportUrl = urlData?.publicUrl;
      }

      // Mettre à jour le statut de l'export
      await supabase
        .from('export_logs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          file_url: exportUrl,
          file_size: exportContent.length
        })
        .eq('id', exportId);

      logger.info('[UserPreferencesService] Data export completed', {
        userId: request.user_id,
        exportId,
        sections: sectionsToInclude,
        size: exportContent.length
      }, 'GDPR');

      return {
        id: exportId,
        status: 'completed',
        download_url: exportUrl,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 jours
      };
    } catch (error) {
      logger.error('[UserPreferencesService] Data export failed:', error, 'MODULE');

      // Mettre à jour le statut en erreur
      await supabase
        .from('export_logs')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', exportId);

      return {
        id: exportId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Export failed'
      };
    }
  }

  /**
   * Sanitizer le profil pour l'export (supprimer données sensibles internes)
   */
  private static sanitizeProfileForExport(profile: Record<string, unknown>): Record<string, unknown> {
    const { id, ...rest } = profile;
    return {
      ...rest,
      user_id_hash: id ? `***${String(id).slice(-4)}` : undefined
    };
  }

  /**
   * Sanitizer un scan pour l'export
   */
  private static sanitizeScanForExport(scan: Record<string, unknown>): Record<string, unknown> {
    return {
      ...scan,
      // Supprimer les données brutes d'image/audio si présentes
      payload: scan.payload ? {
        ...(scan.payload as Record<string, unknown>),
        raw_image: undefined,
        raw_audio: undefined
      } : undefined
    };
  }

  /**
   * Sanitizer une session coach pour l'export
   */
  private static sanitizeCoachSessionForExport(session: Record<string, unknown>): Record<string, unknown> {
    return {
      ...session,
      // Garder seulement le résumé, pas les messages complets pour la vie privée
      messages_count: Array.isArray(session.messages) ? session.messages.length : 0,
      messages: undefined
    };
  }

  /**
   * Générer des statistiques pour l'export
   */
  private static async generateExportStatistics(userId: string): Promise<Record<string, unknown>> {
    const settings = await this.getUserSettings(userId);

    return {
      account_created: (settings as Record<string, unknown>).created_at || 'N/A',
      last_activity: new Date().toISOString(),
      data_retention_setting: `${settings.emotion_data_retention_days} jours`,
      analytics_enabled: settings.analytics_tracking,
      data_sharing_enabled: settings.data_sharing
    };
  }

  /**
   * Convertir les données en CSV
   */
  private static convertToCSV(data: Record<string, unknown>): string {
    const lines: string[] = [];

    // Header
    lines.push('section,key,value');

    // Flatten data recursively
    const flatten = (obj: unknown, prefix = ''): void => {
      if (obj === null || obj === undefined) return;

      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          flatten(item, `${prefix}[${index}]`);
        });
      } else if (typeof obj === 'object') {
        Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
          flatten(value, prefix ? `${prefix}.${key}` : key);
        });
      } else {
        const escapedValue = String(obj).replace(/"/g, '""');
        lines.push(`"${prefix}","${escapedValue}"`);
      }
    };

    flatten(data);
    return lines.join('\n');
  }

  /**
   * Demander la suppression du compte (RGPD Article 17 - Droit à l'effacement)
   * Utilise AccountDeletionService pour la gestion complète avec période de grâce
   */
  static async requestAccountDeletion(
    request: AccountDeletionRequest
  ): Promise<AccountDeletionResult> {
    try {
      // Importer dynamiquement pour éviter les dépendances circulaires
      const { AccountDeletionService } = await import('@/services/gdpr/AccountDeletionService');

      if (request.delete_immediately) {
        // Suppression immédiate (cas rare, nécessite confirmation spéciale)
        // D'abord supprimer toutes les données
        await Promise.all([
          supabase.from('journal_notes').delete().eq('user_id', request.user_id),
          supabase.from('emotion_scans').delete().eq('user_id', request.user_id),
          supabase.from('activity_sessions').delete().eq('user_id', request.user_id),
          supabase.from('meditation_sessions').delete().eq('user_id', request.user_id),
          supabase.from('breathing_sessions').delete().eq('user_id', request.user_id),
          supabase.from('ai_coach_sessions').delete().eq('user_id', request.user_id),
          supabase.from('notifications').delete().eq('user_id', request.user_id),
          supabase.from('user_achievements').delete().eq('user_id', request.user_id),
          supabase.from('export_logs').delete().eq('user_id', request.user_id),
          supabase.from('consent_records').delete().eq('user_id', request.user_id)
        ]);

        // Anonymiser le profil
        await supabase
          .from('profiles')
          .update({
            email: `deleted-${request.user_id}@anonymized.local`,
            name: 'Compte supprimé',
            avatar_url: null,
            preferences: null
          })
          .eq('id', request.user_id);

        logger.info('[UserPreferencesService] Immediate account deletion completed', {
          userId: request.user_id
        }, 'GDPR');

        return {
          success: true
        };
      } else {
        // Suppression avec période de grâce (comportement par défaut RGPD)
        const deletionRequest = await AccountDeletionService.requestDeletion(
          request.user_id,
          request.reason,
          30 // 30 jours de période de grâce
        );

        logger.info('[UserPreferencesService] Account deletion scheduled', {
          userId: request.user_id,
          scheduledDate: deletionRequest.scheduled_deletion_at
        }, 'GDPR');

        return {
          success: true,
          deletion_scheduled_for: deletionRequest.scheduled_deletion_at,
          grace_period_days: deletionRequest.grace_period_days,
          cancellation_url: '/app/settings/privacy?action=cancel-deletion'
        };
      }
    } catch (error) {
      logger.error('[UserPreferencesService] Account deletion failed:', error, 'MODULE');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Annuler une demande de suppression de compte
   */
  static async cancelAccountDeletion(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { AccountDeletionService } = await import('@/services/gdpr/AccountDeletionService');
      await AccountDeletionService.cancelDeletion(userId);

      return { success: true };
    } catch (error) {
      logger.error('[UserPreferencesService] Cancel deletion failed:', error, 'MODULE');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel deletion'
      };
    }
  }

  /**
   * Vérifier si une suppression est en cours
   */
  static async getPendingDeletion(userId: string): Promise<{
    pending: boolean;
    scheduled_date?: string;
    remaining_days?: number;
  }> {
    try {
      const { AccountDeletionService } = await import('@/services/gdpr/AccountDeletionService');
      const pendingRequest = await AccountDeletionService.getPendingDeletionRequest(userId);

      if (!pendingRequest) {
        return { pending: false };
      }

      return {
        pending: true,
        scheduled_date: pendingRequest.scheduled_deletion_at,
        remaining_days: AccountDeletionService.getRemainingDays(pendingRequest)
      };
    } catch (error) {
      logger.error('[UserPreferencesService] Get pending deletion failed:', error, 'MODULE');
      return { pending: false };
    }
  }

  // ============================================================================
  // BUNDLE OPERATIONS (All-in-one)
  // ============================================================================

  /**
   * Récupérer toutes les préférences utilisateur en une fois
   */
  static async getAllPreferences(userId: string): Promise<UserPreferencesBundle> {
    const [profile, settings, privacy, notifications, _] = await Promise.all([
      this.getUserProfile(userId),
      this.getUserSettings(userId),
      this.getPrivacySettings(userId),
      this.getNotificationPreferences(userId),
      Promise.resolve(null) // consents placeholder
    ]);

    const defaultConsents: ConsentOptions = {
      audio: false,
      video: false,
      emotionAnalysis: false,
      dataStorage: true,
      dataSharing: settings.data_sharing,
      analytics: settings.analytics_tracking,
      marketing: false
    };

    return {
      profile: profile!,
      settings,
      privacy,
      notifications,
      consents: defaultConsents
    };
  }
}

export const userPreferencesService = UserPreferencesService;
export default UserPreferencesService;
