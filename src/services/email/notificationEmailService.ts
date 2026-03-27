// @ts-nocheck
/**
 * Service d'envoi de notifications par email
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export type NotificationType = 'achievement' | 'reminder' | 'alert' | 'welcome';

export interface NotificationEmailData {
  userEmail: string;
  userName: string;
  notificationType: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

export const notificationEmailService = {
  /**
   * Envoyer une notification par email
   */
  async sendNotification(notificationData: NotificationEmailData): Promise<boolean> {
    try {
      logger.info(
        `📧 Sending ${notificationData.notificationType} notification`,
        { email: notificationData.userEmail },
        'EMAIL'
      );

      const { data, error } = await supabase.functions.invoke('send-notification-email', {
        body: notificationData,
      });

      if (error) {
        logger.error('Failed to send notification email', error as Error, 'EMAIL');
        throw error;
      }

      logger.info('✅ Notification sent successfully', { emailId: data?.emailId }, 'EMAIL');
      return true;
    } catch (error) {
      logger.error('Error sending notification email', error as Error, 'EMAIL');
      return false;
    }
  },

  /**
   * Envoyer un email de bienvenue
   */
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    return this.sendNotification({
      userEmail,
      userName,
      notificationType: 'welcome',
      title: 'Bienvenue sur EmotionsCare ! 🌟',
      message:
        "Nous sommes ravis de vous accueillir. EmotionsCare est votre compagnon de bien-être émotionnel. Commencez par explorer nos fonctionnalités et n'hésitez pas à nous contacter si vous avez des questions.",
      actionUrl: 'https://app.emotionscare.com/onboarding',
      actionText: 'Commencer',
    });
  },

  /**
   * Envoyer un rappel
   */
  async sendReminderEmail(
    userEmail: string,
    userName: string,
    reminderMessage: string
  ): Promise<boolean> {
    return this.sendNotification({
      userEmail,
      userName,
      notificationType: 'reminder',
      title: '⏰ Rappel EmotionsCare',
      message: reminderMessage,
      actionUrl: 'https://app.emotionscare.com',
      actionText: 'Accéder à l\'application',
    });
  },

  /**
   * Envoyer une alerte
   */
  async sendAlertEmail(
    userEmail: string,
    userName: string,
    alertMessage: string
  ): Promise<boolean> {
    return this.sendNotification({
      userEmail,
      userName,
      notificationType: 'alert',
      title: '⚠️ Alerte EmotionsCare',
      message: alertMessage,
      actionUrl: 'https://app.emotionscare.com/settings',
      actionText: 'Voir les paramètres',
    });
  },

  /**
   * Féliciter l'utilisateur pour un succès
   */
  async sendAchievementEmail(
    userEmail: string,
    userName: string,
    achievementName: string
  ): Promise<boolean> {
    return this.sendNotification({
      userEmail,
      userName,
      notificationType: 'achievement',
      title: `🏆 Félicitations ${userName} !`,
      message: `Vous avez débloqué le succès : ${achievementName}. Continue comme ça !`,
      actionUrl: 'https://app.emotionscare.com/achievements',
      actionText: 'Voir mes succès',
    });
  },
};

export default notificationEmailService;
