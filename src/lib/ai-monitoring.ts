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
  autoFixCode: string | null;
  relatedErrors: string[];
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  needsAlert: boolean;
  analysis: string;
  preventionTips: string[];
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
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
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
      // Protection contre les boucles infinies : ignorer les erreurs de monitoring
      if (event.context?.context === 'MONITORING' || 
          event.message.includes('ai-monitoring') ||
          event.message.includes('Failed to send event to AI monitoring')) {
        // Log uniquement localement, ne pas envoyer à l'edge function
        logger.warn('[AI-Monitoring] Skipping recursive monitoring event:', event.message, 'LIB');
        return;
      }

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
      // Fallback: log seulement localement si l'envoi échoue (sans recursion)
      logger.error('[AI-Monitoring] Failed to capture monitoring event:', error, 'LIB');
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
      // Log sans déclencher de recursion
      logger.error('[AI-Monitoring] Error processing monitoring queue:', error, 'LIB');
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
    // Circuit-breaker: skip if Supabase URL is not configured (placeholder)
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return; // Silently skip — no backend configured
    }

    try {
      const { data, error } = await supabase.functions.invoke('ai-monitoring', {
        body: event,
      });

      if (error) {
        throw error;
      }

      if (data?.analysis) {
        const analysis: AIAnalysisResult = data.analysis;

        // Log analysis via structured logger instead of console
        logger.debug(`AI Analysis: ${analysis.category} [${analysis.priority}] - ${analysis.analysis}`, 'MONITORING');

        if (analysis.isKnownIssue) {
          logger.debug('Known issue detected', 'MONITORING');
        }

        logger.debug(`Suggested fix: ${analysis.suggestedFix}`, 'MONITORING');

        if (analysis.autoFixCode) {
          logger.debug(`Auto-fix code: ${analysis.autoFixCode}`, 'MONITORING');
        }

        if (analysis.relatedErrors.length > 0) {
          logger.debug(`Related errors: ${analysis.relatedErrors.join(', ')}`, 'MONITORING');
        }

        if (analysis.preventionTips.length > 0) {
          analysis.preventionTips.forEach((tip, i) => {
            logger.debug(`Prevention tip ${i + 1}: ${tip}`, 'MONITORING');
          });
        }

        if (analysis.needsAlert) {
          logger.warn('ATTENTION: Cette erreur necessite une intervention immediate!', 'MONITORING');
        }
      }
    } catch {
      // Silently swallow — never log here to prevent infinite recursion
    }
  }

  /**
   * Obtenir la couleur selon la priorité
   */
  private getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
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
