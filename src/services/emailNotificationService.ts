/**
 * Email Notification Service - Envoi d'emails via Edge Function
 * Supporte notifications, résumés, alertes
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export type EmailType = 
  | 'welcome'
  | 'weekly_summary'
  | 'mood_alert'
  | 'achievement'
  | 'reminder'
  | 'gdpr_export'
  | 'crisis_alert';

export interface EmailData {
  to: string;
  subject: string;
  template: EmailType;
  variables: Record<string, unknown>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailNotificationService {
  /**
   * Envoie un email via l'edge function
   */
  async send(data: EmailData): Promise<EmailResult> {
    try {
      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: data.to,
          subject: data.subject,
          template: data.template,
          variables: data.variables,
        },
      });

      if (error) {
        throw error;
      }

      if (!result?.success) {
        throw new Error(result?.error || 'Email send failed');
      }

      logger.info('[EmailService] Email sent', { template: data.template, to: data.to.substring(0, 5) + '***' }, 'EMAIL');
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('[EmailService] Send error', error as Error, 'EMAIL');
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Envoie un email de bienvenue
   */
  async sendWelcome(email: string, name: string): Promise<EmailResult> {
    return this.send({
      to: email,
      subject: 'Bienvenue sur EmotionsCare ! 🌟',
      template: 'welcome',
      variables: { name, appUrl: window.location.origin },
    });
  }

  /**
   * Envoie un résumé hebdomadaire
   */
  async sendWeeklySummary(
    email: string,
    name: string,
    stats: {
      moodAverage: number;
      moodTrend: 'up' | 'down' | 'stable';
      sessionsCount: number;
      topTechnique: string;
      streakDays: number;
    }
  ): Promise<EmailResult> {
    return this.send({
      to: email,
      subject: `Votre semaine sur EmotionsCare 📊`,
      template: 'weekly_summary',
      variables: {
        name,
        ...stats,
        appUrl: window.location.origin,
      },
    });
  }

  /**
   * Envoie une alerte d'humeur basse
   */
  async sendMoodAlert(
    email: string,
    name: string,
    alertLevel: 'warning' | 'critical'
  ): Promise<EmailResult> {
    return this.send({
      to: email,
      subject: alertLevel === 'critical' 
        ? '⚠️ EmotionsCare - Nous sommes là pour vous'
        : '💙 EmotionsCare - Un moment pour vous',
      template: 'mood_alert',
      variables: {
        name,
        alertLevel,
        helplineNumber: '3114',
        appUrl: window.location.origin,
      },
    });
  }

  /**
   * Envoie une notification de badge débloqué
   */
  async sendAchievementUnlocked(
    email: string,
    name: string,
    achievementName: string,
    achievementDescription: string
  ): Promise<EmailResult> {
    return this.send({
      to: email,
      subject: `🏆 Nouveau badge débloqué : ${achievementName}`,
      template: 'achievement',
      variables: {
        name,
        achievementName,
        achievementDescription,
        appUrl: window.location.origin,
      },
    });
  }

  /**
   * Envoie un rappel personnalisé
   */
  async sendReminder(
    email: string,
    name: string,
    reminderType: 'check_in' | 'breathing' | 'journal',
    customMessage?: string
  ): Promise<EmailResult> {
    const titles: Record<string, string> = {
      check_in: 'Comment allez-vous ?',
      breathing: 'Un moment de respiration ?',
      journal: 'Votre journal vous attend',
    };

    return this.send({
      to: email,
      subject: `💫 ${titles[reminderType] || 'Rappel EmotionsCare'}`,
      template: 'reminder',
      variables: {
        name,
        reminderType,
        customMessage,
        appUrl: window.location.origin,
      },
    });
  }

  /**
   * Envoie un export GDPR
   */
  async sendGDPRExport(
    email: string,
    name: string,
    downloadUrl: string,
    expiresAt: string
  ): Promise<EmailResult> {
    return this.send({
      to: email,
      subject: '📦 Votre export de données EmotionsCare',
      template: 'gdpr_export',
      variables: {
        name,
        downloadUrl,
        expiresAt,
      },
    });
  }

  /**
   * Envoie une alerte de crise (pour contacts d'urgence)
   */
  async sendCrisisAlert(
    email: string,
    contactName: string,
    userName: string,
    crisisLevel: string
  ): Promise<EmailResult> {
    return this.send({
      to: email,
      subject: `⚠️ Alerte EmotionsCare concernant ${userName}`,
      template: 'crisis_alert',
      variables: {
        contactName,
        userName,
        crisisLevel,
        helplineNumber: '3114',
      },
    });
  }

  /**
   * Vérifie si le service email est configuré
   */
  async checkConfiguration(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { action: 'check' },
      });
      return !error && data?.configured === true;
    } catch {
      return false;
    }
  }
}

export const emailNotificationService = new EmailNotificationService();
export default emailNotificationService;
