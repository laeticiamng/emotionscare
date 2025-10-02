/**
 * Production Logger System - EmotionsCare
 * Système de logging unifié avec niveaux et contexte
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical'
export type LogContext = 'AUTH' | 'API' | 'UI' | 'SCAN' | 'VR' | 'MUSIC' | 'ANALYTICS' | 'SYSTEM'

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
  }

  critical(message: string, error?: Error | any, context: LogContext = 'SYSTEM'): void {
    console.error(`[CRITICAL] [${context}] ${message}`, error || '')
  }
}

// Instance singleton
export const logger = new Logger()

// Hook React pour utiliser le logger
import { useCallback } from 'react'

export function useLogger() {
  const logDebug = useCallback((message: string, data?: any, context: LogContext = 'UI') => {
    logger.debug(message, data, context)
  }, [])

  const logInfo = useCallback((message: string, data?: any, context: LogContext = 'UI') => {
    logger.info(message, data, context)
  }, [])

  const logWarn = useCallback((message: string, data?: any, context: LogContext = 'UI') => {
    logger.warn(message, data, context)
  }, [])

  const logError = useCallback((message: string, error?: Error | any, context: LogContext = 'UI') => {
    logger.error(message, error, context)
  }, [])

  const logCritical = useCallback((message: string, error?: Error | any, context: LogContext = 'UI') => {
    logger.critical(message, error, context)
  }, [])

  return {
    debug: logDebug,
    info: logInfo,
    warn: logWarn,
    error: logError,
    critical: logCritical
  }
}

export default logger