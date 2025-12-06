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
    
    // En production, on pourrait envoyer à un service de monitoring
    if (!this.isDevelopment && error instanceof Error) {
      // TODO: Envoyer à Sentry, LogRocket, etc.
    }
  }

  critical(message: string, error?: Error | any, context: LogContext = 'SYSTEM'): void {
    console.error(`[${context}] CRITICAL: ${message}`, error || '')
    
    // En production, alert immédiate
    if (!this.isDevelopment) {
      // TODO: Alert système critique
    }
  }

  getSessionId(): string {
    return this.sessionId
  }
}

export const logger = new Logger()
export default logger