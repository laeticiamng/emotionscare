/**
 * Production-safe logging system
 * Remplace tous les console.log en production
 */

interface LogContext {
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isDev = import.meta.env.DEV;
  private isTest = import.meta.env.MODE === 'test';

  info(message: string, context?: LogContext) {
    if (this.isDev || this.isTest) {
      console.log(`[INFO] ${message}`, context);
    }
    // En production, envoyer à Sentry comme breadcrumb
  }

  warn(message: string, context?: LogContext) {
    if (this.isDev || this.isTest) {
      console.warn(`[WARN] ${message}`, context);
    }
    // En production, envoyer à Sentry
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    if (this.isDev || this.isTest) {
      console.error(`[ERROR] ${message}`, error, context);
    }
    // En production, envoyer à Sentry comme exception
  }

  debug(message: string, context?: LogContext) {
    if (this.isDev) {
      console.debug(`[DEBUG] ${message}`, context);
    }
  }
}

export const logger = new Logger();