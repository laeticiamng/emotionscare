/**
 * Module Notifications - Service
 * Service centralisé pour la gestion des notifications
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { 
  Notification, 
  CreateNotificationInput, 
  NotificationFilters,
  NotificationPreferences,
  NotificationStats 
} from './types';

const LOG_CONTEXT = 'NotificationService';

class NotificationService {
  /**
   * Récupérer les notifications de l'utilisateur
   */
  async getNotifications(
    userId: string,
    filters?: NotificationFilters,
    limit = 20,
    offset = 0
  ): Promise<Notification[]> {
    try {
      let query = supabase
        .from('in_app_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (filters?.read !== undefined) {
        query = query.eq('read', filters.read);
      }
      if (filters?.pinned !== undefined) {
        query = query.eq('pinned', filters.pinned);
      }
      if (filters?.categories?.length) {
        query = query.in('type', filters.categories);
      }
      if (filters?.priority?.length) {
        query = query.in('priority', filters.priority);
      }
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;
      
      if (error) {
        if (error.code === '42P01') {
          logger.warn('Table in_app_notifications does not exist', LOG_CONTEXT);
          return [];
        }
        throw error;
      }

      return (data || []) as Notification[];
    } catch (error) {
      logger.error('Failed to fetch notifications', error as Error, LOG_CONTEXT);
      return [];
    }
  }

  /**
   * Créer une notification
   */
  async createNotification(input: CreateNotificationInput): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('in_app_notifications')
        .insert({
          user_id: input.user_id,
          type: input.type,
          priority: input.priority || 'medium',
          title: input.title,
          message: input.message || null,
          data: input.data || null,
          action_url: input.action_url || null,
          read: false,
          pinned: false,
        })
        .select()
        .single();

      if (error) throw error;
      
      logger.info(`Notification created: ${input.title}`, LOG_CONTEXT);
      return data as Notification;
    } catch (error) {
      logger.error('Failed to create notification', error as Error, LOG_CONTEXT);
      return null;
    }
  }

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('in_app_notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Failed to mark notification as read', error as Error, LOG_CONTEXT);
      return false;
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('in_app_notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Failed to mark all as read', error as Error, LOG_CONTEXT);
      return false;
    }
  }

  /**
   * Épingler/désépingler une notification
   */
  async togglePin(notificationId: string, pinned: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('in_app_notifications')
        .update({ pinned })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Failed to toggle pin', error as Error, LOG_CONTEXT);
      return false;
    }
  }

  /**
   * Snooze une notification
   */
  async snoozeNotification(notificationId: string, until: Date): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('in_app_notifications')
        .update({ snoozed_until: until.toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Failed to snooze notification', error as Error, LOG_CONTEXT);
      return false;
    }
  }

  /**
   * Supprimer une notification
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('in_app_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Failed to delete notification', error as Error, LOG_CONTEXT);
      return false;
    }
  }

  /**
   * Supprimer toutes les notifications lues
   */
  async deleteReadNotifications(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('in_app_notifications')
        .delete()
        .eq('user_id', userId)
        .eq('read', true)
        .eq('pinned', false);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Failed to delete read notifications', error as Error, LOG_CONTEXT);
      return false;
    }
  }

  /**
   * Obtenir le nombre de notifications non lues
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('in_app_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        if (error.code === '42P01') return 0;
        throw error;
      }

      return count || 0;
    } catch (error) {
      logger.error('Failed to get unread count', error as Error, LOG_CONTEXT);
      return 0;
    }
  }

  /**
   * Obtenir les statistiques des notifications
   */
  async getStats(userId: string): Promise<NotificationStats> {
    try {
      const { data, error } = await supabase
        .from('in_app_notifications')
        .select('type, read, created_at')
        .eq('user_id', userId);

      if (error) {
        if (error.code === '42P01') {
          return { total: 0, unread: 0, byCategory: {} as any, todayCount: 0 };
        }
        throw error;
      }

      const notifications = data || [];
      const today = new Date().toISOString().split('T')[0];

      const byCategory: Record<string, number> = {};
      let unread = 0;
      let todayCount = 0;

      for (const notif of notifications) {
        byCategory[notif.type] = (byCategory[notif.type] || 0) + 1;
        if (!notif.read) unread++;
        if (notif.created_at?.startsWith(today)) todayCount++;
      }

      return {
        total: notifications.length,
        unread,
        byCategory: byCategory as any,
        todayCount,
      };
    } catch (error) {
      logger.error('Failed to get stats', error as Error, LOG_CONTEXT);
      return { total: 0, unread: 0, byCategory: {} as any, todayCount: 0 };
    }
  }

  /**
   * Sauvegarder les préférences de notification
   */
  async savePreferences(userId: string, preferences: NotificationPreferences): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_notification_settings')
        .upsert({
          user_id: userId,
          settings: preferences,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Failed to save preferences', error as Error, LOG_CONTEXT);
      return false;
    }
  }

  /**
   * Charger les préférences de notification
   */
  async loadPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_notification_settings')
        .select('settings')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01') {
          return null;
        }
        throw error;
      }

      return data?.settings as NotificationPreferences || null;
    } catch (error) {
      logger.error('Failed to load preferences', error as Error, LOG_CONTEXT);
      return null;
    }
  }
}

export const notificationService = new NotificationService();
