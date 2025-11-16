/**
 * Production Logger System - EmotionsCare
 * Système de logging unifié avec niveaux et contexte
 */

import { logger } from '@/lib/logger';

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
    logger.error(`[${context}] ${message}`, error || '', 'LIB');

  return {
    debug: logDebug,
    info: logInfo,
    warn: logWarn,
    error: logError,
    critical: logCritical
  }
}

export default logger