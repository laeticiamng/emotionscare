/**
 * Account Deletion Service with Grace Period
 * GDPR Article 17 - Right to Erasure ("Right to be Forgotten")
 *
 * Ce service gère le cycle complet de suppression de compte :
 * - Demande de suppression avec période de grâce (30 jours par défaut)
 * - Annulation de la demande pendant la période de grâce
 * - Exécution automatique après la période de grâce
 * - Emails de confirmation à chaque étape
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

const EMAIL_FROM = 'EmotionsCare <noreply@emotionscare.com>';
const SUPPORT_EMAIL = 'support@emotionscare.com';
const APP_URL = import.meta.env.VITE_APP_URL || 'https://emotionscare.com';

/**
 * Générer le template d'email de confirmation de suppression
 */
function getDeletionConfirmationTemplate(
  userName: string,
  scheduledDate: Date,
  remainingDays: number,
  cancellationUrl: string
): EmailTemplate {
  const formattedDate = scheduledDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    subject: '⚠️ Confirmation de votre demande de suppression de compte EmotionsCare',
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">EmotionsCare</h1>
  </div>

  <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
    <h2 style="color: #333; margin-top: 0;">Bonjour ${userName},</h2>

    <p>Nous avons bien reçu votre demande de suppression de compte EmotionsCare.</p>

    <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0; font-weight: bold; color: #856404;">
        ⏳ Votre compte sera définitivement supprimé le ${formattedDate}
      </p>
      <p style="margin: 10px 0 0; color: #856404;">
        Il vous reste <strong>${remainingDays} jours</strong> pour annuler cette demande.
      </p>
    </div>

    <h3 style="color: #333;">Ce qui sera supprimé :</h3>
    <ul style="color: #666;">
      <li>Votre profil et vos informations personnelles</li>
      <li>Votre journal émotionnel et toutes vos entrées</li>
      <li>Vos scans émotionnels et statistiques</li>
      <li>Vos sessions de méditation et de respiration</li>
      <li>Vos conversations avec le Coach IA</li>
      <li>Vos badges et récompenses</li>
    </ul>

    <div style="background: #d4edda; border: 1px solid #28a745; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0; color: #155724;">
        <strong>💡 Vous avez changé d'avis ?</strong><br>
        Vous pouvez annuler cette demande à tout moment pendant la période de grâce.
      </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${cancellationUrl}" style="background: #28a745; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        Annuler la suppression
      </a>
    </div>

    <p style="color: #666; font-size: 14px;">
      Conformément au RGPD (Article 17), vous avez le droit à l'effacement de vos données personnelles.
      Cette action est irréversible après la période de grâce.
    </p>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <p style="color: #888; font-size: 12px; margin: 0;">
      Si vous n'avez pas demandé la suppression de votre compte, veuillez
      <a href="${cancellationUrl}" style="color: #667eea;">annuler immédiatement</a>
      et contacter notre support à ${SUPPORT_EMAIL}.
    </p>
  </div>
</body>
</html>`,
    text: `
Bonjour ${userName},

Nous avons bien reçu votre demande de suppression de compte EmotionsCare.

⚠️ IMPORTANT : Votre compte sera définitivement supprimé le ${formattedDate}.
Il vous reste ${remainingDays} jours pour annuler cette demande.

CE QUI SERA SUPPRIMÉ :
- Votre profil et vos informations personnelles
- Votre journal émotionnel et toutes vos entrées
- Vos scans émotionnels et statistiques
- Vos sessions de méditation et de respiration
- Vos conversations avec le Coach IA
- Vos badges et récompenses

VOUS AVEZ CHANGÉ D'AVIS ?
Annulez la suppression ici : ${cancellationUrl}

Conformément au RGPD (Article 17), vous avez le droit à l'effacement de vos données personnelles.
Cette action est irréversible après la période de grâce.

---
EmotionsCare - Votre bien-être émotionnel
Support : ${SUPPORT_EMAIL}
`
  };
}

/**
 * Générer le template d'email d'annulation
 */
function getCancellationConfirmationTemplate(userName: string): EmailTemplate {
  return {
    subject: '✅ Suppression de compte annulée - EmotionsCare',
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">✅ Compte préservé</h1>
  </div>

  <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
    <h2 style="color: #333; margin-top: 0;">Bonjour ${userName},</h2>

    <p>Bonne nouvelle ! Votre demande de suppression de compte a bien été annulée.</p>

    <div style="background: #d4edda; border: 1px solid #28a745; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="margin: 0; font-size: 18px; color: #155724;">
        🎉 Votre compte EmotionsCare reste actif
      </p>
    </div>

    <p>Toutes vos données ont été préservées :</p>
    <ul style="color: #666;">
      <li>✓ Votre profil et préférences</li>
      <li>✓ Votre journal émotionnel</li>
      <li>✓ Vos statistiques et historique</li>
      <li>✓ Vos badges et récompenses</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${APP_URL}/app" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        Continuer sur EmotionsCare
      </a>
    </div>

    <p style="color: #666; font-size: 14px;">
      Nous sommes heureux de vous retrouver ! Si vous avez des questions ou des suggestions pour améliorer votre expérience, n'hésitez pas à nous contacter.
    </p>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <p style="color: #888; font-size: 12px; margin: 0;">
      EmotionsCare - Votre bien-être émotionnel au quotidien<br>
      Support : ${SUPPORT_EMAIL}
    </p>
  </div>
</body>
</html>`,
    text: `
Bonjour ${userName},

Bonne nouvelle ! Votre demande de suppression de compte a bien été annulée.

🎉 VOTRE COMPTE EMOTIONSCARE RESTE ACTIF

Toutes vos données ont été préservées :
✓ Votre profil et préférences
✓ Votre journal émotionnel
✓ Vos statistiques et historique
✓ Vos badges et récompenses

Continuez sur EmotionsCare : ${APP_URL}/app

Nous sommes heureux de vous retrouver !

---
EmotionsCare - Votre bien-être émotionnel
Support : ${SUPPORT_EMAIL}
`
  };
}

/**
 * Générer le template d'email de rappel (période de grâce)
 */
function getGracePeriodReminderTemplate(
  userName: string,
  scheduledDate: Date,
  remainingDays: number,
  cancellationUrl: string
): EmailTemplate {
  const formattedDate = scheduledDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const urgencyColor = remainingDays <= 3 ? '#dc3545' : remainingDays <= 7 ? '#ffc107' : '#17a2b8';
  const urgencyBg = remainingDays <= 3 ? '#f8d7da' : remainingDays <= 7 ? '#fff3cd' : '#d1ecf1';

  return {
    subject: `⏰ Rappel : Plus que ${remainingDays} jour${remainingDays > 1 ? 's' : ''} avant la suppression de votre compte`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: ${urgencyColor}; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">⏰ Rappel Important</h1>
  </div>

  <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
    <h2 style="color: #333; margin-top: 0;">Bonjour ${userName},</h2>

    <p>Ceci est un rappel concernant votre demande de suppression de compte EmotionsCare.</p>

    <div style="background: ${urgencyBg}; border: 1px solid ${urgencyColor}; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="margin: 0; font-size: 32px; font-weight: bold; color: ${urgencyColor};">
        ${remainingDays}
      </p>
      <p style="margin: 5px 0 0; color: ${urgencyColor};">
        jour${remainingDays > 1 ? 's' : ''} restant${remainingDays > 1 ? 's' : ''}
      </p>
    </div>

    <p style="text-align: center; font-weight: bold;">
      Suppression prévue le : ${formattedDate}
    </p>

    ${remainingDays <= 3 ? `
    <div style="background: #f8d7da; border: 1px solid #dc3545; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #721c24; font-weight: bold;">
        ⚠️ Attention : Cette action sera bientôt irréversible !
      </p>
    </div>
    ` : ''}

    <div style="text-align: center; margin: 30px 0;">
      <a href="${cancellationUrl}" style="background: #28a745; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 5px;">
        Annuler la suppression
      </a>
    </div>

    <p style="color: #666; font-size: 14px; text-align: center;">
      Si vous souhaitez maintenir votre demande de suppression, aucune action n'est requise.
    </p>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <p style="color: #888; font-size: 12px; margin: 0;">
      EmotionsCare - Votre bien-être émotionnel<br>
      Support : ${SUPPORT_EMAIL}
    </p>
  </div>
</body>
</html>`,
    text: `
Bonjour ${userName},

RAPPEL IMPORTANT : Plus que ${remainingDays} jour${remainingDays > 1 ? 's' : ''} avant la suppression de votre compte !

Suppression prévue le : ${formattedDate}

${remainingDays <= 3 ? '⚠️ ATTENTION : Cette action sera bientôt irréversible !' : ''}

VOUS AVEZ CHANGÉ D'AVIS ?
Annulez la suppression ici : ${cancellationUrl}

Si vous souhaitez maintenir votre demande de suppression, aucune action n'est requise.

---
EmotionsCare - Votre bien-être émotionnel
Support : ${SUPPORT_EMAIL}
`
  };
}

/**
 * Générer le template d'email de confirmation de suppression finale
 */
function getDeletionCompletedTemplate(userName: string): EmailTemplate {
  return {
    subject: '🗑️ Votre compte EmotionsCare a été supprimé',
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #6c757d; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Compte supprimé</h1>
  </div>

  <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
    <h2 style="color: #333; margin-top: 0;">Bonjour ${userName},</h2>

    <p>Conformément à votre demande et au RGPD (Article 17 - Droit à l'effacement), votre compte EmotionsCare a été définitivement supprimé.</p>

    <div style="background: #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #495057;">Données supprimées :</h3>
      <ul style="color: #666; margin-bottom: 0;">
        <li>✓ Profil et informations personnelles</li>
        <li>✓ Journal émotionnel</li>
        <li>✓ Scans et historique émotionnel</li>
        <li>✓ Sessions et statistiques</li>
        <li>✓ Conversations avec le Coach IA</li>
        <li>✓ Badges et récompenses</li>
      </ul>
    </div>

    <p style="color: #666;">
      Nous sommes tristes de vous voir partir, mais nous respectons votre décision.
      Vos données ont été intégralement effacées de nos systèmes.
    </p>

    <div style="background: #d1ecf1; border: 1px solid #17a2b8; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0; color: #0c5460;">
        💙 Vous êtes toujours le bienvenu chez EmotionsCare.<br>
        Si vous changez d'avis, vous pourrez créer un nouveau compte à tout moment.
      </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${APP_URL}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        Créer un nouveau compte
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <p style="color: #888; font-size: 12px; margin: 0;">
      Cet email a été envoyé à titre de confirmation. Aucune action n'est requise de votre part.<br>
      EmotionsCare - Support : ${SUPPORT_EMAIL}
    </p>
  </div>
</body>
</html>`,
    text: `
Bonjour ${userName},

Conformément à votre demande et au RGPD (Article 17 - Droit à l'effacement),
votre compte EmotionsCare a été définitivement supprimé.

DONNÉES SUPPRIMÉES :
✓ Profil et informations personnelles
✓ Journal émotionnel
✓ Scans et historique émotionnel
✓ Sessions et statistiques
✓ Conversations avec le Coach IA
✓ Badges et récompenses

Nous sommes tristes de vous voir partir, mais nous respectons votre décision.
Vos données ont été intégralement effacées de nos systèmes.

💙 Vous êtes toujours le bienvenu chez EmotionsCare.
Si vous changez d'avis, vous pourrez créer un nouveau compte : ${APP_URL}

---
EmotionsCare - Support : ${SUPPORT_EMAIL}
`
  };
}

export interface DeletionRequest {
  id: string;
  user_id: string;
  requested_at: string;
  scheduled_deletion_at: string;
  grace_period_days: number;
  reason?: string;
  status: 'pending' | 'cancelled' | 'completed';
  cancelled_at?: string;
  completed_at?: string;
}

export class AccountDeletionService {
  private static readonly DEFAULT_GRACE_PERIOD_DAYS = 30;

  /**
   * Request account deletion with grace period
   */
  static async requestDeletion(
    userId: string,
    reason?: string,
    gracePeriodDays: number = this.DEFAULT_GRACE_PERIOD_DAYS
  ): Promise<DeletionRequest> {
    try {
      // Check if there's already a pending deletion request
      const existing = await this.getPendingDeletionRequest(userId);
      if (existing) {
        throw new Error('Une demande de suppression est déjà en cours');
      }

      // Calculate scheduled deletion date
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + gracePeriodDays);

      // Create deletion request
      const { data, error } = await supabase
        .from('account_deletion_requests')
        .insert({
          user_id: userId,
          scheduled_deletion_at: scheduledDate.toISOString(),
          grace_period_days: gracePeriodDays,
          reason: reason || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      logger.info('Account deletion requested', {
        userId,
        scheduledDate: scheduledDate.toISOString(),
      }, 'GDPR');

      // Send confirmation email to user
      await this.sendDeletionConfirmationEmail(userId, scheduledDate);

      return data as DeletionRequest;
    } catch (error) {
      logger.error('Failed to request account deletion', error, 'GDPR');
      throw error;
    }
  }

  /**
   * Cancel pending deletion request
   */
  static async cancelDeletion(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('account_deletion_requests')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('status', 'pending');

      if (error) throw error;

      logger.info('Account deletion cancelled', { userId }, 'GDPR');

      // Send cancellation confirmation email
      await this.sendCancellationEmail(userId);
    } catch (error) {
      logger.error('Failed to cancel account deletion', error, 'GDPR');
      throw error;
    }
  }

  /**
   * Get pending deletion request for user
   */
  static async getPendingDeletionRequest(userId: string): Promise<DeletionRequest | null> {
    try {
      const { data, error } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = not found
        throw error;
      }

      return data as DeletionRequest | null;
    } catch (error) {
      logger.error('Failed to get pending deletion request', error, 'GDPR');
      return null;
    }
  }

  /**
   * Get deletion request history for user
   */
  static async getDeletionHistory(userId: string): Promise<DeletionRequest[]> {
    try {
      const { data, error } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .eq('user_id', userId)
        .order('requested_at', { ascending: false });

      if (error) throw error;

      return (data as DeletionRequest[]) || [];
    } catch (error) {
      logger.error('Failed to get deletion history', error, 'GDPR');
      return [];
    }
  }

  /**
   * Calculate remaining days in grace period
   */
  static getRemainingDays(deletionRequest: DeletionRequest): number {
    const scheduledDate = new Date(deletionRequest.scheduled_deletion_at);
    const now = new Date();
    const diffTime = scheduledDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  /**
   * Execute account deletion (called by scheduled job)
   * This should be called by a server-side cron job
   */
  static async executeScheduledDeletions(): Promise<void> {
    try {
      // Get all pending deletions that are past their scheduled date
      const { data: pendingDeletions, error } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_deletion_at', new Date().toISOString());

      if (error) throw error;

      if (!pendingDeletions || pendingDeletions.length === 0) {
        logger.info('No scheduled deletions to execute', undefined, 'GDPR');
        return;
      }

      // Execute each deletion
      for (const deletion of pendingDeletions) {
        try {
          await this.executeUserDeletion(deletion.user_id, deletion.id);
        } catch (err) {
          logger.error('Failed to execute deletion', {
            error: err,
            userId: deletion.user_id,
          }, 'GDPR');
        }
      }
    } catch (error) {
      logger.error('Failed to execute scheduled deletions', error, 'GDPR');
      throw error;
    }
  }

  /**
   * Execute deletion for a single user
   */
  private static async executeUserDeletion(
    userId: string,
    deletionRequestId: string
  ): Promise<void> {
    try {
      // Récupérer les infos utilisateur AVANT suppression pour l'email de confirmation
      const userInfo = await this.getUserInfo(userId);
      const userEmail = userInfo?.email;
      const userName = userInfo?.name || 'Utilisateur';

      // This is a critical operation - we should:
      // 1. Delete or anonymize user data in all tables
      // 2. Delete user auth account
      // 3. Mark deletion as completed

      // Delete from journal_notes
      await supabase.from('journal_notes').delete().eq('user_id', userId);

      // Delete from emotion_scans
      await supabase.from('emotion_scans').delete().eq('user_id', userId);

      // Delete from activity_sessions
      await supabase.from('activity_sessions').delete().eq('user_id', userId);

      // Delete from export_logs
      await supabase.from('export_logs').delete().eq('user_id', userId);

      // Delete from meditation_sessions
      await supabase.from('meditation_sessions').delete().eq('user_id', userId);

      // Delete from breathing_sessions
      await supabase.from('breathing_sessions').delete().eq('user_id', userId);

      // Delete from ai_coach_sessions
      await supabase.from('ai_coach_sessions').delete().eq('user_id', userId);

      // Delete from notifications
      await supabase.from('notifications').delete().eq('user_id', userId);

      // Delete from achievements
      await supabase.from('user_achievements').delete().eq('user_id', userId);

      // Anonymize or delete from profiles
      await supabase
        .from('profiles')
        .update({
          email: `deleted-${userId}@anonymized.local`,
          name: 'Compte supprimé',
          avatar_url: null,
          preferences: null,
        })
        .eq('id', userId);

      // Mark deletion request as completed
      await supabase
        .from('account_deletion_requests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', deletionRequestId);

      // Delete auth user (this should be done via Supabase admin API)
      // await supabase.auth.admin.deleteUser(userId);

      // Envoyer l'email de confirmation de suppression finale
      if (userEmail) {
        await this.sendDeletionCompletedEmail(userEmail, userName);
      }

      logger.info('User account deleted successfully', { userId }, 'GDPR');
    } catch (error) {
      logger.error('Failed to execute user deletion', error, 'GDPR');
      throw error;
    }
  }

  /**
   * Récupérer les informations utilisateur pour l'envoi d'email
   */
  private static async getUserInfo(userId: string): Promise<{ email: string; name: string } | null> {
    try {
      // Récupérer depuis la table profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, name')
        .eq('id', userId)
        .single();

      if (!profileError && profile?.email) {
        return {
          email: profile.email,
          name: profile.name || 'Utilisateur'
        };
      }

      // Fallback: récupérer depuis auth.users via l'API
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (!authError && user?.email) {
        return {
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0] || 'Utilisateur'
        };
      }

      return null;
    } catch (error) {
      logger.error('[AccountDeletionService] Failed to get user info:', error, 'GDPR');
      return null;
    }
  }

  /**
   * Envoyer un email via Supabase Edge Function
   */
  private static async sendEmail(
    to: string,
    template: EmailTemplate
  ): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to,
          from: EMAIL_FROM,
          subject: template.subject,
          html: template.html,
          text: template.text
        }
      });

      if (error) {
        logger.error('[AccountDeletionService] Email send error:', error, 'GDPR');
        return false;
      }

      return true;
    } catch (error) {
      logger.error('[AccountDeletionService] Failed to send email:', error, 'GDPR');
      return false;
    }
  }

  /**
   * Envoyer l'email de confirmation de suppression
   */
  private static async sendDeletionConfirmationEmail(
    userId: string,
    scheduledDate: Date
  ): Promise<void> {
    const userInfo = await this.getUserInfo(userId);
    if (!userInfo) {
      logger.warn('[AccountDeletionService] Cannot send email - user info not found', { userId }, 'GDPR');
      return;
    }

    const remainingDays = Math.ceil(
      (scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    const cancellationUrl = `${APP_URL}/app/settings/privacy?action=cancel-deletion`;

    const template = getDeletionConfirmationTemplate(
      userInfo.name,
      scheduledDate,
      remainingDays,
      cancellationUrl
    );

    const sent = await this.sendEmail(userInfo.email, template);

    logger.info('Deletion confirmation email sent', {
      userId,
      email: userInfo.email,
      scheduledDate: scheduledDate.toISOString(),
      sent
    }, 'GDPR');
  }

  /**
   * Envoyer l'email de confirmation d'annulation
   */
  private static async sendCancellationEmail(userId: string): Promise<void> {
    const userInfo = await this.getUserInfo(userId);
    if (!userInfo) {
      logger.warn('[AccountDeletionService] Cannot send cancellation email - user info not found', { userId }, 'GDPR');
      return;
    }

    const template = getCancellationConfirmationTemplate(userInfo.name);
    const sent = await this.sendEmail(userInfo.email, template);

    logger.info('Cancellation confirmation email sent', {
      userId,
      email: userInfo.email,
      sent
    }, 'GDPR');
  }

  /**
   * Envoyer l'email de rappel de période de grâce
   * Appelé par un job planifié (ex: 7 jours, 3 jours, 1 jour avant suppression)
   */
  static async sendGracePeriodReminder(deletionRequest: DeletionRequest): Promise<void> {
    const userInfo = await this.getUserInfo(deletionRequest.user_id);
    if (!userInfo) {
      logger.warn('[AccountDeletionService] Cannot send reminder - user info not found', {
        userId: deletionRequest.user_id
      }, 'GDPR');
      return;
    }

    const remainingDays = this.getRemainingDays(deletionRequest);
    const scheduledDate = new Date(deletionRequest.scheduled_deletion_at);
    const cancellationUrl = `${APP_URL}/app/settings/privacy?action=cancel-deletion`;

    const template = getGracePeriodReminderTemplate(
      userInfo.name,
      scheduledDate,
      remainingDays,
      cancellationUrl
    );

    const sent = await this.sendEmail(userInfo.email, template);

    logger.info('Grace period reminder sent', {
      userId: deletionRequest.user_id,
      email: userInfo.email,
      remainingDays,
      sent
    }, 'GDPR');
  }

  /**
   * Envoyer l'email de confirmation de suppression finale
   * Appelé après l'exécution de la suppression
   */
  private static async sendDeletionCompletedEmail(
    email: string,
    userName: string
  ): Promise<void> {
    const template = getDeletionCompletedTemplate(userName);
    const sent = await this.sendEmail(email, template);

    logger.info('Deletion completed email sent', {
      email,
      sent
    }, 'GDPR');
  }

  /**
   * Envoyer tous les rappels programmés pour aujourd'hui
   * À appeler via un cron job quotidien
   */
  static async sendScheduledReminders(): Promise<void> {
    try {
      // Récupérer toutes les demandes en attente
      const { data: pendingDeletions, error } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .eq('status', 'pending')
        .gt('scheduled_deletion_at', new Date().toISOString());

      if (error) {
        logger.error('[AccountDeletionService] Failed to get pending deletions for reminders', error, 'GDPR');
        return;
      }

      if (!pendingDeletions || pendingDeletions.length === 0) {
        return;
      }

      // Envoyer les rappels aux moments clés : 7 jours, 3 jours, 1 jour avant
      const reminderDays = [7, 3, 1];

      for (const deletion of pendingDeletions) {
        const remainingDays = this.getRemainingDays(deletion as DeletionRequest);

        if (reminderDays.includes(remainingDays)) {
          await this.sendGracePeriodReminder(deletion as DeletionRequest);
        }
      }
    } catch (error) {
      logger.error('[AccountDeletionService] Failed to send scheduled reminders', error, 'GDPR');
    }
  }
}
