
import { Notification } from '@/types/notifications';
import { supabase } from '@/integrations/supabase/client';

export class NotificationService {
  /**
   * Ajouter une notification
   */
  static async addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<string> {
    try {
      const notificationWithDefaults = {
        ...notification,
        timestamp: new Date().toISOString(),
        read: false,
        created_at: new Date().toISOString(),
      };
      
      // Utiliser une fonction edge ou mock pour le développement
      const { data, error } = await supabase.functions.invoke('add-notification', { 
        body: notificationWithDefaults 
      });
      
      if (error) throw error;
      return data?.id || Math.random().toString(36).substr(2, 9);
    } catch (error) {
      console.error('Error adding notification:', error);
      // Fallback pour le développement local
      return Math.random().toString(36).substr(2, 9);
    }
  }

  /**
   * Récupérer toutes les notifications d'un utilisateur
   */
  static async getNotifications(userId?: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase.functions.invoke('get-notifications', { 
        body: { userId } 
      });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      // Retourner des données de démonstration pour le développement
      return this.getMockNotifications();
    }
  }

  /**
   * Obtenir le nombre de notifications non lues
   */
  static async getUnreadCount(userId?: string): Promise<number> {
    try {
      const { data, error } = await supabase.functions.invoke('get-unread-count', { 
        body: { userId } 
      });
      
      if (error) throw error;
      return data?.count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Marquer une notification comme lue
   */
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('mark-notification-read', { 
        body: { notificationId } 
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Ne pas lancer d'erreur pour permettre la continuation
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  static async markAllAsRead(userId?: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('mark-all-notifications-read', { 
        body: { userId } 
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Ne pas lancer d'erreur pour permettre la continuation
    }
  }
  
  /**
   * S'abonner aux changements de notifications
   */
  static subscribeToNotifications(callback: () => void): (() => void) {
    // Implémentation optionnelle pour le temps réel
    // Retourner une fonction de désabonnement
    return () => {};
  }

  /**
   * Données de démonstration pour le développement
   */
  private static getMockNotifications(): Notification[] {
    return [
      {
        id: '1',
        type: 'achievement',
        priority: 'medium',
        title: 'Nouveau badge débloqué !',
        message: 'Félicitations ! Vous avez obtenu le badge "Première semaine"',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        actionText: 'Voir le badge',
        actionUrl: '/achievements',
      },
      {
        id: '2',
        type: 'reminder',
        priority: 'low',
        title: 'Rappel de bien-être',
        message: 'Il est temps de faire votre check-in émotionnel quotidien',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        actionText: 'Commencer',
        actionUrl: '/scan',
      },
      {
        id: '3',
        type: 'system',
        priority: 'high',
        title: 'Mise à jour disponible',
        message: 'Une nouvelle version de l\'application est disponible avec des améliorations importantes',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        actionText: 'Mettre à jour',
        actionUrl: '/settings',
      },
      {
        id: '4',
        type: 'social',
        priority: 'low',
        title: 'Nouveau membre dans votre équipe',
        message: 'Sophie Martin a rejoint votre équipe de bien-être',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        read: true,
      },
    ];
  }
}
