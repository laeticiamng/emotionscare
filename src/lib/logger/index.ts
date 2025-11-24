/**
 * Production Logger System - EmotionsCare
 * Système de logging unifié avec niveaux et contexte
 * Includes optional Sentry integration for production error tracking
 */

// Lazy-load Sentry to avoid bundle bloat in dev
let Sentry: any = null;

// Initialize Sentry if DSN is configured
const initSentry = async () => {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

  if (sentryDsn && !import.meta.env.DEV) {
    try {
      // Dynamically import Sentry only in production with valid DSN
      const SentryModule = await import('@sentry/react');
      Sentry = SentryModule;

      Sentry.init({
        dsn: sentryDsn,
        environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'production',
        tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
        replaysSessionSampleRate: parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE || '0.1'),
        replaysOnErrorSampleRate: parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || '1.0'),
        integrations: [
          new Sentry.BrowserTracing(),
          new Sentry.Replay(),
        ],
      });

      console.info('[Logger] Sentry initialized successfully');
    } catch (error) {
      console.warn('[Logger] Failed to initialize Sentry:', error);
    }
  }
};

// Initialize Sentry on module load
initSentry();

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';
export type LogContext = 'AUTH' | 'API' | 'UI' | 'SCAN' | 'VR' | 'MUSIC' | 'ANALYTICS' | 'SYSTEM' | 'ERROR_BOUNDARY' | 'SESSION' | 'CONSENT' | 'SOCIAL' | 'NYVEE' | 'WHO5' | 'STAI6' | 'BREATH' | 'FLASH' | 'MIXER' | 'SCORES' | 'COACH' | 'EMAIL' | 'GDPR' | 'MODULE' | 'LIB' | 'HOOK' | 'PAGE';

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

    // Send to Sentry in production
    if (!this.isDevelopment && Sentry) {
      try {
        if (error instanceof Error) {
          Sentry.captureException(error, {
            tags: { context },
            extra: { message, sessionId: this.sessionId },
            level: 'error',
          });
        } else {
          Sentry.captureMessage(message, {
            tags: { context },
            extra: { error, sessionId: this.sessionId },
            level: 'error',
          });
        }
      } catch (sentryError) {
        console.warn('[Logger] Failed to send error to Sentry:', sentryError);
      }
    }
  }

  critical(message: string, error?: Error | any, context: LogContext = 'SYSTEM'): void {
    console.error(`[${context}] CRITICAL: ${message}`, error || '')

    // Send critical alert to Sentry with highest priority
    if (!this.isDevelopment && Sentry) {
      try {
        if (error instanceof Error) {
          Sentry.captureException(error, {
            tags: { context, critical: 'true' },
            extra: { message, sessionId: this.sessionId },
            level: 'fatal',
          });
        } else {
          Sentry.captureMessage(message, {
            tags: { context, critical: 'true' },
            extra: { error, sessionId: this.sessionId },
            level: 'fatal',
          });
        }
      } catch (sentryError) {
        console.warn('[Logger] Failed to send critical alert to Sentry:', sentryError);
      }
    }
  }

  getSessionId(): string {
    return this.sessionId
  }
}

export const logger = new Logger()
export default logger
