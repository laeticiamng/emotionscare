// @ts-nocheck
/**
 * Service d'envoi d'emails enrichi avec SMTP, templates, et queue
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
}

export interface EmailRecipient {
  email: string;
  name?: string;
  variables?: Record<string, string>;
}

export interface EmailOptions {
  templateId?: string;
  subject?: string;
  htmlBody?: string;
  textBody?: string;
  recipients: EmailRecipient[];
  from?: {
    email: string;
    name: string;
  };
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
  scheduledAt?: Date;
  priority?: 'low' | 'normal' | 'high';
  trackOpens?: boolean;
  trackClicks?: boolean;
  tags?: string[];
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  recipientResults?: Array<{
    email: string;
    success: boolean;
    error?: string;
  }>;
}

export interface EmailStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  unsubscribed: number;
}

class EmailServiceEnriched {
  private templates: Map<string, EmailTemplate> = new Map();
  private queue: EmailOptions[] = [];
  private isProcessingQueue = false;
  private retryAttempts = 3;
  private retryDelay = 1000;

  constructor() {
    this.loadTemplates();
  }

  /**
   * Charger les templates depuis Supabase
   */
  private async loadTemplates(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('email_templates' as any)
        .select('*');

      if (!error && data) {
        data.forEach((template: any) => {
          this.templates.set(template.id, template);
        });
        logger.info(`📧 Loaded ${data.length} email templates`, undefined, 'EMAIL');
      }
    } catch (error) {
      logger.debug('Email templates table not available', undefined, 'EMAIL');
    }
  }

  /**
   * Envoyer un email immédiatement
   */
  async send(options: EmailOptions): Promise<EmailResult> {
    try {
      logger.info('📧 Sending email', { 
        recipients: options.recipients.length,
        template: options.templateId 
      }, 'EMAIL');

      // Préparer le contenu
      let htmlBody = options.htmlBody;
      let textBody = options.textBody;
      let subject = options.subject;

      if (options.templateId) {
        const template = this.templates.get(options.templateId);
        if (template) {
          htmlBody = template.htmlBody;
          textBody = template.textBody;
          subject = template.subject;
        }
      }

      // Appeler l'edge function
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          recipients: options.recipients,
          subject,
          htmlBody,
          textBody,
          from: options.from,
          replyTo: options.replyTo,
          attachments: options.attachments,
          trackOpens: options.trackOpens ?? true,
          trackClicks: options.trackClicks ?? true,
          tags: options.tags,
          priority: options.priority ?? 'normal',
        },
      });

      if (error) {
        throw error;
      }

      logger.info('✅ Email sent successfully', { messageId: data?.messageId }, 'EMAIL');

      return {
        success: true,
        messageId: data?.messageId,
        recipientResults: data?.recipientResults,
      };
    } catch (error) {
      logger.error('Failed to send email', error as Error, 'EMAIL');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Envoyer un email avec retry automatique
   */
  async sendWithRetry(options: EmailOptions): Promise<EmailResult> {
    let lastError: string | undefined;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      const result = await this.send(options);
      
      if (result.success) {
        return result;
      }

      lastError = result.error;
      logger.warn(`Email send attempt ${attempt} failed, retrying...`, undefined, 'EMAIL');
      
      if (attempt < this.retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }

    return {
      success: false,
      error: `Failed after ${this.retryAttempts} attempts: ${lastError}`,
    };
  }

  /**
   * Ajouter à la queue
   */
  async enqueue(options: EmailOptions): Promise<void> {
    this.queue.push(options);
    logger.info('📧 Email added to queue', { queueSize: this.queue.length }, 'EMAIL');

    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  /**
   * Traiter la queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.queue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.queue.length > 0) {
      const email = this.queue.shift();
      if (email) {
        await this.sendWithRetry(email);
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Envoyer un email programmé
   */
  async schedule(options: EmailOptions): Promise<EmailResult> {
    if (!options.scheduledAt) {
      return this.send(options);
    }

    try {
      const { data, error } = await supabase
        .from('scheduled_emails' as any)
        .insert({
          options: options,
          scheduled_at: options.scheduledAt.toISOString(),
          status: 'pending',
        });

      if (error) throw error;

      logger.info('📧 Email scheduled', { scheduledAt: options.scheduledAt }, 'EMAIL');

      return {
        success: true,
        messageId: `scheduled-${Date.now()}`,
      };
    } catch (error) {
      logger.error('Failed to schedule email', error as Error, 'EMAIL');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Envoyer un email de bienvenue
   */
  async sendWelcome(email: string, name: string): Promise<EmailResult> {
    return this.send({
      recipients: [{ email, name, variables: { name } }],
      templateId: 'welcome',
      subject: `Bienvenue ${name} sur EmotionsCare!`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Bienvenue sur EmotionsCare!</h1>
          <p>Bonjour ${name},</p>
          <p>Nous sommes ravis de vous accueillir sur EmotionsCare, votre compagnon de bien-être émotionnel.</p>
          <p>Voici quelques fonctionnalités pour commencer:</p>
          <ul>
            <li>📊 Scanner vos émotions en temps réel</li>
            <li>🧘 Méditations guidées personnalisées</li>
            <li>📝 Journal émotionnel intelligent</li>
            <li>🎵 Musicothérapie adaptative</li>
          </ul>
          <p>À bientôt!</p>
          <p>L'équipe EmotionsCare</p>
        </div>
      `,
      priority: 'high',
      tags: ['welcome', 'onboarding'],
    });
  }

  /**
   * Envoyer un rapport hebdomadaire
   */
  async sendWeeklyReport(
    email: string, 
    name: string, 
    stats: { 
      emotionalScore: number;
      sessionsCount: number;
      improvements: string[];
    }
  ): Promise<EmailResult> {
    return this.send({
      recipients: [{ email, name }],
      subject: `Votre rapport hebdomadaire EmotionsCare`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Votre semaine en résumé</h1>
          <p>Bonjour ${name},</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2>📊 Score émotionnel moyen: ${stats.emotionalScore}%</h2>
            <p>Sessions complétées: ${stats.sessionsCount}</p>
          </div>
          <h3>🎯 Améliorations cette semaine:</h3>
          <ul>
            ${stats.improvements.map(i => `<li>${i}</li>`).join('')}
          </ul>
          <p>Continuez comme ça!</p>
          <p>L'équipe EmotionsCare</p>
        </div>
      `,
      tags: ['weekly-report', 'analytics'],
    });
  }

  /**
   * Envoyer une alerte de crise
   */
  async sendCrisisAlert(
    email: string, 
    name: string, 
    contactEmails: string[]
  ): Promise<EmailResult> {
    const allRecipients = [
      { email, name },
      ...contactEmails.map(e => ({ email: e })),
    ];

    return this.send({
      recipients: allRecipients,
      subject: `⚠️ Alerte bien-être - ${name}`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ef4444;">⚠️ Alerte bien-être</h1>
          <p>Une situation nécessitant une attention particulière a été détectée pour ${name}.</p>
          <div style="background: #fef2f2; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ef4444;">
            <p><strong>Actions recommandées:</strong></p>
            <ul>
              <li>Prenez contact avec ${name}</li>
              <li>Proposez une écoute bienveillante</li>
              <li>En cas d'urgence, contactez les services appropriés</li>
            </ul>
          </div>
          <p>Numéros d'urgence:</p>
          <ul>
            <li>SOS Amitié: 09 72 39 40 50</li>
            <li>Fil Santé Jeunes: 0 800 235 236</li>
          </ul>
        </div>
      `,
      priority: 'high',
      tags: ['crisis', 'alert', 'urgent'],
    });
  }

  /**
   * Obtenir les statistiques d'emails
   */
  async getStats(userId?: string, period?: { start: Date; end: Date }): Promise<EmailStats> {
    try {
      let query = supabase
        .from('email_logs' as any)
        .select('status, count');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (period) {
        query = query
          .gte('created_at', period.start.toISOString())
          .lte('created_at', period.end.toISOString());
      }

      const { data } = await query;

      const stats: EmailStats = {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        complained: 0,
        unsubscribed: 0,
      };

      if (data) {
        data.forEach((row: any) => {
          const status = row.status as keyof EmailStats;
          if (status in stats) {
            stats[status] = row.count;
          }
        });
      }

      return stats;
    } catch (error) {
      logger.error('Failed to get email stats', error as Error, 'EMAIL');
      return {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        complained: 0,
        unsubscribed: 0,
      };
    }
  }

  /**
   * Gérer les désabonnements
   */
  async unsubscribe(email: string, reason?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('email_unsubscribes' as any)
        .upsert({
          email,
          reason,
          unsubscribed_at: new Date().toISOString(),
        });

      if (error) throw error;

      logger.info('📧 Email unsubscribed', { email }, 'EMAIL');
      return true;
    } catch (error) {
      logger.error('Failed to unsubscribe', error as Error, 'EMAIL');
      return false;
    }
  }

  /**
   * Vérifier si un email est valide
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const emailServiceEnriched = new EmailServiceEnriched();
export default emailServiceEnriched;
