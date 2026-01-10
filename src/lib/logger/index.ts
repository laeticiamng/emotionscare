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
    
    // En production, envoyer à Sentry si configuré
    if (!this.isDevelopment && error instanceof Error) {
      this.sendToMonitoring('error', message, error, context);
    }
  }

  critical(message: string, error?: Error | any, context: LogContext = 'SYSTEM'): void {
    console.error(`[${context}] CRITICAL: ${message}`, error || '')
    
    // En production, alert immédiate
    if (!this.isDevelopment) {
      this.sendToMonitoring('critical', message, error, context);
    }
  }
  
  private async sendToMonitoring(level: 'error' | 'critical', message: string, error?: Error | any, context?: LogContext): Promise<void> {
    try {
      // Utiliser Sentry si disponible
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        const Sentry = (window as any).Sentry;
        Sentry.captureException(error instanceof Error ? error : new Error(message), {
          level: level === 'critical' ? 'fatal' : 'error',
          tags: { context },
          extra: { sessionId: this.sessionId }
        });
      }
      
      // Fallback: envoyer à l'edge function de monitoring
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (supabaseUrl) {
        await fetch(`${supabaseUrl}/functions/v1/ai-monitoring`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            level,
            message,
            error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
            context,
            sessionId: this.sessionId,
            timestamp: new Date().toISOString()
          })
        }).catch(() => {/* Silent fail */});
      }
    } catch {
      // Silent fail - ne pas casser l'app pour le monitoring
    }
  }

  getSessionId(): string {
    return this.sessionId
  }
}

export const logger = new Logger()
export default logger