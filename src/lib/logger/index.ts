/**
 * Production Logger System - EmotionsCare
 * Système de logging unifié avec niveaux et contexte
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';
export type LogContext = 'AUTH' | 'API' | 'UI' | 'SCAN' | 'VR' | 'MUSIC' | 'ANALYTICS' | 'SYSTEM' | 'ERROR_BOUNDARY' | 'SESSION' | 'CONSENT' | 'SOCIAL' | 'NYVEE' | 'WHO5' | 'STAI6' | 'BREATH' | 'FLASH' | 'MIXER' | 'SCORES' | 'COACH';

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context: LogContext
  data?: any
  userId?: string
  sessionId?: string
  error?: Error
}

class Logger {
  private sessionId: string
  private isDevelopment: boolean

  constructor() {
    this.sessionId = this.generateSessionId()
    this.isDevelopment = import.meta.env.DEV
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  debug(message: string, data?: any, context: LogContext = 'SYSTEM'): void {
    if (this.isDevelopment) {
      console.debug(`[${context}] ${message}`, data || '')
    }
  }

  info(message: string, data?: any, context: LogContext = 'SYSTEM'): void {
    console.info(`[${context}] ${message}`, data || '')
  }

  warn(message: string, data?: any, context: LogContext = 'SYSTEM'): void {
    console.warn(`[${context}] ${message}`, data || '')
  }

  error(message: string, error?: Error | any, context: LogContext = 'SYSTEM'): void {
    console.error(`[${context}] ${message}`, error || '')

    // En production, envoyer à un service de monitoring
    if (!this.isDevelopment && error instanceof Error) {
      this.sendToMonitoring('error', message, error, context);
    }
  }

  critical(message: string, error?: Error | any, context: LogContext = 'SYSTEM'): void {
    console.error(`[${context}] CRITICAL: ${message}`, error || '')

    // En production, alert immédiate
    if (!this.isDevelopment) {
      this.sendToMonitoring('critical', message, error, context);
      this.sendCriticalAlert(message, error, context);
    }
  }

  private async sendToMonitoring(level: string, message: string, error?: Error | any, context?: LogContext): Promise<void> {
    try {
      // Envoyer les erreurs à Supabase pour monitoring
      const { supabase } = await import('@/integrations/supabase/client');

      await supabase.from('error_logs').insert({
        level,
        message,
        context: context || 'SYSTEM',
        error_message: error?.message || String(error),
        error_stack: error?.stack || null,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        url: typeof window !== 'undefined' ? window.location.href : null
      });
    } catch (monitoringError) {
      // Fail silently to avoid infinite loops
      console.error('[Logger] Failed to send to monitoring:', monitoringError);
    }
  }

  private async sendCriticalAlert(message: string, error?: Error | any, context?: LogContext): Promise<void> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');

      // Créer une alerte de sécurité pour les erreurs critiques
      await supabase.from('security_alerts').insert({
        alert_type: 'critical_error',
        severity: 'critical',
        message: `[${context}] ${message}`,
        metadata: {
          error_message: error?.message || String(error),
          error_stack: error?.stack,
          session_id: this.sessionId,
          timestamp: new Date().toISOString()
        }
      });
    } catch (alertError) {
      console.error('[Logger] Failed to send critical alert:', alertError);
    }
  }

  getSessionId(): string {
    return this.sessionId
  }
}

export const logger = new Logger()
export default logger