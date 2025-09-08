/**
 * Production-ready logging system
 * Replaces all console.log calls with conditional logging
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component?: string;
  message: string;
  data?: any;
  userId?: string;
}

class Logger {
  private level: LogLevel;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 100;

  constructor() {
    this.level = import.meta.env.PROD ? LogLevel.WARN : LogLevel.DEBUG;
  }

  private log(level: LogLevel, message: string, data?: any, component?: string) {
    if (level > this.level) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      component,
      data,
      userId: this.getCurrentUserId(),
    };

    // Store log entry
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Output to console in development
    if (!import.meta.env.PROD) {
      const prefix = `[${component || 'App'}]`;
      switch (level) {
        case LogLevel.ERROR:
          console.error(prefix, message, data);
          break;
        case LogLevel.WARN:
          console.warn(prefix, message, data);
          break;
        case LogLevel.INFO:
          console.info(prefix, message, data);
          break;
        case LogLevel.DEBUG:
          console.log(prefix, message, data);
          break;
      }
    }

    // Send errors to monitoring service in production
    if (import.meta.env.PROD && level === LogLevel.ERROR) {
      this.sendToMonitoring(entry);
    }
  }

  private getCurrentUserId(): string | undefined {
    try {
      // Get user ID from context or auth
      return undefined; // Implement based on auth system
    } catch {
      return undefined;
    }
  }

  private async sendToMonitoring(entry: LogEntry) {
    try {
      // Send to monitoring service (Sentry, LogRocket, etc.)
      console.error('Production Error:', entry);
    } catch {
      // Fail silently
    }
  }

  error(message: string, data?: any, component?: string) {
    this.log(LogLevel.ERROR, message, data, component);
  }

  warn(message: string, data?: any, component?: string) {
    this.log(LogLevel.WARN, message, data, component);
  }

  info(message: string, data?: any, component?: string) {
    this.log(LogLevel.INFO, message, data, component);
  }

  debug(message: string, data?: any, component?: string) {
    this.log(LogLevel.DEBUG, message, data, component);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }
}

export const logger = new Logger();

// Helper functions for common patterns
export const logApiCall = (endpoint: string, duration: number, success: boolean) => {
  logger.info(`API Call: ${endpoint}`, { duration, success }, 'API');
};

export const logUserAction = (action: string, data?: any) => {
  logger.info(`User Action: ${action}`, data, 'USER');
};

export const logPerformance = (metric: string, value: number) => {
  logger.debug(`Performance: ${metric}`, { value }, 'PERF');
};

export const logError = (error: Error, context?: string) => {
  logger.error(`Error in ${context || 'Unknown'}`, {
    message: error.message,
    stack: error.stack,
  }, 'ERROR');
};