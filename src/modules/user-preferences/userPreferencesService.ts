/**
 * Module User Preferences - Service
 * Service unifié pour settings, profile, privacy et notifications
 */

import { supabase } from '@/integrations/supabase/client';
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
  NotificationCategory,
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
        console.error('[UserPreferencesService] Get profile error:', error);
        throw new Error(`Failed to get user profile: ${error.message}`);
      }

      return data as UserProfile;
    } catch (error) {
      console.error('[UserPreferencesService] Get profile failed:', error);
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
        console.error('[UserPreferencesService] Update profile error:', error);
        throw new Error(`Failed to update user profile: ${error.message}`);
      }

      return data as UserProfile;
    } catch (error) {
      console.error('[UserPreferencesService] Update profile failed:', error);
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
      console.error('[UserPreferencesService] Upload avatar failed:', error);
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
      console.error('[UserPreferencesService] Get settings failed:', error);
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
      console.error('[UserPreferencesService] Update settings failed:', error);
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

    // TODO: Stocker dans une table dédiée consent_records
    // Pour l'instant, on stocke dans les préférences
    await this.updateUserSettings(userId, {
      data_sharing: consents.dataSharing,
      analytics_tracking: consents.analytics
    });

    return record;
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
        console.error('[UserPreferencesService] Get notifications error:', error);
        throw new Error(`Failed to get notifications: ${error.message}`);
      }

      return (data as Notification[]) || [];
    } catch (error) {
      console.error('[UserPreferencesService] Get notifications failed:', error);
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
        console.error('[UserPreferencesService] Create notification error:', error);
        throw new Error(`Failed to create notification: ${error.message}`);
      }

      return data as Notification;
    } catch (error) {
      console.error('[UserPreferencesService] Create notification failed:', error);
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
        console.error('[UserPreferencesService] Mark as read error:', error);
        throw new Error(`Failed to mark notification as read: ${error.message}`);
      }
    } catch (error) {
      console.error('[UserPreferencesService] Mark as read failed:', error);
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
        console.error('[UserPreferencesService] Mark all as read error:', error);
        throw new Error(`Failed to mark all as read: ${error.message}`);
      }
    } catch (error) {
      console.error('[UserPreferencesService] Mark all as read failed:', error);
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
        console.error('[UserPreferencesService] Delete notification error:', error);
        throw new Error(`Failed to delete notification: ${error.message}`);
      }
    } catch (error) {
      console.error('[UserPreferencesService] Delete notification failed:', error);
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
        console.error('[UserPreferencesService] Archive notification error:', error);
        throw new Error(`Failed to archive notification: ${error.message}`);
      }
    } catch (error) {
      console.error('[UserPreferencesService] Archive notification failed:', error);
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
        console.error('[UserPreferencesService] Count unread error:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('[UserPreferencesService] Count unread failed:', error);
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
   * Demander un export de données (RGPD)
   */
  static async requestDataExport(
    request: DataExportRequest
  ): Promise<DataExportResult> {
    // TODO: Implémenter la génération d'export
    // Pour l'instant, retourner un résultat mock
    return {
      id: crypto.randomUUID(),
      status: 'pending'
    };
  }

  /**
   * Demander la suppression du compte (RGPD)
   */
  static async requestAccountDeletion(
    request: AccountDeletionRequest
  ): Promise<AccountDeletionResult> {
    try {
      if (request.delete_immediately) {
        // Suppression immédiate
        const { error } = await supabase
          .from('user_profiles')
          .delete()
          .eq('user_id', request.user_id);

        if (error) {
          throw error;
        }

        return {
          success: true
        };
      } else {
        // Soft delete avec période de grâce de 30 jours
        const deletionDate = new Date();
        deletionDate.setDate(deletionDate.getDate() + 30);

        // TODO: Marquer le compte pour suppression différée
        // await supabase.from('user_profiles').update({ ... })

        return {
          success: true,
          deletion_scheduled_for: deletionDate.toISOString(),
          grace_period_days: 30
        };
      }
    } catch (error) {
      console.error('[UserPreferencesService] Account deletion failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
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
