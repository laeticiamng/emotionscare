/**
 * Production-safe logger utility with PII scrubbing
 * Replaces console.log calls with a structured logging system
 */

import { aiMonitoring, captureMessage } from '@/lib/ai-monitoring';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  context?: string;
}

const SENSITIVE_KEYWORDS = [
  'token',
  'secret',
  'password',
  'authorization',
  'cookie',
  'session',
  'email',
  'phone',
  'address',
  'name',
  'user',
  'userid',
  'id',
  'text',
  'message',
  'content',
  'body',
  'summary',
];

const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const TOKEN_REGEX = /(bearer\s+[A-Z0-9\-_.+/=]+)|([A-Z0-9]{16,})/gi;

const redactString = (value: string, shouldRedactFully: boolean): string => {
  const sanitized = value
    .replace(EMAIL_REGEX, '[redacted-email]')
    .replace(TOKEN_REGEX, (match) => (match.toLowerCase().startsWith('bearer') ? 'Bearer [redacted]' : '[redacted-token]'));

  if (shouldRedactFully) {
    return sanitized.length <= 4 ? '[redacted]' : `${sanitized.slice(0, 4)}…[redacted]`;
  }

  return sanitized.length > 512 ? `${sanitized.slice(0, 512)}…` : sanitized;
};

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  private shouldRedact(keyPath: string[]): boolean {
    return keyPath.some((key) => SENSITIVE_KEYWORDS.some((keyword) => key.includes(keyword)));
  }

  private sanitize(value: unknown, keyPath: string[] = []): unknown {
    if (value === null || value === undefined) {
      return value;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      return value.slice(0, 20).map((item) => this.sanitize(item, keyPath));
    }

    if (typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((acc, [key, val]) => {
        const nextPath = [...keyPath, key.toLowerCase()];
        acc[key] = this.sanitize(val, nextPath);
        return acc;
      }, {});
    }

    if (typeof value === 'string') {
      return redactString(value, this.shouldRedact(keyPath));
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return this.shouldRedact(keyPath) ? '[redacted]' : value;
    }

    return value;
  }

  private createLogEntry(level: LogLevel, message: string, data?: unknown, context?: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: this.sanitize(data),
      context,
    };
  }

  private storeLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }
  }

  private reportToMonitoring(entry: LogEntry) {
    try {
      const levelMap: Record<LogLevel, 'critical' | 'high' | 'medium' | 'low'> = {
        debug: 'low',
        info: 'low',
        warn: 'medium',
        error: 'high',
      };

      aiMonitoring.captureMessage(entry.message, levelMap[entry.level], {
        context: entry.context,
        data: entry.data,
      });
    } catch (err) {
      if (this.isDevelopment) {
        console.warn('[Logger] Failed to report to monitoring service', err);
      }
    }
  }

  private output(level: LogLevel, message: string, data?: unknown) {
    const args: unknown[] = [`[${level.toUpperCase()}] ${message}`];
    let formattedData: unknown = undefined;

    if (data !== undefined) {
      if (this.isDevelopment) {
        formattedData = data;
      } else if (typeof data === 'string') {
        formattedData = data.length > 512 ? `${data.slice(0, 512)}…` : data;
      } else {
        try {
          const serialized = JSON.stringify(data);
          formattedData = serialized && serialized.length > 512 ? `${serialized.slice(0, 512)}…` : serialized;
        } catch {
          formattedData = '[unserializable]';
        }
      }
    }

    if (formattedData !== undefined) {
      args.push(formattedData);
    }

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(...args);
        }
        break;
      case 'info':
        if (this.isDevelopment) {
          console.info(...args);
        }
        break;
      case 'warn':
        console.warn(...args);
        break;
      case 'error':
        console.error(...args);
        break;
      default:
        console.debug(...args);
    }
  }

  debug(message: string, data?: unknown, context?: string) {
    const entry = this.createLogEntry('debug', message, data, context);
    this.storeLog(entry);
    this.output('debug', message, entry.data);
  }

  info(message: string, data?: unknown, context?: string) {
    const entry = this.createLogEntry('info', message, data, context);
    this.storeLog(entry);
    this.output('info', message, entry.data);
  }

  warn(message: string, data?: unknown, context?: string) {
    const entry = this.createLogEntry('warn', message, data, context);
    this.storeLog(entry);
    this.output('warn', message, entry.data);
    if (!this.isDevelopment) {
      this.reportToMonitoring(entry);
    }
  }

  error(message: string, data?: unknown, context?: string) {
    const entry = this.createLogEntry('error', message, data, context);
    this.storeLog(entry);
    this.output('error', message, entry.data);
    this.reportToMonitoring(entry);
  }

  // Get recent logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return [...this.logs];
  }

  // Clear stored logs
  clearLogs() {
    this.logs = [];
  }

  // Export logs (for debugging or support)
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Create singleton logger instance
export const logger = new Logger();

// Convenience exports
export const debug = logger.debug.bind(logger);
export const info = logger.info.bind(logger);
export const warn = logger.warn.bind(logger);
export const error = logger.error.bind(logger);