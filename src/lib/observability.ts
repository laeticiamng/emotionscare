// @ts-nocheck
/**
 * Observabilité et monitoring centralisé
 * Logs, métriques, traces et analyses d'erreurs
 */

// ============= Types et interfaces =============

import { logger } from '@/lib/logger';

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  category: string;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
}

export interface MetricEntry {
  name: string;
  value: number;
  unit: string;
  tags?: Record<string, string>;
  timestamp: string;
}

export interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  entryType: string;
  url?: string;
}

export interface ErrorEntry extends LogEntry {
  level: 'error';
  stack?: string;
  errorCode?: string;
  userMessage: string;
}

// ============= Configuration =============

const CONFIG = {
  maxLogs: 1000,
  batchSize: 50,
  flushInterval: 30000, // 30 secondes
  enableConsoleLog: import.meta.env.DEV,
  enableRemoteLogging: import.meta.env.PROD,
};

// ============= Storage local =============

class ObservabilityStorage {
  private logs: LogEntry[] = [];
  private metrics: MetricEntry[] = [];
  private errors: ErrorEntry[] = [];

  addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > CONFIG.maxLogs) {
      this.logs = this.logs.slice(-CONFIG.maxLogs);
    }
  }

  addMetric(entry: MetricEntry) {
    this.metrics.push(entry);
    if (this.metrics.length > CONFIG.maxLogs) {
      this.metrics = this.metrics.slice(-CONFIG.maxLogs);
    }
  }

  addError(entry: ErrorEntry) {
    this.errors.push(entry);
    if (this.errors.length > CONFIG.maxLogs) {
      this.errors = this.errors.slice(-CONFIG.maxLogs);
    }
  }

  flush() {
    const batch = {
      logs: [...this.logs],
      metrics: [...this.metrics],
      errors: [...this.errors],
    };
    
    this.logs = [];
    this.metrics = [];
    this.errors = [];
    
    return batch;
  }

  getLogs(level?: LogEntry['level'], category?: string) {
    return this.logs.filter(log => 
      (!level || log.level === level) && 
      (!category || log.category === category)
    );
  }
}

// ============= Logger principal =============

class Logger {
  private storage = new ObservabilityStorage();
  private sessionId = crypto.randomUUID();
  private userId?: string;

  private createEntry(
    level: LogEntry['level'],
    category: string,
    message: string,
    context?: Record<string, any>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      context,
      userId: this.userId,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  debug(category: string, message: string, context?: Record<string, any>) {
    const entry = this.createEntry('debug', category, message, context);
    this.storage.addLog(entry);
    
    if (CONFIG.enableConsoleLog) {
      console.debug(`[${category}] ${message}`, context);
    }
  }

  info(category: string, message: string, context?: Record<string, any>) {
    const entry = this.createEntry('info', category, message, context);
    this.storage.addLog(entry);
    
    if (CONFIG.enableConsoleLog) {
      logger.info(`[${category}] ${message}`, context, 'LIB');
    }
  }

  warn(category: string, message: string, context?: Record<string, any>) {
    const entry = this.createEntry('warn', category, message, context);
    this.storage.addLog(entry);
    
    if (CONFIG.enableConsoleLog) {
      logger.warn(`[${category}] ${message}`, context, 'LIB');
    }
  }

  error(category: string, message: string, error?: Error, userMessage?: string, context?: Record<string, any>) {
    const errorEntry: ErrorEntry = {
      ...this.createEntry('error', category, message, context),
      stack: error?.stack,
      errorCode: (error as any)?.code,
      userMessage: userMessage || 'Une erreur inattendue s\'est produite',
    };
    
    this.storage.addError(errorEntry);
    
    if (CONFIG.enableConsoleLog) {
      logger.error(`[${category}] ${message}`, error, context, 'LIB');
    }
  }

  metric(name: string, value: number, unit = 'count', tags?: Record<string, string>) {
    const entry: MetricEntry = {
      name,
      value,
      unit,
      tags,
      timestamp: new Date().toISOString(),
    };
    
    this.storage.addMetric(entry);
  }

  flush() {
    return this.storage.flush();
  }

  getLogs(level?: LogEntry['level'], category?: string) {
    return this.storage.getLogs(level, category);
  }
}

// ============= Métriques de performance =============

class PerformanceMonitor {
  private observer?: PerformanceObserver;
  private measurements = new Map<string, number>();

  constructor(private logger: Logger) {
    this.setupPerformanceObserver();
  }

  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });

      try {
        this.observer.observe({ 
          entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift'] 
        });
      } catch (error) {
        this.logger.warn('performance', 'PerformanceObserver setup failed', { error });
      }
    }
  }

  private processPerformanceEntry(entry: PerformanceEntry) {
    const { name, startTime, duration } = entry;
    
    this.logger.metric(`performance.${entry.entryType}`, duration, 'ms', {
      name: name || 'unknown',
      url: window.location.pathname,
    });

    // Web Vitals spécifiques
    if (entry.entryType === 'paint') {
      if (name === 'first-contentful-paint') {
        this.logger.info('performance', `FCP: ${duration}ms`, { fcp: duration });
      }
    }
    
    if (entry.entryType === 'largest-contentful-paint') {
      this.logger.info('performance', `LCP: ${startTime}ms`, { lcp: startTime });
    }
  }

  measureStart(operation: string) {
    this.measurements.set(operation, performance.now());
  }

  measureEnd(operation: string, context?: Record<string, any>) {
    const startTime = this.measurements.get(operation);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.measurements.delete(operation);
      
      this.logger.metric(`operation.${operation}`, duration, 'ms');
      this.logger.debug('performance', `Operation ${operation} took ${duration.toFixed(2)}ms`, {
        operation,
        duration,
        ...context,
      });
      
      return duration;
    }
    return null;
  }

  disconnect() {
    this.observer?.disconnect();
  }
}

// ============= Tracking des interactions utilisateur =============

class UserInteractionTracker {
  constructor(private logger: Logger) {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Clics sur boutons et liens
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const button = target.closest('button, a[href], [role="button"]');
      
      if (button) {
        const label = button.textContent?.trim() || button.getAttribute('aria-label') || 'unlabeled';
        const href = button.getAttribute('href');
        
        this.logger.info('user_interaction', 'Button click', {
          label,
          href,
          tagName: button.tagName.toLowerCase(),
          className: button.className,
        });
      }
    });

    // Navigation
    window.addEventListener('popstate', () => {
      this.logger.info('navigation', 'Browser navigation', {
        url: window.location.href,
        referrer: document.referrer,
      });
    });

    // Erreurs JavaScript
    window.addEventListener('error', (event) => {
      this.logger.error(
        'javascript', 
        'Unhandled error', 
        new Error(event.message),
        'Une erreur technique s\'est produite',
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }
      );
    });

    // Promesses rejetées
    window.addEventListener('unhandledrejection', (event) => {
      this.logger.error(
        'javascript', 
        'Unhandled promise rejection', 
        event.reason,
        'Une erreur technique s\'est produite',
        { reason: event.reason }
      );
    });
  }
}

// ============= API publique =============

export const logger = new Logger();
export const performanceMonitor = new PerformanceMonitor(logger);
export const userTracker = new UserInteractionTracker(logger);

// Utilitaires pour les composants
export const useObservability = () => {
  return {
    logger,
    
    // Logging rapide pour les composants
    logPageView: (pageName: string, context?: Record<string, any>) => {
      logger.info('page_view', `Page viewed: ${pageName}`, {
        page: pageName,
        url: window.location.href,
        ...context,
      });
    },
    
    logUserAction: (action: string, context?: Record<string, any>) => {
      logger.info('user_action', action, context);
    },
    
    logError: (error: Error, userMessage?: string, context?: Record<string, any>) => {
      logger.error('component', error.message, error, userMessage, context);
    },
    
    measureOperation: {
      start: (operation: string) => performanceMonitor.measureStart(operation),
      end: (operation: string, context?: Record<string, any>) => 
        performanceMonitor.measureEnd(operation, context),
    },
  };
};

// Initialisation automatique
if (typeof window !== 'undefined') {
  // Flush périodique des logs
  setInterval(() => {
    const batch = logger.flush();
    
    if (CONFIG.enableRemoteLogging && (batch.logs.length > 0 || batch.errors.length > 0)) {
      // Remote logging service integration (Sentry, LogRocket, etc.) will be added later
      console.debug('Batch flush:', batch);
    }
  }, CONFIG.flushInterval);
  
  logger.info('observability', 'Observability system initialized', {
    enableConsoleLog: CONFIG.enableConsoleLog,
    enableRemoteLogging: CONFIG.enableRemoteLogging,
    sessionId: logger['sessionId'],
  });
}