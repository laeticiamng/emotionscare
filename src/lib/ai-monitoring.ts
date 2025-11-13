/**
 * AI-based Monitoring System
 * Remplace Sentry avec analyse OpenAI intelligente
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface MonitoringEvent {
  type: 'error' | 'performance' | 'user_feedback' | 'custom';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  context?: Record<string, any>;
  userId?: string;
  timestamp: string;
  stack?: string;
  url?: string;
  userAgent?: string;
}

interface AIAnalysisResult {
  isKnownIssue: boolean;
  suggestedFix: string;
  relatedErrors: string[];
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  needsAlert: boolean;
  analysis: string;
}

class AIMonitoring {
  private queue: MonitoringEvent[] = [];
  private isProcessing = false;
  private maxQueueSize = 10;

  /**
   * Capture une erreur avec analyse AI
   */
  async captureError(error: Error, context?: Record<string, any>): Promise<void> {
    const event: MonitoringEvent = {
      type: 'error',
      severity: this.determineSeverity(error, context),
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      context,
    };

    await this.captureEvent(event);
  }

  /**
   * Capture une exception avec analyse AI
   */
  async captureException(exception: any, context?: Record<string, any>): Promise<void> {
    const error = exception instanceof Error ? exception : new Error(String(exception));
    await this.captureError(error, context);
  }

  /**
   * Capture un message personnalisé
   */
  async captureMessage(message: string, severity: 'critical' | 'high' | 'medium' | 'low' = 'low', context?: Record<string, any>): Promise<void> {
    const event: MonitoringEvent = {
      type: 'custom',
      severity,
      message,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      context,
    };

    await this.captureEvent(event);
  }

  /**
   * Capture une métrique de performance
   */
  async capturePerformance(metric: string, value: number, context?: Record<string, any>): Promise<void> {
    const event: MonitoringEvent = {
      type: 'performance',
      severity: value > 3000 ? 'high' : value > 1000 ? 'medium' : 'low',
      message: `Performance metric: ${metric} = ${value}ms`,
      timestamp: new Date().toISOString(),
      context: { ...context, metric, value },
    };

    await this.captureEvent(event);
  }

  /**
   * Capture un feedback utilisateur
   */
  async captureUserFeedback(feedback: string, context?: Record<string, any>): Promise<void> {
    const event: MonitoringEvent = {
      type: 'user_feedback',
      severity: 'low',
      message: feedback,
      timestamp: new Date().toISOString(),
      context,
    };

    await this.captureEvent(event);
  }

  /**
   * Capture un événement générique
   */
  private async captureEvent(event: MonitoringEvent): Promise<void> {
    try {
      // Ajouter l'userId si disponible
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        event.userId = user.id;
      }

      // Log local
      logger.debug(`📊 Monitoring event captured: ${event.type} - ${event.severity}`, event, 'MONITORING');

      // Ajouter à la queue
      this.queue.push(event);

      // Limiter la taille de la queue
      if (this.queue.length > this.maxQueueSize) {
        this.queue.shift();
      }

      // Envoyer immédiatement si critique
      if (event.severity === 'critical') {
        await this.sendToEdgeFunction(event);
      } else {
        // Sinon, traiter en batch
        this.processQueue();
      }
    } catch (error) {
      // Fallback: log seulement localement si l'envoi échoue
      logger.error('Failed to capture monitoring event', error as Error, 'MONITORING');
    }
  }

  /**
   * Traiter la queue de manière asynchrone
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    try {
      const event = this.queue.shift();
      if (event) {
        await this.sendToEdgeFunction(event);
      }
    } catch (error) {
      logger.error('Error processing monitoring queue', error as Error, 'MONITORING');
    } finally {
      this.isProcessing = false;

      // Continuer le traitement
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), 1000);
      }
    }
  }

  /**
   * Envoyer l'événement à l'edge function pour analyse AI
   */
  private async sendToEdgeFunction(event: MonitoringEvent): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-monitoring', {
        body: event,
      });

      if (error) {
        throw error;
      }

      if (data?.analysis) {
        const analysis = data.analysis as AIAnalysisResult;
        logger.info(
          `🤖 AI Analysis: ${analysis.category} - ${analysis.priority}`,
          { suggestedFix: analysis.suggestedFix, needsAlert: analysis.needsAlert },
          'MONITORING'
        );

        // Si l'analyse suggère une alerte, la logger
        if (analysis.needsAlert) {
          logger.warn(
            `⚠️ Alert needed: ${event.message}`,
            { analysis, event },
            'MONITORING'
          );
        }
      }
    } catch (error) {
      logger.error('Failed to send event to AI monitoring', error as Error, 'MONITORING');
    }
  }

  /**
   * Déterminer la sévérité d'une erreur
   */
  private determineSeverity(error: Error, context?: Record<string, any>): 'critical' | 'high' | 'medium' | 'low' {
    // Erreurs critiques
    if (
      error.message.includes('auth') ||
      error.message.includes('payment') ||
      error.message.includes('security') ||
      context?.critical
    ) {
      return 'critical';
    }

    // Erreurs haute priorité
    if (
      error.message.includes('database') ||
      error.message.includes('api') ||
      error.stack?.includes('fetch')
    ) {
      return 'high';
    }

    // Erreurs réseau ou UI
    if (
      error.message.includes('network') ||
      error.message.includes('render')
    ) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Configurer le contexte utilisateur
   */
  setUser(user: { id: string; email?: string; username?: string }): void {
    logger.debug('User context set for monitoring', { userId: user.id }, 'MONITORING');
  }

  /**
   * Ajouter des tags au contexte
   */
  setTags(tags: Record<string, string>): void {
    logger.debug('Tags set for monitoring', tags, 'MONITORING');
  }

  /**
   * Ajouter un contexte supplémentaire
   */
  setContext(name: string, context: Record<string, any>): void {
    logger.debug(`Context set: ${name}`, context, 'MONITORING');
  }
}

// Export singleton
export const aiMonitoring = new AIMonitoring();

// Alias pour compatibilité avec Sentry
export const captureException = (exception: any, context?: Record<string, any>) =>
  aiMonitoring.captureException(exception, context);

export const captureMessage = (message: string, level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug') => {
  const severity = level === 'fatal' ? 'critical' : level === 'error' ? 'high' : level === 'warning' ? 'medium' : 'low';
  return aiMonitoring.captureMessage(message, severity);
};

export const setUser = (user: { id: string; email?: string; username?: string }) =>
  aiMonitoring.setUser(user);

export const setTags = (tags: Record<string, string>) =>
  aiMonitoring.setTags(tags);

export const setContext = (name: string, context: Record<string, any>) =>
  aiMonitoring.setContext(name, context);

export default aiMonitoring;
