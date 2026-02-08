// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/**
 * Send deletion confirmation email to user
 */
export async function sendDeletionConfirmationEmail(
  userId: string,
  scheduledDate: Date
): Promise<boolean> {
  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (!profile?.email) {
      logger.warn('No email found for user', { userId }, 'GDPR');
      return false;
    }

    // Call edge function to send email
    const { error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        to: profile.email,
        template: 'account_deletion_scheduled',
        data: {
          userName: profile.full_name || 'Utilisateur',
          scheduledDate: scheduledDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          gracePeriodDays: 30,
          cancelUrl: `${window.location.origin}/settings/account`,
          supportEmail: 'contact@emotionscare.com'
        },
        subject: '⚠️ Confirmation de la demande de suppression de compte - EmotionsCare'
      }
    });

    if (error) {
      logger.error('Failed to send deletion confirmation email', error, 'GDPR');
      return false;
    }

    logger.info('Deletion confirmation email sent', { userId }, 'GDPR');
    return true;
  } catch (err) {
    logger.error('Error sending deletion confirmation email', err, 'GDPR');
    return false;
  }
}

/**
 * Send cancellation confirmation email
 */
export async function sendCancellationEmail(userId: string): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (!profile?.email) {
      logger.warn('No email found for user', { userId }, 'GDPR');
      return false;
    }

    const { error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        to: profile.email,
        template: 'account_deletion_cancelled',
        data: {
          userName: profile.full_name || 'Utilisateur',
          settingsUrl: `${window.location.origin}/settings/account`
        },
        subject: '✅ Suppression de compte annulée - EmotionsCare'
      }
    });

    if (error) {
      logger.error('Failed to send cancellation email', error, 'GDPR');
      return false;
    }

    logger.info('Cancellation confirmation email sent', { userId }, 'GDPR');
    return true;
  } catch (err) {
    logger.error('Error sending cancellation email', err, 'GDPR');
    return false;
  }
}

/**
 * Send final deletion notice email
 */
export async function sendFinalDeletionNotice(
  email: string,
  userName?: string
): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        to: email,
        template: 'account_deleted',
        data: {
          userName: userName || 'Utilisateur',
          supportEmail: 'contact@emotionscare.com'
        },
        subject: '👋 Votre compte EmotionsCare a été supprimé'
      }
    });

    if (error) {
      logger.error('Failed to send final deletion notice', error, 'GDPR');
      return false;
    }

    logger.info('Final deletion notice sent', { email }, 'GDPR');
    return true;
  } catch (err) {
    logger.error('Error sending final deletion notice', err, 'GDPR');
    return false;
  }
}

/**
 * Notify GDPR admin of deletion errors
 */
export async function notifyGDPRAdmin(
  userId: string,
  error: string,
  context: Record<string, unknown> = {}
): Promise<boolean> {
  try {
    const adminEmail = import.meta.env.VITE_GDPR_ADMIN_EMAIL || 'contact@emotionscare.com';

    const { error: sendError } = await supabase.functions.invoke('send-notification-email', {
      body: {
        to: adminEmail,
        template: 'admin_gdpr_error',
        data: {
          userId,
          errorMessage: error,
          context: JSON.stringify(context, null, 2),
          timestamp: new Date().toISOString()
        },
        subject: `🚨 Erreur GDPR - Suppression utilisateur ${userId}`
      }
    });

    if (sendError) {
      logger.error('Failed to notify GDPR admin', sendError, 'GDPR');
      return false;
    }

    logger.info('GDPR admin notified of error', { userId }, 'GDPR');
    return true;
  } catch (err) {
    logger.error('Error notifying GDPR admin', err, 'GDPR');
    return false;
  }
}

export default {
  sendDeletionConfirmationEmail,
  sendCancellationEmail,
  sendFinalDeletionNotice,
  notifyGDPRAdmin
};
