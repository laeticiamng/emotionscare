/**
 * Email Client Service
 * Service pour envoyer des emails via Supabase Edge Function
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export type EmailTemplate =
  | 'alert'
  | 'compliance'
  | 'welcome'
  | 'export_ready'
  | 'delete_request'
  | 'cancellation_confirmation'
  | 'grace_period_reminder';

export interface SendEmailOptions {
  to: string;
  subject: string;
  template: EmailTemplate;
  data?: Record<string, any>;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailClientService {
  /**
   * Send email via Supabase Edge Function
   */
  async sendEmail(options: SendEmailOptions): Promise<EmailResult> {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: options.to,
          subject: options.subject,
          template: options.template,
          data: options.data || {},
          replyTo: options.replyTo,
        },
      });

      if (error) {
        logger.error('Failed to send email', error, 'EMAIL');
        return {
          success: false,
          error: error.message || 'Failed to send email',
        };
      }

      logger.info('Email sent successfully', {
        to: options.to,
        template: options.template,
      }, 'EMAIL');

      return {
        success: true,
        messageId: data?.messageId,
      };
    } catch (error) {
      logger.error('Email sending error', error as Error, 'EMAIL');
      return {
        success: false,
        error: (error as Error).message || 'Unknown error',
      };
    }
  }

  /**
   * Send account deletion confirmation email
   */
  async sendDeletionConfirmation(
    userEmail: string,
    userName: string,
    scheduledDate: Date,
    cancelUrl: string
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: userEmail,
      subject: '🗑️ Confirmation de suppression de compte - EmotionsCare',
      template: 'delete_request',
      data: {
        name: userName,
        deletionDate: scheduledDate.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        cancelUrl,
      },
    });
  }

  /**
   * Send deletion cancellation confirmation email
   */
  async sendCancellationConfirmation(
    userEmail: string,
    userName: string,
    appUrl: string
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: userEmail,
      subject: '✅ Annulation de la suppression de compte - EmotionsCare',
      template: 'welcome', // Using welcome template as placeholder
      data: {
        name: userName,
        email: userEmail,
        message: 'Votre demande de suppression de compte a été annulée avec succès. Votre compte reste actif.',
        appUrl,
      },
    });
  }

  /**
   * Send grace period reminder email
   */
  async sendGracePeriodReminder(
    userEmail: string,
    userName: string,
    remainingDays: number,
    cancelUrl: string,
    deletionDate: Date
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: userEmail,
      subject: `⏰ Rappel: Suppression de compte dans ${remainingDays} jours - EmotionsCare`,
      template: 'alert',
      data: {
        title: `Votre compte sera supprimé dans ${remainingDays} jours`,
        message: `Votre demande de suppression de compte sera effective le ${deletionDate.toLocaleDateString('fr-FR')}. Si vous souhaitez conserver votre compte, vous pouvez annuler cette demande.`,
        actionUrl: cancelUrl,
      },
    });
  }

  /**
   * Send GDPR data export ready email
   */
  async sendExportReady(
    userEmail: string,
    userName: string,
    downloadUrl: string,
    fileSize: string,
    expiresIn: string
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: userEmail,
      subject: '📦 Vos données RGPD sont prêtes - EmotionsCare',
      template: 'export_ready',
      data: {
        name: userName,
        downloadUrl,
        fileSize,
        format: 'ZIP',
        expiresIn,
      },
    });
  }

  /**
   * Get user email from Supabase Auth
   */
  async getUserEmail(userId: string): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user?.id === userId) {
        return user.email || null;
      }

      // If not the current user, fetch from profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (error || !data) {
        logger.error('Failed to get user email', error, 'EMAIL');
        return null;
      }

      return data.email || null;
    } catch (error) {
      logger.error('Error getting user email', error as Error, 'EMAIL');
      return null;
    }
  }
}

export const emailClientService = new EmailClientService();
