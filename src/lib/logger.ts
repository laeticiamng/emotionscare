/**
 * Production-safe logger utility
 * Replaces console.log calls with a proper logging system
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  context?: string;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  private createLogEntry(level: LogLevel, message: string, data?: any, context?: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context
    };
  }

  private storeLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }
  }

  debug(message: string, data?: any, context?: string) {
    const entry = this.createLogEntry('debug', message, data, context);
    this.storeLog(entry);
    
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  }

  info(message: string, data?: any, context?: string) {
    const entry = this.createLogEntry('info', message, data, context);
    this.storeLog(entry);
    
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, data || '');
    }
  }

  warn(message: string, data?: any, context?: string) {
    const entry = this.createLogEntry('warn', message, data, context);
    this.storeLog(entry);
    
    console.warn(`[WARN] ${message}`, data || '');
  }

  error(message: string, data?: any, context?: string) {
    const entry = this.createLogEntry('error', message, data, context);
    this.storeLog(entry);
    
    console.error(`[ERROR] ${message}`, data || '');
    
    // In production, could send to monitoring service
    if (!this.isDevelopment) {
      this.reportToMonitoring(entry);
    }
  }

  private reportToMonitoring(entry: LogEntry) {
    // Placeholder for production monitoring integration
    // Could integrate with Sentry, LogRocket, etc.
    try {
      // Example: Send to monitoring service
      // await fetch('/api/logs', { 
      //   method: 'POST', 
      //   body: JSON.stringify(entry) 
      // });
    } catch (err) {
      // Silent fail for monitoring errors
    }
  }

  // Get recent logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
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