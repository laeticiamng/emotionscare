// @ts-nocheck
/**
 * Logger - Système de logging complet avec niveaux, transports et formatage
 * Logging structuré avec support pour console, storage et remote
 */

import { redact } from './redact';

/** Niveau de log */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/** Configuration du logger */
export interface LoggerConfig {
  level: LogLevel;
  enabled: boolean;
  timestamp: boolean;
  colorize: boolean;
  prefix?: string;
  transports: LogTransport[];
  maxLogSize: number;
  redactSensitiveData: boolean;
  includeStack: boolean;
}

/** Transport de log */
export interface LogTransport {
  name: string;
  level: LogLevel;
  enabled: boolean;
  log: (entry: LogEntry) => void | Promise<void>;
}

/** Entrée de log */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  category?: string;
  meta?: unknown;
  stack?: string;
  context?: LogContext;
}

/** Contexte de log */
export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  component?: string;
  action?: string;
  [key: string]: unknown;
}

/** Stats du logger */
export interface LogStats {
  totalLogs: number;
  byLevel: Record<LogLevel, number>;
  byCategory: Record<string, number>;
  errorsLastHour: number;
  warningsLastHour: number;
}

/** Ordre des niveaux */
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4
};

/** Couleurs console */
const LOG_COLORS: Record<LogLevel, string> = {
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m',  // Green
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
  fatal: '\x1b[35m'  // Magenta
};

const RESET_COLOR = '\x1b[0m';

/** Configuration par défaut */
const DEFAULT_CONFIG: LoggerConfig = {
  level: 'info',
  enabled: true,
  timestamp: true,
  colorize: true,
  transports: [],
  maxLogSize: 1000,
  redactSensitiveData: true,
  includeStack: true
};

// Storage keys
const LOGS_KEY = 'ec_logs';
const STATS_KEY = 'ec_log_stats';

// État global
let config: LoggerConfig = { ...DEFAULT_CONFIG };
let logs: LogEntry[] = [];
let globalContext: LogContext = {};
const listeners: Array<(entry: LogEntry) => void> = [];

// Stats
const stats: LogStats = {
  totalLogs: 0,
  byLevel: { debug: 0, info: 0, warn: 0, error: 0, fatal: 0 },
  byCategory: {},
  errorsLastHour: 0,
  warningsLastHour: 0
};

/** Configurer le logger */
export function configure(userConfig: Partial<LoggerConfig>): void {
  config = { ...config, ...userConfig };
}

/** Définir le contexte global */
export function setContext(ctx: Partial<LogContext>): void {
  globalContext = { ...globalContext, ...ctx };
}

/** Effacer le contexte global */
export function clearContext(): void {
  globalContext = {};
}

/** Obtenir le contexte actuel */
export function getContext(): LogContext {
  return { ...globalContext };
}

/** Vérifier si un niveau doit être loggé */
function shouldLog(level: LogLevel): boolean {
  if (!config.enabled) return false;
  return LOG_LEVELS[level] >= LOG_LEVELS[config.level];
}

/** Formater le timestamp */
function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

/** Formater une entrée pour la console */
function formatForConsole(entry: LogEntry): string {
  const parts: string[] = [];

  if (config.colorize) {
    parts.push(LOG_COLORS[entry.level]);
  }

  if (config.timestamp) {
    parts.push(`[${formatTimestamp(entry.timestamp)}]`);
  }

  parts.push(`[${entry.level.toUpperCase()}]`);

  if (entry.category) {
    parts.push(`[${entry.category}]`);
  }

  if (config.prefix) {
    parts.push(`[${config.prefix}]`);
  }

  parts.push(entry.message);

  if (config.colorize) {
    parts.push(RESET_COLOR);
  }

  return parts.join(' ');
}

/** Créer une entrée de log */
function createEntry(
  level: LogLevel,
  message: string,
  meta?: unknown,
  category?: string
): LogEntry {
  const entry: LogEntry = {
    level,
    message,
    timestamp: Date.now(),
    category,
    context: { ...globalContext }
  };

  if (meta !== undefined) {
    entry.meta = config.redactSensitiveData ? redact(meta) : meta;
  }

  if (config.includeStack && (level === 'error' || level === 'fatal')) {
    entry.stack = new Error().stack;
  }

  return entry;
}

/** Logger une entrée */
function logEntry(entry: LogEntry): void {
  // Mettre à jour les stats
  stats.totalLogs++;
  stats.byLevel[entry.level]++;
  if (entry.category) {
    stats.byCategory[entry.category] = (stats.byCategory[entry.category] || 0) + 1;
  }

  // Stocker
  logs.push(entry);
  while (logs.length > config.maxLogSize) {
    logs.shift();
  }

  // Console
  const formatted = formatForConsole(entry);
  const consoleMethods: Record<LogLevel, (...args: unknown[]) => void> = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
    fatal: console.error
  };

  if (entry.meta !== undefined) {
    consoleMethods[entry.level](formatted, entry.meta);
  } else {
    consoleMethods[entry.level](formatted);
  }

  // Transports
  for (const transport of config.transports) {
    if (transport.enabled && LOG_LEVELS[entry.level] >= LOG_LEVELS[transport.level]) {
      try {
        transport.log(entry);
      } catch (err) {
        console.error(`Logger transport "${transport.name}" failed:`, err);
      }
    }
  }

  // Listeners
  listeners.forEach(listener => listener(entry));
}

/** Méthode de log générique */
type LogMethod = (message: string, meta?: unknown, category?: string) => void;

function safeLog(method: (...args: unknown[]) => void, message: string, meta?: unknown) {
  if (meta === undefined) {
    method.call(console, message);
    return;
  }
  method.call(console, message, redact(meta));
}

/** Logger debug */
export function debug(message: string, meta?: unknown, category?: string): void {
  if (!shouldLog('debug')) return;
  logEntry(createEntry('debug', message, meta, category));
}

/** Logger info */
export function info(message: string, meta?: unknown, category?: string): void {
  if (!shouldLog('info')) return;
  logEntry(createEntry('info', message, meta, category));
}

/** Logger warn */
export function warn(message: string, meta?: unknown, category?: string): void {
  if (!shouldLog('warn')) return;
  logEntry(createEntry('warn', message, meta, category));
  updateHourlyStats('warn');
}

/** Logger error */
export function error(message: string, error?: Error | unknown, category?: string): void {
  if (!shouldLog('error')) return;

  const meta = error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : error;

  logEntry(createEntry('error', message, meta, category));
  updateHourlyStats('error');
}

/** Logger fatal */
export function fatal(message: string, error?: Error | unknown, category?: string): void {
  if (!shouldLog('fatal')) return;

  const meta = error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : error;

  logEntry(createEntry('fatal', message, meta, category));
}

/** Mettre à jour les stats horaires */
let hourlyStatsReset = Date.now();
function updateHourlyStats(level: 'warn' | 'error'): void {
  const now = Date.now();
  if (now - hourlyStatsReset > 3600000) {
    stats.errorsLastHour = 0;
    stats.warningsLastHour = 0;
    hourlyStatsReset = now;
  }

  if (level === 'error') {
    stats.errorsLastHour++;
  } else {
    stats.warningsLastHour++;
  }
}

/** Créer un logger avec catégorie */
export function createLogger(category: string): {
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: (message: string, err?: Error | unknown) => void;
  fatal: (message: string, err?: Error | unknown) => void;
} {
  return {
    debug: (message, meta) => debug(message, meta, category),
    info: (message, meta) => info(message, meta, category),
    warn: (message, meta) => warn(message, meta, category),
    error: (message, err) => error(message, err, category),
    fatal: (message, err) => fatal(message, err, category)
  };
}

/** Créer un logger enfant avec contexte additionnel */
export function child(context: Partial<LogContext>): typeof log {
  const originalContext = { ...globalContext };
  setContext({ ...originalContext, ...context });

  return {
    ...log,
    dispose: () => {
      globalContext = originalContext;
    }
  } as typeof log & { dispose: () => void };
}

/** Obtenir les logs */
export function getLogs(filters?: {
  level?: LogLevel[];
  category?: string[];
  startTime?: number;
  endTime?: number;
  limit?: number;
}): LogEntry[] {
  let result = [...logs];

  if (filters) {
    if (filters.level?.length) {
      result = result.filter(l => filters.level!.includes(l.level));
    }
    if (filters.category?.length) {
      result = result.filter(l => l.category && filters.category!.includes(l.category));
    }
    if (filters.startTime) {
      result = result.filter(l => l.timestamp >= filters.startTime!);
    }
    if (filters.endTime) {
      result = result.filter(l => l.timestamp <= filters.endTime!);
    }
    if (filters.limit) {
      result = result.slice(-filters.limit);
    }
  }

  return result;
}

/** Obtenir les derniers logs */
export function getLastLogs(count: number, level?: LogLevel): LogEntry[] {
  let result = level ? logs.filter(l => l.level === level) : logs;
  return result.slice(-count);
}

/** Effacer les logs */
export function clearLogs(): void {
  logs = [];
  debug('Logs cleared', undefined, 'LOGGER');
}

/** Obtenir les stats */
export function getStats(): LogStats {
  return { ...stats };
}

/** S'abonner aux logs */
export function subscribe(listener: (entry: LogEntry) => void): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}

/** Ajouter un transport */
export function addTransport(transport: LogTransport): void {
  config.transports.push(transport);
  debug('Transport added', { name: transport.name }, 'LOGGER');
}

/** Supprimer un transport */
export function removeTransport(name: string): boolean {
  const index = config.transports.findIndex(t => t.name === name);
  if (index > -1) {
    config.transports.splice(index, 1);
    debug('Transport removed', { name }, 'LOGGER');
    return true;
  }
  return false;
}

/** Transport console (par défaut) */
export const consoleTransport: LogTransport = {
  name: 'console',
  level: 'debug',
  enabled: true,
  log: () => {} // Déjà géré dans logEntry
};

/** Transport localStorage */
export const localStorageTransport: LogTransport = {
  name: 'localStorage',
  level: 'warn',
  enabled: false,
  log: (entry) => {
    try {
      const stored = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
      stored.push(entry);
      while (stored.length > 500) stored.shift();
      localStorage.setItem(LOGS_KEY, JSON.stringify(stored));
    } catch {
      // Ignorer les erreurs de storage
    }
  }
};

/** Transport remote (exemple) */
export function createRemoteTransport(endpoint: string): LogTransport {
  const queue: LogEntry[] = [];
  let flushing = false;

  const flush = async () => {
    if (flushing || queue.length === 0) return;
    flushing = true;

    const batch = queue.splice(0, 50);
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch)
      });
    } catch {
      // Remettre dans la queue en cas d'erreur
      queue.unshift(...batch);
    }
    flushing = false;
  };

  // Flush périodique
  if (typeof window !== 'undefined') {
    setInterval(flush, 10000);
  }

  return {
    name: 'remote',
    level: 'error',
    enabled: true,
    log: (entry) => {
      queue.push(entry);
      if (queue.length >= 50) flush();
    }
  };
}

/** Exporter les logs en JSON */
export function exportLogs(): string {
  return JSON.stringify({
    logs,
    stats: getStats(),
    config: {
      level: config.level,
      transports: config.transports.map(t => t.name)
    },
    exportedAt: new Date().toISOString()
  }, null, 2);
}

/** Importer des logs */
export function importLogs(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data.logs)) {
      logs.push(...data.logs);
      while (logs.length > config.maxLogSize) {
        logs.shift();
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/** Mesurer la performance d'une opération */
export function measure<T>(
  name: string,
  operation: () => T,
  category?: string
): T {
  const start = performance.now();
  try {
    const result = operation();
    const duration = performance.now() - start;
    debug(`${name} completed`, { duration: `${duration.toFixed(2)}ms` }, category);
    return result;
  } catch (err) {
    const duration = performance.now() - start;
    error(`${name} failed`, err, category);
    throw err;
  }
}

/** Mesurer une opération async */
export async function measureAsync<T>(
  name: string,
  operation: () => Promise<T>,
  category?: string
): Promise<T> {
  const start = performance.now();
  try {
    const result = await operation();
    const duration = performance.now() - start;
    debug(`${name} completed`, { duration: `${duration.toFixed(2)}ms` }, category);
    return result;
  } catch (err) {
    const duration = performance.now() - start;
    error(`${name} failed`, err, category);
    throw err;
  }
}

/** Logger avec timer */
export function timer(name: string, category?: string): {
  end: () => number;
  lap: (label: string) => number;
} {
  const start = performance.now();
  let lastLap = start;

  return {
    end: () => {
      const duration = performance.now() - start;
      debug(`${name} finished`, { duration: `${duration.toFixed(2)}ms` }, category);
      return duration;
    },
    lap: (label: string) => {
      const now = performance.now();
      const lapTime = now - lastLap;
      lastLap = now;
      debug(`${name} - ${label}`, { lapTime: `${lapTime.toFixed(2)}ms` }, category);
      return lapTime;
    }
  };
}

/** Groupe de logs */
export function group(label: string): void {
  console.group(label);
}

export function groupEnd(): void {
  console.groupEnd();
}

/** Table de données */
export function table(data: unknown, columns?: string[]): void {
  console.table(data, columns);
}

// Export par défaut pour compatibilité
export const log: Record<'info' | 'warn' | 'error' | 'debug', LogMethod> & {
  fatal: (message: string, err?: Error | unknown) => void;
} = {
  debug,
  info,
  warn,
  error: (message, meta) => {
    if (meta instanceof Error) {
      error(message, meta);
    } else {
      error(message, meta as Error);
    }
  },
  fatal
};

export default {
  configure,
  setContext,
  clearContext,
  getContext,
  debug,
  info,
  warn,
  error,
  fatal,
  createLogger,
  child,
  getLogs,
  getLastLogs,
  clearLogs,
  getStats,
  subscribe,
  addTransport,
  removeTransport,
  exportLogs,
  importLogs,
  measure,
  measureAsync,
  timer,
  group,
  groupEnd,
  table,
  log
};
